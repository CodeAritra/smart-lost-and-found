# 🔍 Smart Lost & Found System — Ownership Verification Flow

## 🎯 Objective
To securely reunite lost items with their rightful owners using:
- Metadata-based matchmaking
- Image similarity (if available)
- AI-driven adaptive questioning
while handling:
- Sensitive items
- Items without images
- Owners who may or may not know their item is lost

---

## 🧍 Entry Point: Owner Loses an Item

When a user realizes an item is lost, the system follows one of two paths.

---

## 🟢 CASE 1: Item Exists in Found Items List

### Step 1: Search Found Items
The owner searches the **Found Items List** using:
- Category
- Location
- Date / Time
- Keywords

> For **sensitive items**, images and personal details are hidden from public view.

---

### Step 2: Claim Ownership
If the item appears in the list, the owner clicks **“Claim Ownership”**.

This triggers the **AI Claim Verification Engine**.

---

### Step 3: AI Question Generation
AI dynamically generates questions based on:
- Item metadata
- Item category
- Sensitivity level
- Image data (if available)

#### Example Question Types
- ID Card: department, logo color, partial roll number
- Wallet: currency type, hidden compartment, attachments
- Generic item: scratches, markings, last known location

---

### Step 4: Answer Evaluation & Scoring
Each response contributes to a confidence score:


---

### Step 5: Verification Decision

| Confidence Score | Result |
|------------------|--------|
| ≥ 0.85 | Auto-verified |
| 0.60 – 0.85 | Admin review required |
| < 0.60 | Claim rejected |

> Sensitive items require a higher confidence threshold.

---

### Step 6: Ownership Granted
- Claim approved
- Finder and owner are notified
- Secure exchange details are unlocked

---

## 🔴 CASE 2: Item Not Found in List

### Step 1: Raise Lost Item Report
If the item is not found, the owner submits a **Lost Item Report** containing:
- Description
- Category
- Location
- Date / Time
- Optional image
- Optional private hints (not publicly visible)

---

### Step 2: Background AI Matchmaking (Continuous)
The AI engine immediately:
- Matches the lost item against all existing found items
- Continues matching against every new found item added in the future

This process is **event-driven and continuous**.

---

### Step 3: Matchmaking Logic

