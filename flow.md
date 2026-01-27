# 🔍 Smart Lost & Found System

## 🎯 Objective

To securely reunite lost items with their rightful owners using:

- Metadata and contextual matchmaking
- Asymmetric AI-driven ownership verification

The system is built to:

- Minimize effort for finders
- Prevent false or opportunistic claims
- Handle identical or similar items
- Scale across multiple item categories

---

## 🧠 Core Principles

1. **Finder reports only what they can see**
2. **Owner proves ownership using private knowledge**
3. **Public attributes help matching, never verification**
4. **When confidence is low, the system escalates instead of guessing**

---

## 🔐 Step 0: User Authentication

- Firebase Authentication (Google / Email)
- Every report and claim is tied to a verified user ID
- Prevents spam, abuse, and anonymous manipulation

---

## 📥 Step 1: Found Item Report (Finder Flow)

**Goal:** Fast, low-effort, and safe reporting.

### 1.1 Category Selection (Mandatory)

Examples:

- Phone
- Wallet
- ID Card
- Keys
- Bag

Category selection acts as the **anchor signal** for AI input generation.

---

### 1.2 Found Item Report (Finder Side)

The finder reports the item using a **fully manual input form**.  
The system intentionally keeps this step simple and familiar to reduce friction and ensure quick reporting.

**Design goals:**

- Easy to understand for any user
- Fast submission with minimal thinking
- Sufficient detail for downstream matching
- No ownership verification at this stage

---

**Common Inputs (All Categories)**

- Item category
- Brand (if visible)
- Color
- Size / type (small, medium, large, model type, etc.)
- Short free-text description
- Found location
- Approximate found time

---

**Example: Phone (Found)**

- Brand: Samsung
- Color: Black
- Size / model (if known): Medium / Unknown
- Condition: Screen cracked
- Description: Phone found near bus stop, no power, back cover slightly loose

---

**Example: Wallet (Found)**

- Brand: Local / Unknown
- Color: Brown
- Size: Medium
- Material: Leather
- Description: Worn-out wallet found near cafeteria

---

**Important Clarification**

- These details are used **only for listing and AI matchmaking**
- They are **converted into meta datas and are not publicly visible**
- Visible attributes alone cannot grant ownership

---

> **Future Scope:**  
> This manual input system can later be enhanced with structured or AI-assisted input generation to reduce ambiguity and improve match accuracy, without changing the security model.

---

### 1.3 Image Upload & Privacy Handling

- Finder uploads an image
- Image is auto-processed:
  - Converted to black & white
  - Sensitive areas blurred or masked
- Personal identifiers are never publicly shown

---

## 📤 Step 2: Lost Item Report (Owner Flow)

If the owner does not find their item in the public list:

### 2.1 Lost Item Submission

Owner provides:

- Category
- Short optional description
- Approximate lost location
- Approximate time window
- Optional image
- Optional **private hints** (never public)

---

## 🔁 Step 3: Continuous AI Matchmaking

Triggered when:

- A new found item is added
- A new lost item is reported

### 3.1 Matching Logic

**Hard Filters**

- Same category
- Reasonable time overlap

**Soft Signals**

- Text similarity (embeddings)
- Location proximity
- Image similarity (if available)

> Brand, color, and visible attributes are used **only for matching**, never for verification.

---

## 🔔 Step 3.2: Smart Notifications

When match score crosses the threshold:

### Owner Notification

- Email
- Message:
  > “A potential match for your lost item has been found. Please verify ownership.”

### Finder Notification

- No owner details shared
- Notified only after verification or handover stage

---

## 🧠 Step 4: AI Ownership Verification

Triggered when the owner clicks **Claim Ownership**.

### 4.1 Asymmetric Question Generation

AI generates **owner-only questions** based on:

- Item category
- Sensitivity level
- Number of competing claimants

❌ Public attributes are never used.

---

## 🔑 Step 5: In-App Chat Connection

After successful ownership verification, the system enables a **secure in-app chat** between the owner and the finder.

**Purpose:**

- Coordinate handover details (time, place, confirmation)
- Avoid sharing personal contact information
- Keep all communication within the platform

**Key Rules:**

- Chat is unlocked **only after verification**
- No phone numbers or emails are exposed by default
- All messages are logged for safety and audit purposes

This ensures smooth coordination while preserving privacy and preventing misuse.

---

## 🔄 End-to-End Workflow Scenario

### Scenario: A User Loses an Item

#### Step A: User Login

1. The user logs into the system using **Firebase Authentication**  
   → _(Step 0: User Authentication)_

---

#### Step B: User Searches Found Items

2. After logging in, the user checks the **Found Items List** to see if their lost item has already been reported.

---

### Case 1: Item Is Found in the List

_(Someone has already reported it as found)_

3. The user finds a matching item in the found list.
4. The user clicks **Claim Ownership**.  
   → _(Step 4: AI Ownership Verification)_

5. The system generates **owner-only verification questions**.
6. The user answers the questions.
7. If the confidence score crosses the verification threshold:
   - Ownership is approved.

8. The system enables a **secure in-app chat** between the owner and the finder.  
   → _(Step 5: In-App Chat Connection)_

9. Both users coordinate handover details inside the app.
10. The item is returned successfully.

---

### Case 2: Item Is NOT Found in the List

3. The user does not find their item in the found list.
4. The user submits a **Lost Item Report**.  
   → _(Step 2: Lost Item Report)_

5. The system stores the lost item and activates **continuous, event-driven AI matchmaking**.  
   → _(Step 3: AI Matchmaking)_

6. When a matching found item is later reported:
   - The user receives an **email notification**.

7. The user opens the notification and selects **Claim Ownership**.  
   → _(Step 4: AI Ownership Verification)_

8. After successful verification:
   - The system unlocks the **secure in-app chat**.  
     → _(Step 5: In-App Chat Connection)_

9. The owner and finder communicate securely and complete the handover.

---
