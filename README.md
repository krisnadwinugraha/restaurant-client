Restaurant POS Client (Frontend)
The modern, reactive frontend for the Restaurant POS System. Built with React, TypeScript, and Material UI, this application provides a role-based interface for Waiters, Cashiers, and Guests to interact with the restaurant management system.
<img width="1895" height="882" alt="Screenshot 2026-02-10 203458" src="https://github.com/user-attachments/assets/54d958e7-6604-410d-aca8-953c2900c4a5" />
<img width="1896" height="884" alt="Screenshot 2026-02-10 203510" src="https://github.com/user-attachments/assets/5adb6a86-9559-413c-ae79-d9a41c2d1a00" />

Tech Stack

Framework: React 18
Build Tool: Vite
Language: TypeScript
UI Library: Material UI (MUI v6) + Emotion
State Management: React Context API (Auth)
Routing: React Router DOM v6
HTTP Client: Axios (with Interceptors)

Key Features
1. Role-Based Dashboards

Guest Mode: A public-facing view showing real-time table availability without requiring login.
Staff Mode: A protected layout for authenticated users (Waiters/Cashiers) with a sidebar for Quick Stats and Menu Management.

2. Operational Workflows
Order Management:

Waiters: Can open tables, add items, update quantities, and remove items.
Cashiers: View-only mode for items, but full access to Finalize Payment and Download Receipt.

Additional Features:

Interactive Menu: A visual food selector with fallback image handling and category filtering (Food vs. Drinks).
Real-time Feedback: Optimistic UI updates, skeleton loaders, and error notifications.

3. Developer Experience

Type Safety: Comprehensive TypeScript interfaces for User, Order, Table, and FoodItem.
Environment Config: Uses import.meta.env for secure and flexible API connections.

Prerequisites
Ensure you have the following installed:

Node.js: v20 or higher (Tested on v22.20.0)
npm: v10+

Installation Guide
1. Clone the Repository
git clone https://github.com/krisnadwinugraha/restaurant-client.git
cd restaurant-client
2. Install Dependencies
npm install
3. Configure Environment
Create a .env file in the root directory. You can copy the example:
cp .env.example .env
Required Variables:
env# The base URL for the backend (Laravel)
VITE_API_BASE_URL=http://localhost:8000

# The specific API prefix
VITE_API_URL=http://localhost:8000/api
4. Start Development Server
npm run dev
```

The application will launch at `http://localhost:5173`.

## 📂 Project Structure
```
src/
├── api/            # Axios instance and interceptors
├── components/     # Reusable UI components (FoodSelector, TableCard)
├── context/        # AuthContext for user session management
├── layouts/        # MainLayout (Navbar, Sidebar)
├── pages/          # Page views (Dashboard, Login, OrderDetail)
├── services/       # AuthService and API calls
└── App.tsx         # Route definitions and ProtectedRoute logic
Screenshots
<img width="1916" height="884" alt="Screenshot 2026-02-10 203722" src="https://github.com/user-attachments/assets/69b934b6-eb02-4d1d-a8c8-a07ccb39c6f6" />

Login (Quick Access)Dashboard (Stats & Search)![Login Screen]![Dashboard Screen]One-click demo loginReal-time table status
<img width="1870" height="894" alt="Screenshot 2026-02-10 203759" src="https://github.com/user-attachments/assets/307e9124-0a78-40e5-a4dc-c606da0c7d32" />
<img width="1889" height="888" alt="Screenshot 2026-02-10 203827" src="https://github.com/user-attachments/assets/247d600b-906a-4ae1-bdac-2fb34fd89772" />
<img width="1880" height="780" alt="Screenshot 2026-02-10 203833" src="https://github.com/user-attachments/assets/fee6ec9b-e737-442f-8da7-ce14e1a87b7d" />

Order Detail (Waiter)PDF Download (Cashier)![Order Detail]![Receipt Action]Edit quantities & itemsFinalize & Download PDF

<img width="457" height="800" alt="Screenshot 2026-02-10 203939" src="https://github.com/user-attachments/assets/bf28ad38-d30e-4a12-88b3-e3729a88ef80" />

Building for Production
To build the application for production:
bashnpm run build
This generates a static dist/ folder that can be served via Nginx, Vercel, or Netlify.
Preview Production Build
bashnpm run preview
🔧 Available Scripts
CommandDescriptionnpm run devStart development servernpm run buildBuild for productionnpm run previewPreview production buildnpm run lintRun ESLint
🔗 Related Repositories

Backend API: [[Link to your Restaurant API Repo]](https://github.com/krisnadwinugraha/restaurant-api)

🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
📝 License
This project is MIT licensed.
👤 Author
Krisna


<p align="center">Made with ❤️ using React & TypeScript</p>
