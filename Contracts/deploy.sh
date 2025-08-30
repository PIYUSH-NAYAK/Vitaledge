#!/bin/bash

# Solana Smart Contract Deployment Script
# Usage: ./deploy.sh [network] [keypair-path]
# Networks: localhost, devnet, testnet, mainnet-beta

set -e

# Default values
NETWORK=${1:-localhost}
KEYPAIR_PATH=${2:-~/.config/solana/id.json}
PROGRAM_DIR="$(dirname "$0")/medweb3"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Validate inputs
validate_network() {
    case $NETWORK in
        localhost|devnet|testnet|mainnet-beta)
            return 0
            ;;
        *)
            print_error "Invalid network: $NETWORK"
            print_error "Valid networks: localhost, devnet, testnet, mainnet-beta"
            exit 1
            ;;
    esac
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v solana &> /dev/null; then
        print_error "Solana CLI not found. Please install Solana CLI first."
        exit 1
    fi
    
    if ! command -v cargo &> /dev/null; then
        print_error "Cargo not found. Please install Rust and Cargo first."
        exit 1
    fi
    
    print_success "All dependencies found"
}

# Setup Solana configuration
setup_solana_config() {
    print_status "Setting up Solana configuration..."
    
    # Set cluster
    case $NETWORK in
        localhost)
            solana config set --url http://localhost:8899
            ;;
        devnet)
            solana config set --url https://api.devnet.solana.com
            ;;
        testnet)
            solana config set --url https://api.testnet.solana.com
            ;;
        mainnet-beta)
            solana config set --url https://api.mainnet-beta.solana.com
            ;;
    esac
    
    # Set keypair
    if [ -f "$KEYPAIR_PATH" ]; then
        solana config set --keypair "$KEYPAIR_PATH"
    else
        print_error "Keypair file not found: $KEYPAIR_PATH"
        exit 1
    fi
    
    print_success "Solana configuration set for $NETWORK"
}

# Check wallet balance
check_balance() {
    print_status "Checking wallet balance..."
    
    BALANCE=$(solana balance --output json | jq -r '.value')
    BALANCE_SOL=$(echo "scale=2; $BALANCE / 1000000000" | bc)
    
    print_status "Current balance: $BALANCE_SOL SOL"
    
    # Check minimum balance requirements
    MIN_BALANCE_REQUIRED="0.1"
    if (( $(echo "$BALANCE_SOL < $MIN_BALANCE_REQUIRED" | bc -l) )); then
        print_warning "Low balance detected. You may need more SOL for deployment."
        
        if [ "$NETWORK" = "devnet" ] || [ "$NETWORK" = "testnet" ]; then
            print_status "Requesting airdrop for $NETWORK..."
            solana airdrop 2
        else
            print_warning "Please ensure you have enough SOL for deployment on $NETWORK"
        fi
    fi
}

# Build the program
build_program() {
    print_status "Building Solana program..."
    
    cd "$PROGRAM_DIR"
    
    # Clean previous builds
    cargo clean
    
    # Build the program
    cargo build-bpf
    
    if [ $? -eq 0 ]; then
        print_success "Program built successfully"
    else
        print_error "Program build failed"
        exit 1
    fi
    
    cd - > /dev/null
}

# Deploy the program
deploy_program() {
    print_status "Deploying program to $NETWORK..."
    
    PROGRAM_SO_PATH="$PROGRAM_DIR/target/deploy/medweb3.so"
    
    if [ ! -f "$PROGRAM_SO_PATH" ]; then
        print_error "Program binary not found: $PROGRAM_SO_PATH"
        print_error "Please run build first"
        exit 1
    fi
    
    # Deploy the program
    DEPLOY_OUTPUT=$(solana program deploy "$PROGRAM_SO_PATH" --output json)
    
    if [ $? -eq 0 ]; then
        PROGRAM_ID=$(echo "$DEPLOY_OUTPUT" | jq -r '.programId')
        print_success "Program deployed successfully!"
        print_success "Program ID: $PROGRAM_ID"
        
        # Save program ID to file
        echo "$PROGRAM_ID" > "$PROGRAM_DIR/program-id-$NETWORK.txt"
        print_status "Program ID saved to program-id-$NETWORK.txt"
        
        # Update configuration files
        update_config_files "$PROGRAM_ID"
        
    else
        print_error "Program deployment failed"
        exit 1
    fi
}

# Update configuration files with new program ID
update_config_files() {
    local PROGRAM_ID=$1
    print_status "Updating configuration files with new Program ID..."
    
    # Update backend configuration
    BACKEND_CONFIG="../backend/Utils/blockchainService.js"
    if [ -f "$BACKEND_CONFIG" ]; then
        sed -i "s/const PROGRAM_ID = new web3.PublicKey('.*');/const PROGRAM_ID = new web3.PublicKey('$PROGRAM_ID');/" "$BACKEND_CONFIG"
        print_status "Updated backend configuration"
    fi
    
    # Update frontend configuration
    FRONTEND_CONFIG="../front end/src/utils/medweb3Service.js"
    if [ -f "$FRONTEND_CONFIG" ]; then
        sed -i "s/export const PROGRAM_ID = new PublicKey('.*');/export const PROGRAM_ID = new PublicKey('$PROGRAM_ID');/" "$FRONTEND_CONFIG"
        print_status "Updated frontend configuration"
    fi
    
    # Update test configuration
    TEST_CONFIG="../test_contract.js"
    if [ -f "$TEST_CONFIG" ]; then
        sed -i "s/const PROGRAM_ID = new PublicKey('.*');/const PROGRAM_ID = new PublicKey('$PROGRAM_ID');/" "$TEST_CONFIG"
        print_status "Updated test configuration"
    fi
}

# Verify deployment
verify_deployment() {
    print_status "Verifying deployment..."
    
    local PROGRAM_ID_FILE="$PROGRAM_DIR/program-id-$NETWORK.txt"
    if [ -f "$PROGRAM_ID_FILE" ]; then
        local PROGRAM_ID=$(cat "$PROGRAM_ID_FILE")
        
        # Check if program exists
        PROGRAM_INFO=$(solana program show "$PROGRAM_ID" --output json 2>/dev/null)
        
        if [ $? -eq 0 ]; then
            local PROGRAM_SIZE=$(echo "$PROGRAM_INFO" | jq -r '.programdataAddress // "N/A"')
            print_success "Program verification successful"
            print_status "Program ID: $PROGRAM_ID"
            print_status "Network: $NETWORK"
            print_status "Programdata Address: $PROGRAM_SIZE"
        else
            print_error "Program verification failed"
            exit 1
        fi
    else
        print_error "Program ID file not found"
        exit 1
    fi
}

# Generate deployment report
generate_report() {
    print_status "Generating deployment report..."
    
    local REPORT_FILE="deployment-report-$NETWORK-$(date +%Y%m%d-%H%M%S).txt"
    local PROGRAM_ID=$(cat "$PROGRAM_DIR/program-id-$NETWORK.txt")
    
    cat > "$REPORT_FILE" << EOF
===========================================
MedWeb3 Smart Contract Deployment Report
===========================================

Deployment Date: $(date)
Network: $NETWORK
Program ID: $PROGRAM_ID
Deployer: $(solana address)
Keypair: $KEYPAIR_PATH

Network Configuration:
$(solana config get)

Program Information:
$(solana program show "$PROGRAM_ID" 2>/dev/null || echo "Unable to fetch program info")

Deployment Files:
- Program Binary: $PROGRAM_DIR/target/deploy/medweb3.so
- Program ID File: $PROGRAM_DIR/program-id-$NETWORK.txt

Next Steps:
1. Update your application configuration with the new Program ID
2. Test the deployed contract functionality
3. Monitor the program on Solana Explorer: https://explorer.solana.com/address/$PROGRAM_ID?cluster=$NETWORK

===========================================
EOF

    print_success "Deployment report saved to: $REPORT_FILE"
}

# Main deployment function
main() {
    print_status "Starting MedWeb3 Smart Contract deployment..."
    print_status "Network: $NETWORK"
    print_status "Keypair: $KEYPAIR_PATH"
    
    validate_network
    check_dependencies
    setup_solana_config
    check_balance
    build_program
    deploy_program
    verify_deployment
    generate_report
    
    print_success "Deployment completed successfully!"
    print_status "Your contract is now live on $NETWORK"
    
    if [ "$NETWORK" != "localhost" ]; then
        local PROGRAM_ID=$(cat "$PROGRAM_DIR/program-id-$NETWORK.txt")
        print_status "Explorer URL: https://explorer.solana.com/address/$PROGRAM_ID?cluster=$NETWORK"
    fi
}

# Show usage if help is requested
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "MedWeb3 Smart Contract Deployment Script"
    echo ""
    echo "Usage: $0 [network] [keypair-path]"
    echo ""
    echo "Parameters:"
    echo "  network       Target network (localhost, devnet, testnet, mainnet-beta)"
    echo "  keypair-path  Path to your Solana keypair file"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Deploy to localhost with default keypair"
    echo "  $0 devnet                            # Deploy to devnet with default keypair"
    echo "  $0 mainnet-beta ~/.config/solana/mainnet.json  # Deploy to mainnet with specific keypair"
    echo ""
    exit 0
fi

# Run main function
main
