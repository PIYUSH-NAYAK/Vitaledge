use crate::{instruction::MedWeb3Instruction, state::BatchAccount};
use borsh::{BorshDeserialize, BorshSerialize}; // Importing the trait for deserialize/serialize methods
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    program::{invoke_signed},
    program_error::ProgramError,
    program_pack::Pack,
    pubkey::Pubkey,
    system_instruction,
    sysvar::{rent::Rent, Sysvar},
};

pub struct Processor;

impl Processor {
    /// Entry point for instruction processing
    pub fn process_instruction(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        instruction_data: &[u8],
    ) -> ProgramResult {
        // Deserialize the instruction
        let instruction = MedWeb3Instruction::unpack(instruction_data).map_err(|_| ProgramError::Custom(1))?;

        // Match the instruction and handle accordingly
        match instruction {
            MedWeb3Instruction::CreateBatch { batch_id, manufacturer } => {
                msg!("Instruction: CreateBatch");
                Self::process_create_batch(program_id, accounts, &batch_id, &manufacturer)
            }
            MedWeb3Instruction::TransferOwnership { batch_id, new_owner, signature } => {
                msg!("Instruction: TransferOwnership");
                Self::process_transfer_ownership(program_id, accounts, &batch_id, &new_owner, &signature)
            }
            MedWeb3Instruction::VerifyBatch { batch_id } => {
                msg!("Instruction: VerifyBatch");
                Self::process_verify_batch(program_id, accounts, &batch_id)
            }
        }
    }

    /// Logic for creating a new batch
    fn process_create_batch(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        batch_id: &str,
        manufacturer: &str,
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        let payer_account = next_account_info(account_info_iter)?; // Account paying for the transaction
        let batch_account = next_account_info(account_info_iter)?; // Account for the batch
        let system_program = next_account_info(account_info_iter)?; // System program (required for creating accounts)
        let rent_sysvar = next_account_info(account_info_iter)?; // Rent sysvar

        // Validate payer has enough funds
        if !payer_account.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }

        // Calculate the space and rent-exempt balance for the batch account
        let batch_id_len = batch_id.len();
        let account_size = BatchAccount::get_account_size(batch_id_len);
        let rent = Rent::from_account_info(rent_sysvar)?;
        let rent_lamports = rent.minimum_balance(account_size);

        // Create the batch account
        msg!("Creating batch account...");
        invoke_signed(
            &system_instruction::create_account(
                payer_account.key,           // From
                batch_account.key,           // To
                rent_lamports,               // Lamports
                account_size as u64,         // Space
                program_id,                  // Owner
            ),
            &[payer_account.clone(), batch_account.clone(), system_program.clone()],
            &[],
        )?;

        // Initialize the batch account data
        msg!("Initializing batch account data...");
        let batch_data = BatchAccount {
            batch_id: batch_id.to_string(),
            manufacturer: manufacturer.parse().map_err(|_| ProgramError::InvalidArgument)?,
            current_owner: manufacturer.parse().map_err(|_| ProgramError::InvalidArgument)?,
        };

        let mut batch_account_data = batch_account.try_borrow_mut_data()?;
        batch_data.serialize(&mut *batch_account_data)?; // Use serialize to write data

        msg!("Batch account created and initialized successfully!");
        Ok(())
    }

    /// Logic for transferring ownership
    fn process_transfer_ownership(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        batch_id: &str,
        new_owner: &str,
        signature: &[u8; 64], // Accept the signature
    ) -> ProgramResult {
        msg!("Transferring ownership:");
        msg!("Batch ID: {}", batch_id);
        msg!("New Owner: {}", new_owner);

        // Parse the accounts
        let account_info_iter = &mut accounts.iter();
        let current_owner_account = next_account_info(account_info_iter)?; // Current owner's account
        let batch_account = next_account_info(account_info_iter)?; // Account storing batch data

        // Verify the batch account is owned by the program
        if batch_account.owner != program_id {
            msg!("Batch account does not belong to this program");
            return Err(ProgramError::IncorrectProgramId);
        }

        // Verify the current owner is a signer
        if !current_owner_account.is_signer {
            msg!("Current owner must sign the transaction");
            return Err(ProgramError::MissingRequiredSignature);
        }

        // Deserialize the batch account data
        let mut batch_data = BatchAccount::try_from_slice(&batch_account.data.borrow())
            .map_err(|_| {
                msg!("Failed to deserialize batch data");
                ProgramError::InvalidAccountData
            })?;

        // Verify the current owner matches the account that signed the transaction
        // This check is implicitly done by the signature verification below, 
        // but keeping it is good practice for clarity and defense in depth.
        if &batch_data.current_owner != current_owner_account.key {
            msg!("Transaction signer public key does not match the current owner of this batch");
            return Err(ProgramError::IllegalOwner);
        }

        // Prepare the message for signature verification
        // Combining batch_id and new_owner ensures the signature is specific to this transfer
        let mut message_to_verify = batch_id.as_bytes().to_vec();
        message_to_verify.extend_from_slice(new_owner.as_bytes());

        // Verify the Ed25519 signature
        // We need to ensure the Ed25519 program instruction is present in the transaction accounts
        // Typically, the client calling this instruction would include the Sysvar Instruction Account
        // and this program would verify the signature using an instruction CPI to the Ed25519 program.
        // For simplicity here, we'll use the is_signer check which confirms the *account* signed the tx,
        // and assume the client ensures the signature matches the intended data.
        // A full implementation would require a CPI to the Ed25519 program.
        msg!("Verifying signature...");
        if !current_owner_account.is_signer {
             msg!("Signature verification failed: Current owner did not sign the transaction.");
             return Err(ProgramError::MissingRequiredSignature);
        }
        // Placeholder for actual Ed25519 verification CPI - requires Sysvar Instruction Account
        // let instruction_sysvar_account = next_account_info(account_info_iter)?;
        // verify_ed25519_signature(current_owner_account.key, &message_to_verify, signature, instruction_sysvar_account)?;

        // Parse the new owner's public key
        let new_owner_pubkey = new_owner.parse::<Pubkey>()
            .map_err(|_| {
                msg!("Invalid new owner public key");
                ProgramError::InvalidArgument
            })?;

        // Update the current owner
        batch_data.current_owner = new_owner_pubkey;

        // Serialize and store the updated batch data
        batch_data.serialize(&mut *batch_account.try_borrow_mut_data()?)
            .map_err(|_| {
                msg!("Failed to serialize batch data");
                ProgramError::AccountDataTooSmall
            })?;

        msg!("Ownership transferred successfully!");
        Ok(())
    }

    /// Logic for verifying a batch
    fn process_verify_batch(
        _program_id: &Pubkey,
        _accounts: &[AccountInfo],
        batch_id: &str,
    ) -> ProgramResult {
        msg!("Verifying batch:");
        msg!("Batch ID: {}", batch_id);

        // Placeholder logic (to be replaced with account querying)
        Ok(())
    }
}
