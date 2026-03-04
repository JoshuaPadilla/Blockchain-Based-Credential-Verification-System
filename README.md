# Blockchain-Based Credential Verification System

A full-stack monorepo for issuing, signing, and verifying academic credentials with on-chain integrity checks.

## Repository Description

This project combines a NestJS backend, a React frontend, and a Solidity smart contract (Foundry) to manage credential lifecycles (creation, signing, revocation, restoration, and verification). Credential metadata is stored in PostgreSQL, while credential integrity and signer state are anchored on-chain through the `CredentialVerifier` contract.

## Monorepo Structure

- `backend/` — NestJS API (TypeScript, TypeORM, PostgreSQL, ethers)
- `web-react/` — React + Vite frontend (TypeScript, TanStack Router/Query)
- `smart-contract/` — Solidity contracts + tests + scripts (Foundry)
- `thesis_backup.sql` — SQL backup artifact

## Core Features

- Credential record issuance and lifecycle management
- On-chain credential hash anchoring (`addRecord`, `getRecord`)
- Authorized signer model by credential type
- Multi-signature threshold per credential type
- Record signing and batch signing
- Revocation and restoration workflows
- Verification flow comparing off-chain normalized data with on-chain hash
- PDF-related backend modules/templates for credential rendering

## Tech Stack

- **Backend**: NestJS 11, TypeORM, PostgreSQL, JWT auth, ethers v6
- **Frontend**: React 19, Vite 7, TypeScript, Tailwind, Axios
- **Blockchain**: Solidity `0.8.19`, Foundry (forge/anvil/cast)

## Prerequisites

Install these before running locally:

- Node.js 20+
- npm 10+
- PostgreSQL 14+
- Foundry (`forge`, `anvil`, `cast`)

## Local Development

### 1) Smart Contract

```bash
cd smart-contract
forge build
forge test
```

If you want a local chain:

```bash
anvil
```

Deploy with your script flow (for example in `script/CredentialVerifier.s.sol`) and capture the deployed contract address.

### 2) Backend API

```bash
cd backend
npm install
npm run start:dev
```

Backend runs on `http://localhost:3000` by default and exposes routes under `/api`.

#### Required Backend Environment Variables

Create `backend/.env` and define at least:

```env
PORT=3000
JWT_SECRET=change_me
JWT_EXPIRATION=1d
REFRESH_JWT_SECRET=change_me_too
REFRESH_JWT_EXPIRATION=90d
ENCRYPTION_MASTER_KEY=change_me
SALTROUNDS=10
RPC_URL=http://127.0.0.1:8545
PRIVATE_KEY=0x...
CONTRACT_ADDRESS=0x...
```

> Note: database connection values are currently set directly in `backend/src/app.module.ts`.

### 3) Frontend App

```bash
cd web-react
npm install
npm run dev
```

Create `web-react/.env`:

```env
VITE_API_URL=http://localhost:3000
```

Frontend dev server typically runs at `http://localhost:5173`.

## Useful Commands

### Backend

```bash
npm run build
npm run lint
npm run test
npm run test:e2e
```

### Frontend

```bash
npm run build
npm run preview
npm run lint
```

### Smart Contract

```bash
forge build
forge test
forge fmt
```

## Current Status Notes

- `backend/README.md`, `web-react/README.md`, and `smart-contract/README.md` are still starter templates.
- This root README is the authoritative overview for the monorepo.

## Suggested Next Improvements

- Move backend database credentials from source code to environment variables.
- Add `.env.example` files for `backend/` and `web-react/`.
- Add architecture diagram (API ↔ DB ↔ chain ↔ frontend).
- Add deployment guide (testnet/mainnet and production API/frontend).
