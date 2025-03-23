# MPVault - Secure Password Manager with Blockchain Integration

![MPVault Logo](public/shield.svg)

MPVault is a modern, secure password manager that leverages blockchain technology for enhanced security and AI-powered password analysis. It provides a seamless way to store and manage your passwords while ensuring maximum security through encryption and blockchain technology.

## 🚀 Features

- **Blockchain-Based Storage**: Secure password storage using Ethereum smart contracts
- **AI-Powered Password Analysis**: Real-time password strength analysis and suggestions
- **End-to-End Encryption**: All passwords are encrypted before storage
- **Anonymous Mode**: Option to store passwords locally without blockchain
- **Modern UI**: Clean and intuitive user interface with dark mode
- **Password Strength Visualization**: Visual indicators for password security
- **Cross-Platform**: Works on any device with a modern web browser

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Web3.js** for blockchain interaction
- **Lucide Icons** for beautiful icons
- **ethers.js** for Ethereum integration

### Backend
- **FastAPI** for the REST API
- **Python 3.8+** for backend logic
- **Web3.py** for blockchain interaction
- **Solidity** for smart contracts
- **Hardhat** for smart contract development and testing

### Blockchain
- **Ethereum** (supports any EVM-compatible chain)
- **Solidity Smart Contracts**
- **Ganache** for local blockchain development

## 📋 Prerequisites

- Node.js 16.x or later
- Python 3.8 or later
- Git
- Ganache (for local blockchain development)
- MetaMask or similar Web3 wallet

## 🚀 Installation & Setup

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/AbhiramValmeekam/LAUNCHPAD.git
cd LAUNCHPAD
\`\`\`

### 2. Frontend Setup
\`\`\`bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
\`\`\`

Edit the frontend `.env` file:
\`\`\`env
VITE_CONTRACT_ADDRESS=your_contract_address
VITE_ETHEREUM_RPC_URL=your_ethereum_rpc_url
\`\`\`

### 3. Backend Setup
\`\`\`bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
\`\`\`

Edit the backend `.env` file:
\`\`\`env
CONTRACT_ADDRESS=your_contract_address
PRIVATE_KEY=your_private_key
ETHEREUM_RPC_URL=your_ethereum_rpc_url
\`\`\`

### 4. Smart Contract Deployment
\`\`\`bash
# Start Ganache
ganache --deterministic

# Deploy smart contract
cd backend
python deploy_contract.py
\`\`\`

Update both `.env` files with the new contract address.

## 🚀 Running the Application

### 1. Start the Backend Server
\`\`\`bash
cd backend
python -m uvicorn main:app --reload
\`\`\`

### 2. Start the Frontend Development Server
\`\`\`bash
# In a new terminal
npm run dev
\`\`\`

The application will be available at `http://localhost:5173` (or another port if 5173 is in use)

## 🔒 Security Features

- End-to-end encryption of passwords
- Blockchain-based secure storage
- AI-powered password strength analysis
- No plain text password storage
- Secure key management
- Optional anonymous mode for local storage

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenAI for AI capabilities
- Ethereum community for blockchain infrastructure
- FastAPI team for the amazing framework
- React team for the frontend framework

## 📧 Contact

For any queries or support, please contact:
- Email: abhiramsharma567@gmail.com
- GitHub: [@AbhiramValmeekam](https://github.com/AbhiramValmeekam) 
