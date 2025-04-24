# SettleUp - Bill Splitting App
![App Screenshot](documentation/app-screenshot.png)
## 💻  Run Locally
/Users/vic/project2/settle-up/public/documentation/app-screenshot.png
```bash
# Clone repository
git clone https://github.com/yourusername/settleup.git

# Install dependencies
npm install

# Start development server
npm start
```

## 🛠 Tech Stack

| Technology | Purpose           | Version |
| ---------- | ----------------- | ------- |
| React      | UI Framework      | 18.2+   |
| Dexie.js   | IndexedDB Wrapper | 3.2+    |
| CSS        | Component Styling | 3       |
| HTML       | Structure, Meta   | 5       |


## 👥 User Stories

### 👋 First-Time User
**As a new user, I want to:**
- Immediately understand how to add friends and split bills
- See example balances to grasp the app's functionality
- Easily navigate between different sections

**Acceptance Criteria:**
- Clear call-to-action buttons visible on first load
- Demo data available via friends.js file
- Intuitive menu structure with <= 3 main sections

### 🔄 Returning User
**As a regular user, I need to:**
- Quickly add new expenses after group activities
- Modify existing entries without data loss
- Filter friends by balance status (owes/owed)

**Acceptance Criteria:**
- Quick-add shortcut in navigation
- Undo/redo functionality for edits
- Balance filter chips above friend list


## ✨ Features

### Core Features
| Feature            | Description                 | Implementation      |
| ------------------ | --------------------------- | ------------------- |
| Friend Management  | CRUD operations for friends | React State + Dexie |
| Balance Calculator | Real-time debt tracking     | useEffect hooks     |
| Bill Splitting     | Flexible cost division      | Algorithm Module    |
| Data Persistence   | Offline-first storage       | DB Dexie            |


## 🧩 Component Structure

![Component Diagram](./documentation/component-structure.png)


- **App**: Root component managing state
- **Header**: Contains logo and main navigation
- **FriendList**: Renders scrollable list of friends
- **Friend**: Individual friend card component
- **Forms**: Handle user input (AddFriend/SplitBill)
- **Footer**:Date and creator name

## 🔄 Data Flow

![Data Flow Diagram](./documentation/data-flow.png)

1. User interacts with UI component
2. Event handler updates React state
3. State change triggers Dexie DB update
4. IndexedDB persists data between sessions
5. Components re-render with fresh data

## 🎨 Design System

### Color Palette

| Role      | Hex       | Usage Example         |
| --------- | --------- | --------------------- |
| Primary   | `#ff922b` | Main buttons, headers |
| Secondary | `#ffe8cc` | Form backgrounds      |
| Success   | `#66a80f` | Positive balances     |
| Error     | `#e03131` | Negative balances     |
| Text      | `#495057` | Body copy             |

### Typography

| Element   | Font Family | Size   | Weight |
| --------- | ----------- | ------ | ------ |
| Headings  | `Rubik`     | 2.4rem | 600    |
| Body Text | `System UI` | 1.6rem | 400    |
| Buttons   | `Rubik`     | 1.4rem | 700    |
| Numbers   | `Menlo`     | 1.6rem | 400    |

## 📊 Testing

```javascript
// Sample test for balance calculation
test('calculates friend balance correctly', () => {
  const bill = 100;
  const yourExpense = 60;
  const payer = 'user';
  
  const expected = {
    yourBalance: +40,
    friendBalance: -40
  };

  expect(calculateBalances(bill, yourExpense, payer)).toEqual(expected);
});
```