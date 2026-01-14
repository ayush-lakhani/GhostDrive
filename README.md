# 👻 GhostDrive

> **Secure, anonymous, and ephemeral file sharing for the modern web.**
> *Think Google Drive, but everything self-destructs.*

![GhostDrive Banner](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3)

## ❓ The Problem
In today's digital age, sharing sensitive files often leaves a permanent digital footprint. Email attachments, cloud links, and messaging apps keep your files stored indefinitely, increasing the risk of data leaks, unauthorized access, and digital clutter. Privacy is becoming a luxury.

## 💡 The Solution
**GhostDrive** is a privacy-first file sharing platform that ensures your data doesn't overstay its welcome. It combines the familiar, user-friendly interface of a cloud drive (like Google Drive) with powerful **ephemeral storage** mechanics.

Upload a file, set a timer (or a "burn" trigger), and share the link. Once the condition is met, the file is **permanently purged** from the server. No logs, no backups, no trace.

## 🚀 Key Features

*   **⏱️ Custom Expiry Timers:** Set files to vanish in minutes, hours, or days.
*   **🔥 Burn-on-Read:** The ultimate security—files self-destruct immediately after one successful download.
*   **🔐 Password Protection:** Add a second layer of security with mandatory password decryption.
*   **🎨 Premium UI:** A sleek, fully response "Dark Mode" interface inspired by professional SaaS tools.
*   **🖱️ Context Menus:** Right-click functionality for a native desktop-like experience.
*   **📁 Smart Dashboard:** Manage your active "Ghosts" in a familiar grid or list view.

## 🛠️ Tech Stack

### Frontend
*   **React + Vite:** Lightning-fast UI rendering.
*   **TailwindCSS:** Modern, utility-first styling for a pixel-perfect dark theme.
*   **Lucide React:** Beautiful, consistent iconography.
*   **Axios:** Robust HTTP client for handling upload streams.

### Backend
*   **Node.js & Express:** High-performance server runtime.
*   **MongoDB:** Flexible metadata storage.
*   **Multer:** Efficient handling of multipart/form-data (file uploads).
*   **Node-Cron:** Precision scheduling for background cleanup tasks (The Reaper 💀).

## ⚡ Getting Started

Follow these steps to deploy your own instance of GhostDrive.

### Prerequisites
*   Node.js (v18+)
*   MongoDB (Local or Atlas URL)

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/ayush-lakhani/GhostDrive.git
    cd GhostDrive
    ```

2.  **Setup Backend**
    ```bash
    cd server
    npm install
    ```
    *Create a `.env` file in the `server` directory:*
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    ```
    *Start the server:*
    ```bash
    npm start
    ```

3.  **Setup Frontend**
    ```bash
    cd client
    npm install
    npm run dev
    ```

4.  **Access the App**
    Open your browser and navigate to `http://localhost:5173`.

---

## 🛡️ License
This project is open-source and available under the [MIT License](LICENSE).

---
*Built with 💀 by [Ayush Lakhani](https://github.com/ayush-lakhani)*