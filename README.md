# AgentCommand

**AgentCommand** is a premium, high-density SaaS dashboard designed for managing student university applications. It provides a comprehensive suite of tools for agents and counselors to track students, manage documents, and research universities.

## 🚀 Features

### 📊 Command Center Dashboard
- **High-Density Stats Grid**: Real-time metrics on total candidates, applications sent, pending actions, and urgent deadlines.
- **Activity Feed**: Live updates on student activities and system changes.
- **Quick Actions**: Fast access to common tasks like adding students or brainstorming.

### 🎓 Student Management
- **Centralized Student Table**: A data-rich table with advanced filtering, sorting, and status tracking.
- **Detailed Profiles**: 3-column CRM-style layout for viewing contact info, academic stats, activity logs, and application status.
- **Document Management**: Upload, track, and verify student documents (Transcripts, Passport, etc.).

### 🏫 University Research
- **University Database**: Browse and search a curated list of universities.
- **AI Brainstorming**: Leverage AI to generate personalized university recommendations based on student profiles.

### 🛠️ Technical Highlights
- **Modern Stack**: Built with React, Vite, and Tailwind CSS.
- **Premium UI**: Custom "Zinc/Slate" aesthetic with glassmorphism and refined typography.
- **Backend**: Powered by Supabase for authentication, database, and storage.
- **Responsive**: Fully optimized for desktop, tablet, and mobile devices.

## 🛠️ Setup & Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd AgentCommand
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env.local` file in the root directory and add your Supabase credentials:
    ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```

## 📂 Project Structure

- `src/components/dashboard`: Core dashboard components (Layout, Pages, Tables).
- `src/components/ui`: Reusable UI components (Buttons, Cards, Dialogs) from Shadcn/UI.
- `src/lib`: Supabase client configuration.
- `src/utils`: Helper functions for notifications and AI.

## 🎨 Design System

The project uses a custom Tailwind configuration focused on a premium "SaaS" look:
- **Colors**: Slate and Zinc scales for a professional, neutral background.
- **Typography**: Inter font for clean readability.
- **Components**: High-density cards and tables to maximize information visibility.

## 🤝 Contributing

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---
Built with ❤️ by the AgentCommand Team.
