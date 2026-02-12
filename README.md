# Healix Frontend

A modern, intelligent health monitoring dashboard designed to interpret medical reports and visualize key health metrics. Built with React, TypeScript, and Vite, featuring a premium UI with real-time status analysis.

## 🚀 Overview

Healix is a comprehensive health platform that allows users to:
- **Upload Medical Reports**: robust handling of PDF and image-based lab reports.
- **Visualize Health Data**: Extract and display key biomarkers like Glucose and Cholesterol.
- **Get Real-time Insights**: Automatically categorize results as **Normal**, **Watch**, or **Alert** based on medical reference ranges.
- **Track History**: Maintain a digital archive of all past medical records.

This frontend connects to a powerful backend utilizing OCR and NLP to normalize unstructured data from diverse lab report formats.

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn/ui](https://ui.shadcn.com/) (Radix Primitives)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router](https://reactrouter.com/)

## 🏁 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Maheesh09/Healix_Frontend.git
    cd Healix_Frontend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up Environment Variables**:
    Create a `.env` file in the root directory. You need to configure the API base URL and any authentication keys (e.g., Supabase).
    ```env
    VITE_API_BASE_URL=http://your-backend-api-url
    # Add other necessary keys here
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

5.  **Build for Production**:
    ```bash
    npm run build
    ```

## 📖 User Guide

### 1. First Time Setup
*   **Sign Up**: When you first visit Healix, navigate to the **Sign Up** page. Create an account using your email and a secure password.
*   **Login**: Use your credentials to log in. You will be redirected to the main **Dashboard**.

### 2. Dashboard Overview
The Dashboard is your central hub:
*   **Greeting**: Personalized welcome message based on the time of day.
*   **Summary Cards**: Quick stats on Total Reports, Active Conditions ("Watch" items), and Health Alerts ("Alert" items).
*   **Recent Vitals**: Detailed cards for **Glucose** and **Cholesterol** showing your latest results, date, and a color-coded status badge.

### 3. Uploading Reports
*   Navigate to the **Upload** page via the sidebar.
*   Select your medical report file (PDF or Image).
*   Click **Upload**. The system will send the file to the backend for OCR processing and data extraction.
*   *Note: Processing may take a few moments depending on file size/complexity.*

### 4. Viewing Reports
*   Go to the **Reports** page to see a history of all uploaded documents.
*   Click on a report to expand details. You can view the AI-generated summary and individual biomarker values.
*   **Status Indicators**:
    *   🟢 **Normal**: Values within standard healthy range.
    *   🟡 **Watch**: Values deviating slightly (e.g., Pre-diabetic ranges).
    *   🔴 **Alert**: Values requiring immediate attention.
 
### 5. Sample Reports
*    You can find sample reports to upload and test the system in the `docs` folder of the frontend repository:
    `Healix-frontend/Healix_Frontend/docs/`
*    Available samples:
-     **Full Blood Count.pdf** - Test FBC extraction and normalization.
-     **Glucose.pdf** - Test Fasting Plasma Glucose (FBS) processing.
-     **Lipid Profile.pdf** - Test Lipid Profile analysis.

## 🎨 UI & Design Philosophy
The generic dashboard template has been completely overhauled to offer a **premium, "Grade A" experience**:
*   **Glassmorphism**: Subtle transparencies and blurs for a modern feel.
*   **Micro-interactions**: Hover effects on cards and buttons.
*   **Smooth Transitions**: Page and element animations using Framer Motion.
*   **Responsive**: Fully optimized for mobile, tablet, and desktop views.

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

---
*Healix - Simplifying Health Monitoring*
