// Declare modules
pub mod entrypoint;
pub mod instruction;
pub mod processor;

// Re-export processor for use in entrypoint
pub use processor::Processor;
