# Expense Tracker

## Overview
Expense Tracker is a web application designed to help users manage their personal finances by tracking income, expenses, budgets, and transactions. It provides a clean and intuitive interface with features such as budget management, transaction history, calendar view, and profile settings. The app supports dark mode and includes notifications for budget limits and low balances.

## Features
- User authentication (signup, login, password reset)
- Dashboard with financial overview, charts, and recent transactions
- Add, edit, and delete transactions (income and expenses)
- Budget management with category-wise budgets and spending tracking
- Calendar view to see transactions by date
- Export data functionality
- Profile management with theme (dark/light mode) toggle
- Notifications for budgets nearing limits and low balances
- Responsive design for desktop and mobile devices
- Subtle animations for enhanced user experience

## Technologies Used
- React with TypeScript
- React Router for routing
- Tailwind CSS for styling
- Framer Motion for animations
- React Hot Toast for notifications
- Lucide React for icons
- REST API for backend communication
- Local storage for some data caching

## Project Structure
- `src/contexts/`: React context providers for authentication and notifications
- `src/components/`: Reusable UI components and layout components
- `src/pages/`: Application pages such as Dashboard, Budget, Transactions, Calendar, Profile, etc.
- `src/lib/`: API and storage utility functions
- `src/App.tsx`: Main application component with routing setup

## Setup and Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd ExpenseTracker
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run dev
   ```
5. Open your browser and go to `http://localhost:3000`

## Usage
- Register a new account or log in with existing credentials.
- Use the dashboard to get an overview of your finances.
- Add transactions and budgets to track your spending.
- Use the calendar to view transactions by date.
- Toggle dark mode from the navbar or profile settings.
- Receive notifications for budget limits and low balances.

## Future Improvements
- Support for recurring transactions and bills
- Multi-currency support
- Advanced reporting and export options
- Cloud backup and multi-device sync
- Enhanced accessibility features

## License
This project is licensed under the MIT License.

## Author
Expense Tracker by Anusha
