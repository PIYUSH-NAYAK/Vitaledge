use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::pubkey::Pubkey;

/// Struct for storing ownership history
#[derive(BorshSerialize, BorshDeserialize, Debug, Clone)]
pub struct OwnershipRecord {
    pub owner: Pubkey,
    pub timestamp: i64,
}

/// Struct for storing batch data in an account
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct BatchAccount {
    pub batch_id: String,       // Unique ID for the batch
    pub manufacturer: Pubkey,   // Public key of the manufacturer
    pub current_owner: Pubkey,  // Public key of the current owner
    pub created_at: i64,        // Timestamp when batch was created
    pub ownership_history: Vec<OwnershipRecord>, // History of ownership transfers
    pub is_active: bool,        // Whether batch is still active
}

impl BatchAccount {
    /// Calculates the size of the account data
    pub fn get_account_size(batch_id_len: usize) -> usize {
        // Size calculation:
        // 4 bytes for string length + batch_id length
        // 32 bytes for manufacturer Pubkey
        // 32 bytes for current_owner Pubkey
        // 8 bytes for created_at i64
        // 4 bytes for Vec length + estimated space for 10 ownership records (32 + 8 each)
        // 1 byte for is_active bool
        4 + batch_id_len + 32 + 32 + 8 + 4 + (10 * 40) + 1
    }
}
