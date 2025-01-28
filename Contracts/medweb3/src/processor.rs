use crate::{instruction::MedWeb3Instruction, state::BatchAccount};
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
use borsh::BorshSerialize; // Importing the trait for serialize method

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
            MedWeb3Instruction::TransferOwnership { batch_id, new_owner } => {
                msg!("Instruction: TransferOwnership");
                Self::process_transfer_ownership(program_id, accounts, &batch_id, &new_owner)
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
        _program_id: &Pubkey,
        _accounts: &[AccountInfo],
        batch_id: &str,
        new_owner: &str,
    ) -> ProgramResult {
        msg!("Transferring ownership:");
        msg!("Batch ID: {}", batch_id);
        msg!("New Owner: {}", new_owner);

        // Placeholder logic (to be replaced with account handling)
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
