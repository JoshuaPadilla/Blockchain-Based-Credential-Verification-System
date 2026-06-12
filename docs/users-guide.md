# User's Guide

## Blockchain-Based Credential Verification System

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [User Roles](#2-user-roles)
3. [Accessing the System](#3-accessing-the-system)
4. [Administrator Guide](#4-administrator-guide)
    - 4.1 [Dashboard](#41-dashboard)
    - 4.2 [Issuing a Credential](#42-issuing-a-credential)
    - 4.3 [Managing Credentials](#43-managing-credentials)
    - 4.4 [Managing Credential Types](#44-managing-credential-types)
    - 4.5 [Managing Signers](#45-managing-signers)
    - 4.6 [Managing Students](#46-managing-students)
5. [Signer Guide](#5-signer-guide)
    - 5.1 [Dashboard](#51-dashboard)
    - 5.2 [Signing Queue](#52-signing-queue)
    - 5.3 [Signing History](#53-signing-history)
6. [Verifier Guide](#6-verifier-guide)
    - 6.1 [Verifying a Credential](#61-verifying-a-credential)
    - 6.2 [Understanding Verification Results](#62-understanding-verification-results)
7. [Glossary](#7-glossary)

---

## 1. System Overview

The **Blockchain-Based Credential Verification System** is a platform for issuing, signing, and verifying academic credentials with tamper-evident blockchain proofs. Academic credential records (such as diplomas and transcripts) are stored in a PostgreSQL database, while a cryptographic hash of each credential is anchored on-chain through a Solidity smart contract (`CredentialVerifier`).

This design ensures that:

- Issued credentials cannot be silently altered after signing.
- Authenticity can be confirmed by any third party with access to the verification link—without needing to contact the institution.
- Revocation and restoration of credentials are enforced both in the database and on-chain.

---

## 2. User Roles

| Role              | Description                                                                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Administrator** | Institution staff who manage students, credential types, signers, and issue new credentials.                                                 |
| **Signer**        | Authorized personnel who review and cryptographically sign credential records queued for approval.                                           |
| **Verifier**      | Any external party (employer, institution, or individual) who verifies a credential using a reference link or QR code. No login is required. |

---

## 3. Accessing the System

### Login (Administrator & Signer)

1. Open the system URL in a browser (e.g., `http://localhost:5173` for local deployments).
2. Enter your **email address** and **password** on the login page.
3. Click **Sign In**.
    - Administrators are redirected to `/admin/dashboard`.
    - Signers are redirected to `/signer/dashboard`.

> Credentials are managed by the system administrator. Contact your administrator if you need an account or need to reset your password.

---

## 4. Administrator Guide

### 4.1 Dashboard

After logging in, administrators land on the **Overview** dashboard at `/admin/dashboard`.

The dashboard displays:

- **Registry Statistics** — real-time counts of total issued credentials, pending signatures, active credentials, and revoked credentials.
- **Recent Issuance History** — a table of the most recently issued credential records, including student name, credential type, date, and current status.
- **Issue Credential** button — quick access to start a new credential issuance.

To navigate to the full credential registry, click **View Full Registry** in the Recent Issuance History section.

---

### 4.2 Issuing a Credential

1. From the dashboard, click the **Issue Credential** button, or navigate to **Credentials > Issue** from the sidebar.
2. On the issue page:
    - **Select a Student** — use the student search selector to find and choose the recipient by name or student ID.
    - **Select a Credential Type** — choose the type of credential to issue (e.g., Diploma, Transcript of Records).
3. Once both fields are filled, a **live PDF preview** of the credential is generated automatically on the right panel. Review it to confirm the details are correct.
4. An **estimated blockchain gas fee** (in ETH and PHP equivalent) is shown to inform you of the on-chain cost before submission.
5. Click **Issue Credential** to submit.
    - The record is created in the database.
    - A hash of the credential data is anchored on-chain via the `CredentialVerifier` smart contract.
6. On success, you are redirected to a **Success** page confirming the record ID.

> After issuance, the credential enters a **pending** state until it has been signed by the required number of authorized signers.

---

### 4.3 Managing Credentials

Navigate to **Credentials** in the sidebar to access the full credential registry.

**Filtering the registry:**

| Filter          | Options                                         |
| --------------- | ----------------------------------------------- |
| Search          | Student name or student ID                      |
| Credential Type | All, Diploma, Transcript of Records (TOR), etc. |
| Status          | All, Active, Revoked                            |
| Date Range      | Filter by issuance date                         |

**Viewing a credential:**

- Click the row of any credential to open its detail page (`/admin/credentials/:credential_id`).
- The detail page shows full record information, the list of signatures collected, and on-chain status.

**Revocation:**

- Administrators can revoke an active credential from the credential detail page.
- Revocation is recorded both in the database and on-chain. Revoked credentials will display a **Revoked** status on the public verification page.
- A revoked credential can be **restored** if it was revoked in error.

**Exporting:**

- Click **Export** (if available) to download a filtered list of credential records.

---

### 4.4 Managing Credential Types

Navigate to **Credential Types** in the sidebar.

This section lists all credential types the institution has configured (e.g., Diploma, TOR). Each card shows:

- Credential type name and icon
- Required signer threshold (minimum number of signatures needed to activate a credential)
- Assigned signers

**Adding a new credential type:**

1. Click **Add Credential Type**.
2. Fill in the credential type name, category, and the required signature threshold.
3. Assign authorized signers to this type.
4. Click **Save**.

**Editing a credential type:**

- Click the **⋮** (more options) menu on a credential type card, then select **Edit**.

> Changes to signature thresholds only affect future issuances.

---

### 4.5 Managing Signers

Navigate to **Signers** in the sidebar.

This section lists all users with the **Signer** role.

**Filtering signers:**

- Search by name.
- Filter by role, position, or active/inactive status.

**Adding a signer:**

1. Click **Add Signer**.
2. Enter the signer's name, email, position, and assign their credential type permissions.
3. Click **Create**.
    - An account is created and the signer will be able to log in with their credentials.

> Signers are authorized per credential type. A signer assigned to "Diploma" can only sign Diploma records.

---

### 4.6 Managing Students

Navigate to **Students** in the sidebar.

This section lists all registered students in the system.

**Finding a student:**

- Use the search bar to look up a student by name or student ID.

**Adding a student:**

1. Click **Add Student**.
2. Fill in the student's information (first name, last name, student ID, program, etc.).
3. Click **Save**.

**Viewing a student profile:**

- Click on a student's name to view their profile, including their academic records and any credentials already issued to them.

---

## 5. Signer Guide

### 5.1 Dashboard

After logging in, signers land on the **Signer Dashboard** at `/signer/dashboard`.

The dashboard shows:

- A personalized welcome greeting.
- **Pending Tasks** — the number of credential records in the queue awaiting your signature.
- **Total Signed** — the total number of records you have signed to date.
- A preview table of the most urgent pending records.

---

### 5.2 Signing Queue

Navigate to **Queue** in the sidebar, or click **View Queue** from the dashboard.

The queue lists all credential records assigned to your credential type(s) that have not yet reached the required signature threshold.

**Filtering the queue:**

- **Search** by student name or student ID.
- **Filter by Credential Type** to narrow the list.

**Signing records:**

1. Select one or more records using the **checkboxes** on the left of each row.
    - To select all visible records, check the header checkbox.
2. Click **Sign Selected** to open the signing confirmation panel.
3. Review the list of records you are about to sign in the confirmation sheet.
4. Click **Confirm Sign**.
    - Your digital signature is submitted to the backend and recorded on-chain for each selected record.
    - You are redirected to the **Signing Summary** page upon completion.

> You can sign records individually or in a batch. Batch signing is recommended for efficiency when processing large queues.

**Viewing a record before signing:**

- Click the **eye icon** (👁) on any row to preview the credential PDF before signing.

---

### 5.3 Signing History

Navigate to **History** in the sidebar.

This section shows all records you have previously signed, including the date, credential type, and student name.

---

## 6. Verifier Guide

No account or login is required to verify a credential.

### 6.1 Verifying a Credential

A credential can be verified in two ways:

**Option A — Via a verification link:**

1. Open the verification URL provided on the credential or shared by the holder.
    - The URL format is: `<system-url>/verify/<credentialRef>`
2. The system will automatically load and verify the credential.

**Option B — Via a QR code:**

1. Scan the QR code printed on or embedded in the credential document.
2. Your device will open the verification URL automatically.

---

### 6.2 Understanding Verification Results

Once a credential is loaded, the system performs two checks:

1. **Off-chain check** — Retrieves the credential data from the database.
2. **On-chain check** — Computes the hash of the retrieved data and compares it against the hash stored in the `CredentialVerifier` smart contract.

The result is displayed as one of the following statuses:

| Status                  | Meaning                                                                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| ✅ **Valid / Verified** | The credential data matches the on-chain hash and has not been revoked or expired. The credential is authentic.                |
| ❌ **Tampered**         | The credential data does not match the on-chain hash. The record has been altered after being signed and is **not authentic**. |
| 🚫 **Revoked**          | The credential was valid but has been revoked by the issuing institution.                                                      |
| ⏳ **Pending**          | The credential has been issued but has not yet received the required number of signatures. It is not yet fully activated.      |
| ⌛ **Expired**          | The credential's validity period has ended.                                                                                    |

The verification page also shows:

- Student name and student ID
- Credential type
- Issuing institution
- Date of issuance
- List of authorized signers who signed the record
- A downloadable PDF of the credential (for **Valid** credentials only)

> **Security Note:** If a credential shows a **Tampered** status, do not accept it as valid. Contact the issuing institution to report the discrepancy.

---

## 7. Glossary

| Term                     | Definition                                                                                                                    |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| **Credential**           | An academic document issued by an institution, such as a diploma or transcript.                                               |
| **Credential Type**      | A category of credential (e.g., Diploma, TOR) with a configured signature threshold.                                          |
| **Signer**               | An authorized institution official who cryptographically signs credential records.                                            |
| **Signature Threshold**  | The minimum number of signer approvals required for a credential to become active.                                            |
| **On-chain**             | Recorded and stored in the blockchain smart contract (`CredentialVerifier`).                                                  |
| **Hash**                 | A fixed-length cryptographic fingerprint of the credential data. Any change to the data produces a completely different hash. |
| **Revocation**           | The act of invalidating a previously active credential.                                                                       |
| **Credential Reference** | A unique identifier used in the public verification URL to look up a credential.                                              |
| **Gas Fee**              | A transaction cost paid to the blockchain network when anchoring data on-chain.                                               |
