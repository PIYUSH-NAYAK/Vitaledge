use crate::{instruction::MedWeb3Instruction, state::{BatchAccount, OwnershipRecord}};
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    program::invoke_signed,
    program_error::ProgramError,
    pubkey::Pubkey,
    system_instruction,
    sysvar::{rent::Rent, Sysvar, clock::Clock},
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
        let instruction = MedWeb3Instruction::unpack(instruction_data)
            .map_err(|_| ProgramError::InvalidInstructionData)?;

        // Match the instruction and handle accordingly
        match instruction {
            MedWeb3Instruction::CreateBatch { batch_id } => {
                msg!("Instruction: CreateBatch");
                Self::process_create_batch(program_id, accounts, &batch_id)
            }
            MedWeb3Instruction::TransferOwnership { new_owner } => {
                msg!("Instruction: TransferOwnership");
                Self::process_transfer_ownership(program_id, accounts, &new_owner)
            }
            MedWeb3Instruction::VerifyBatch => {
                msg!("Instruction: VerifyBatch");
                Self::process_verify_batch(program_id, accounts)
            }
        }
    }

    /// Logic for creating a new batch
    fn process_create_batch(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        batch_id: &str,
    ) -> ProgramResult {
        let account_info_iter = &mut accounts.iter();
        let payer_account = next_account_info(account_info_iter)?; // Account paying for the transaction
        let batch_account = next_account_info(account_info_iter)?; // Account for the batch
        let system_program = next_account_info(account_info_iter)?; // System program
        let rent_sysvar = next_account_info(account_info_iter)?; // Rent sysvar
        let clock_sysvar = next_account_info(account_info_iter)?; // Clock sysvar

        // Validate payer is signer
        if !payer_account.is_signer {
            msg!("Payer must be a signer");
            return Err(ProgramError::MissingRequiredSignature);
        }

        // Validate batch account is signer (new keypair)
        if !batch_account.is_signer {
            msg!("Batch account must be a signer");
            return Err(ProgramError::MissingRequiredSignature);
        }

        // Get current timestamp
        let clock = Clock::from_account_info(clock_sysvar)?;
        let current_timestamp = clock.unix_timestamp;

        // Calculate the space needed
        let batch_id_len = batch_id.len();
        let account_size = BatchAccount::get_account_size(batch_id_len);
        let rent = Rent::from_account_info(rent_sysvar)?;
        let rent_lamports = rent.minimum_balance(account_size);

        msg!("Creating batch account with {} bytes...", account_size);

        // Create the batch account
        invoke_signed(
            &system_instruction::create_account(
                payer_account.key,
                batch_account.key,
                rent_lamports,
                account_size as u64,
                program_id,
            ),
            &[payer_account.clone(), batch_account.clone(), system_program.clone()],
            &[],
        )?;

        // Initialize the batch account data
        msg!("Initializing batch account data...");
        
        // Create initial ownership record
        let initial_ownership = OwnershipRecord {
            owner: *payer_account.key,
            timestamp: current_timestamp,
        };

        let batch_data = BatchAccount {
            batch_id: batch_id.to_string(),
            manufacturer: *payer_account.key,
            current_owner: *payer_account.key,
            created_at: current_timestamp,
            ownership_history: vec![initial_ownership],
            is_active: true,
        };

        // Serialize and write data
        let mut batch_account_data = batch_account.try_borrow_mut_data()?;
        batch_data.serialize(&mut *batch_account_data)
            .map_err(|_| ProgramError::AccountDataTooSmall)?;

        msg!("Batch created successfully!");
        msg!("Batch ID: {}", batch_id);
        msg!("Manufacturer: {}", payer_account.key);
        msg!("Batch Account: {}", batch_account.key);
        
        Ok(())
    }

    /// Logic for transferring ownership
    fn process_transfer_ownership(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        new_owner: &Pubkey,
    ) -> ProgramResult {
        msg!("Transferring ownership to: {}", new_owner);

        let account_info_iter = &mut accounts.iter();
        let current_owner_account = next_account_info(account_info_iter)?;
        let batch_account = next_account_info(account_info_iter)?;
        let clock_sysvar = next_account_info(account_info_iter)?;

        // Verify batch account is owned by program
        if batch_account.owner != program_id {
            msg!("Batch account does not belong to this program");
            return Err(ProgramError::IncorrectProgramId);
        }

        // Verify current owner is signer
        if !current_owner_account.is_signer {
            msg!("Current owner must sign the transaction");
            return Err(ProgramError::MissingRequiredSignature);
        }

        // Get current timestamp
        let clock = Clock::from_account_info(clock_sysvar)?;
        let current_timestamp = clock.unix_timestamp;

        // Deserialize batch data
        let mut batch_data = BatchAccount::try_from_slice(&batch_account.data.borrow())
            .map_err(|_| {
                msg!("Failed to deserialize batch data");
                ProgramError::InvalidAccountData
            })?;

        // Verify current owner
        if &batch_data.current_owner != current_owner_account.key {
            msg!("Signer is not the current owner");
            return Err(ProgramError::IllegalOwner);
        }

        // Verify batch is active
        if !batch_data.is_active {
            msg!("Batch is not active");
            return Err(ProgramError::InvalidAccountData);
        }

        // Create new ownership record
        let new_ownership_record = OwnershipRecord {
            owner: *new_owner,
            timestamp: current_timestamp,
        };

        // Update batch data
        batch_data.current_owner = *new_owner;
        batch_data.ownership_history.push(new_ownership_record);

        // Serialize updated data
        batch_data.serialize(&mut *batch_account.try_borrow_mut_data()?)
            .map_err(|_| {
                msg!("Failed to serialize batch data");
                ProgramError::AccountDataTooSmall
            })?;

        msg!("Ownership transferred successfully!");
        msg!("New owner: {}", new_owner);
        msg!("Total ownership changes: {}", batch_data.ownership_history.len());

        Ok(())
    }

    /// Logic for verifying a batch
    fn process_verify_batch(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
    ) -> ProgramResult {
        msg!("Verifying batch...");

        let account_info_iter = &mut accounts.iter();
        let batch_account = next_account_info(account_info_iter)?;

        // Verify batch account is owned by program
        if batch_account.owner != program_id {
            msg!("Batch account does not belong to this program");
            return Err(ProgramError::IncorrectProgramId);
        }

        // Deserialize batch data
        let batch_data = BatchAccount::try_from_slice(&batch_account.data.borrow())
            .map_err(|_| {
                msg!("Failed to deserialize batch data");
                ProgramError::InvalidAccountData
            })?;

        // Log batch information
        msg!("✅ Batch Verified!");
        msg!("Batch ID: {}", batch_data.batch_id);
        msg!("Manufacturer: {}", batch_data.manufacturer);
        msg!("Current Owner: {}", batch_data.current_owner);
        msg!("Created At: {}", batch_data.created_at);
        msg!("Active: {}", batch_data.is_active);
        msg!("Ownership Changes: {}", batch_data.ownership_history.len());
        
        // Log ownership history
        for (index, record) in batch_data.ownership_history.iter().enumerate() {
            msg!("  {}. Owner: {} (at: {})", index + 1, record.owner, record.timestamp);
        }

        Ok(())
    }
}
