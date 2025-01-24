use borsh::{BorshDeserialize, BorshSerialize};

// Enum representing the instructions our program can handle
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum MedWeb3Instruction {
    /// Create a new batch of medicine
    /// Fields: [batch_id, manufacturer]
    CreateBatch { batch_id: String, manufacturer: String },

    /// Transfer ownership of a batch
    /// Fields: [batch_id, new_owner]
    TransferOwnership { batch_id: String, new_owner: String },

    /// Verify a batch's traceability
    /// Fields: [batch_id]
    VerifyBatch { batch_id: String },
}

impl MedWeb3Instruction {
    /// Deserialize instruction data into a `MedWeb3Instruction`
    pub fn unpack(input: &[u8]) -> Result<Self, &'static str> {
        Self::try_from_slice(input).map_err(|_| "Failed to deserialize instruction data")
    }
}
