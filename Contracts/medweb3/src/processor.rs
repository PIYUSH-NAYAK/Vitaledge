use crate::instruction::MedWeb3Instruction;
use solana_program::program_error::ProgramError;

use solana_program::{
    account_info::{AccountInfo},
    entrypoint::ProgramResult,
    msg,
    pubkey::Pubkey,
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
        _program_id: &Pubkey,
        _accounts: &[AccountInfo],
        batch_id: &str,
        manufacturer: &str,
    ) -> ProgramResult {
        msg!("Creating batch:");
        msg!("Batch ID: {}", batch_id);
        msg!("Manufacturer: {}", manufacturer);

        // Placeholder logic (to be replaced with account handling)
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
