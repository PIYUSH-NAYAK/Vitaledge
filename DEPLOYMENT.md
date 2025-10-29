# VitalEdge - Deployment Guide

## Overview
VitalEdge is a blockchain-powered medicine tracking system built with React (frontend), Node.js/Express (backend), Solana smart contracts, and MongoDB.

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Solana CLI (for contract development)
- Git

### 1. Clone & Install
```bash
git clone https://github.com/PIYUSH-NAYAK/Vitaledge.git
cd Vitaledge

# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials

# Frontend
cd ../frontend
npm install
cp .env.example .env
# Edit .env with VITE_APP_BACKEND_URL
```

### 2. Configure Environment
Backend `.env` required vars:
- `URI` - MongoDB connection string
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
- `SOLANA_WALLET_PATH` - path to wallet keypair
- `SOLANA_PROGRAM_ID` - deployed program id
- `CLOUDINARY_*` - for image uploads
- `EMAIL_USER`, `EMAIL_PASS` - for OTP emails
- `FRONTEND_URL` - for QR codes and CORS

Frontend `.env`:
- `VITE_APP_BACKEND_URL=http://localhost:7777`
- Firebase client config vars (`VITE_FIREBASE_*`)

### 3. Run Services
```bash
# Terminal 1: Backend
cd backend
npm run dev  # or npm start

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Blockchain worker (optional, handles retries)
cd backend
node Scripts/blockchain_worker.js
```

Visit http://localhost:5173

## Docker Deployment

### Local with Docker Compose
```bash
# Set environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials

# Start all services (mongo + backend + worker + frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

Services:
- Frontend: http://localhost:5173
- Backend: http://localhost:7777
- MongoDB: localhost:27017

### Production Docker
```bash
# Build images
docker build -t vitaledge-backend:latest ./backend
docker build -t vitaledge-frontend:latest ./frontend

# Push to registry (e.g., Docker Hub, GCR, ECR)
docker tag vitaledge-backend:latest your-registry/vitaledge-backend:latest
docker push your-registry/vitaledge-backend:latest

docker tag vitaledge-frontend:latest your-registry/vitaledge-frontend:latest
docker push your-registry/vitaledge-frontend:latest
```

## Cloud Deployment Options

### Option 1: Vercel (Frontend) + Render/Railway (Backend)
**Frontend (Vercel):**
1. Push to GitHub
2. Import project in Vercel
3. Set root directory to `frontend`
4. Add environment variables (VITE_*)
5. Deploy

**Backend (Render/Railway):**
1. Create new Web Service
2. Connect GitHub repo
3. Set root directory to `backend`
4. Add environment variables
5. Deploy
6. Deploy worker as separate Background Worker service

### Option 2: AWS/GCP/Azure Container Services
**Backend & Worker:**
- Deploy to ECS/Fargate, GKE, or Azure Container Instances
- Use managed MongoDB (Atlas) or container
- Store secrets in Secret Manager/Parameter Store
- Use Load Balancer + TLS certificate

**Frontend:**
- Deploy to S3 + CloudFront (AWS)
- or Cloud Storage + CDN (GCP)
- or Blob Storage + CDN (Azure)

### Option 3: Kubernetes (Production-grade)
```bash
# Create deployments for backend, worker, frontend
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/worker-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/services.yaml
kubectl apply -f k8s/ingress.yaml
```

## Security Checklist
- [ ] Remove `.env` from git (already in `.gitignore`)
- [ ] Rotate all secrets (MongoDB password, Firebase key, API keys)
- [ ] Use secret manager in production (AWS Secrets Manager, GCP Secret Manager)
- [ ] Store Solana wallet in KMS or encrypted volume
- [ ] Enable HTTPS/TLS for all endpoints
- [ ] Set CORS to specific domains (not `*`)
- [ ] Enable rate limiting
- [ ] Review Firebase security rules
- [ ] Use MongoDB IP whitelist or VPC
- [ ] Enable MongoDB authentication
- [ ] Review admin user permissions

## Database Setup
**MongoDB Atlas (recommended):**
1. Create cluster at mongodb.com/cloud/atlas
2. Create database user
3. Add IP to Network Access (or use 0.0.0.0/0 for dev)
4. Get connection string → set as `URI` in `.env`

**Local MongoDB:**
```bash
# Install MongoDB
# macOS: brew install mongodb-community
# Ubuntu: sudo apt install mongodb
# Start service
mongod --dbpath /path/to/data
```

## Solana Smart Contract
Contract deployed to Devnet:
- Program ID: `7e1SU615mkoWoQsx2HxxujKj9tU8QRF1hHD8gUiWuvWQ`
- Cluster: `devnet`

For mainnet deployment:
1. Build contract: `cd Contracts/medweb3 && cargo build-bpf`
2. Deploy: `solana program deploy target/deploy/medweb3.so --url mainnet-beta`
3. Update `SOLANA_PROGRAM_ID` and `SOLANA_CLUSTER=mainnet-beta`
4. Ensure wallet is funded on mainnet

## Scripts

### Retroactive QR Generation
```bash
cd backend
node Scripts/retroactive_qr.js 100  # Process up to 100 orders
```

### View Blockchain Orders
```bash
cd Contracts
node view_blockchain_orders.js
```

### Run Worker
```bash
cd backend
node Scripts/blockchain_worker.js
```

## Monitoring & Logs
- Backend logs: stdout (use PM2, systemd, or container logs)
- Worker logs: stdout
- Frontend: browser console + network tab
- MongoDB: Atlas monitoring or local logs
- Solana transactions: https://explorer.solana.com

**Recommended monitoring:**
- Application: Sentry, Datadog, New Relic
- Infrastructure: CloudWatch, Stackdriver, Azure Monitor
- Uptime: UptimeRobot, Pingdom

## Health Checks
- Backend: `GET /health` → `{"status":"ok"}`
- Frontend: `GET /health` → `healthy`

## Troubleshooting

**Worker buffering timeouts:**
- Ensure `URI` is set in `.env`
- Check MongoDB network access
- Run worker from `backend/` directory so dotenv finds `.env`

**Firebase auth errors:**
- Check `FIREBASE_PRIVATE_KEY` formatting (replace `\\n` with actual newlines)
- Verify project ID and client email
- Check Firebase console for enabled auth methods

**Solana transaction failures:**
- Check wallet balance: `solana balance --url devnet`
- Verify program ID matches deployed contract
- Check network (devnet vs mainnet)
- Review Solana Explorer for tx signature

**CORS errors:**
- Update backend CORS origins to include frontend URL
- Set `FRONTEND_URL` correctly

## CI/CD
GitHub Actions workflow included (`.github/workflows/ci.yml`):
- Runs on push to main/pi/develop branches
- Tests backend and frontend
- Builds Docker images
- Caches dependencies

## Support & Resources
- Solana Docs: https://docs.solana.com
- Firebase Docs: https://firebase.google.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Docker: https://docs.docker.com

## License
See LICENSE file

---
For questions or issues, open a GitHub issue or contact the maintainer.
