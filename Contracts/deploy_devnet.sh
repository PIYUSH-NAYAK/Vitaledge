solana config set --url https://api.devnet.solana.com
cargo build-bpf
solana program deploy target/deploy/medweb3.so
