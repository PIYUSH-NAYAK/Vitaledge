# VITALEDGE - A Medicine Tracking Platform

VITALEDGE is a blockchain-based platform built to track medicines from the manufacturer to the consumer using Web3 technology. The project ensures the traceability of drugs, providing transparency and security in the supply chain. This platform uses smart contracts to record and track each step of a drug's journey, from production to distribution, ensuring that consumers get authentic and verified medicines.

---

## Frontend Setup

This section explains how to set up the frontend environment for VITALEDGE.

### Prerequisites

- Node.js (version 14 or later)
- npm (Node Package Manager)

### Steps to Setup the Frontend

1. **Clone the repository**:

    ```bash
    git clone https://github.com/PIYUSH-NAYAK/Vitaledge.git
    cd Vitaledge
    ```

2. **Navigate to the `frontend` directory**:

    ```bash
    cd './front end/'
    ```

3. **Install dependencies**:

    ```bash
    npm install
    ```

4. **Run the frontend**:

    ```bash
    npm run dev
    ```

    Your frontend should now be running and accessible at `http://localhost:5173`.

### Handling Server Issues

- If the server on port `5000` is busy, free it or debug accordingly.

### Wallet Integration

- In the browser where you are running the frontend server, install the **Phantom Wallet** extension.
- Log in to the Phantom Wallet.
- Ensure the wallet contains **some SOL (Solana) in Devnet** for transactions.

---

## Backend Setup

This section explains how to set up the backend environment for VITALEDGE.

### Steps to Setup the Backend

1. **Navigate to the backend folder**:

    ```bash
    cd backend
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Run the backend server**:

    ```bash
    npm start
    ```

4. **Handling Server Issues**:

    - If the server on port `7777` is busy, free it or debug accordingly.

5. **Create a `.env` file in the `backend` folder**:

    Add the following environment variables:

    ```plaintext
    URI="<your mongodb url here>"
    SECRET_KEY="<respective password here>"
    ```

---

## Project Overview

### VITALEDGE: Medicine Tracking from Manufacturer to Consumer

VITALEDGE leverages blockchain technology to provide an end-to-end solution for tracking medicine from its origin at the manufacturer to its final destination in the hands of the consumer. The platform offers the following features:

- **Traceability**: Track each batch of medicine through its entire supply chain journey.
- **Blockchain Security**: All transaction records are securely stored on the blockchain, ensuring transparency and preventing fraud.
- **Web3 Integration**: Users interact with the platform using a Web3 wallet like **Phantom**, ensuring decentralized access and control.
- **Smart Contracts**: Automated, tamper-proof smart contracts govern the transactions, ensuring that every step in the process is verified and trusted.

The project aims to revolutionize the pharmaceutical industry by increasing the trust between manufacturers, suppliers, and consumers through transparency and verification using blockchain.

---

### Technologies Used

- **Frontend**: React.js, Tailwind CSS, React Icons
- **Backend**: Node.js, Express.js, MongoDB
- **Blockchain**: Solana, Phantom Wallet, Ethers.js
- **Styling**: Tailwind CSS for fast and responsive design
- **Smart Contracts**: Solidity

---

## Contributing

We welcome contributions to the VITALEDGE project! If you have any ideas or improvements, feel free to open an issue or submit a pull request.

---


