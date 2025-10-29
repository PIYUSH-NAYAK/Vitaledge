use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::pubkey::Pubkey;

// Enum representing the instructions our program can handle
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum MedWeb3Instruction {
    /// Create a new batch of medicine
    /// Fields: [batch_id]
    /// The manufacturer is taken from the signer account
    CreateBatch { 
        batch_id: String,
    },

    /// Transfer ownership of a batch
    /// Fields: [new_owner]
    /// The batch account is passed as an account, not in data
    TransferOwnership { 
        new_owner: Pubkey,
    },

    /// Verify a batch's traceability
    /// No additional data needed - batch account is passed
    VerifyBatch,
}

impl MedWeb3Instruction {
    /// Deserialize instruction data into a `MedWeb3Instruction`
    pub fn unpack(input: &[u8]) -> Result<Self, &'static str> {
        Self::try_from_slice(input).map_err(|_| "Failed to deserialize instruction data")
    }
}
