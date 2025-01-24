use solana_program::{
    account_info::AccountInfo, entrypoint, entrypoint::ProgramResult, pubkey::Pubkey,
};

// Declare the program's entry point
entrypoint!(process_instruction);

// The main entry function
fn process_instruction(
    program_id: &Pubkey,        // Program ID
    accounts: &[AccountInfo],  // Accounts passed to the program
    instruction_data: &[u8],   // Instruction data
) -> ProgramResult {
    // Delegate processing to the processor module
    crate::processor::Processor::process_instruction(program_id, accounts, instruction_data)
}
