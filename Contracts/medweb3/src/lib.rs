// Declare modules
pub mod entrypoint;
pub mod instruction;
pub mod processor;
pub mod state; // New state module

// Re-export processor for use in entrypoint
pub use processor::Processor;
