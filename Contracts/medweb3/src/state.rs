use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::pubkey::Pubkey;

/// Struct for storing batch data in an account
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct BatchAccount {
    pub batch_id: String,       // Unique ID for the batch
    pub manufacturer: Pubkey,   // Public key of the manufacturer
    pub current_owner: Pubkey,  // Public key of the current owner
}

impl BatchAccount {
    /// Calculates the size of the account data
    pub fn get_account_size(batch_id_len: usize) -> usize {
        // Size of all fields
        4 + batch_id_len + 32 + 32 // 4 bytes for string length, batch_id, manufacturer, current_owner
    }
}
