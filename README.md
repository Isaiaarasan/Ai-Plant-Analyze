<div align="center">
  <h1>🌱 AI Plant Analyze</h1>
  <p>An intelligent, full-stack microservice platform for detecting plant diseases, providing AI-powered solutions, and connecting a community of plant enthusiasts.</p>
</div>

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot)
![FastAPI](https://img.shields.io/badge/fastapi-109989?style=for-the-badge&logo=FASTAPI&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)

</div>

---

## 🌟 Overview

**AI Plant Analyze** is a robust, multi-service application designed to help farmers, gardeners, and plant lovers diagnose plant diseases from images. It leverages deep learning (TensorFlow/MobileNet) both directly in the browser and via a dedicated Python Machine Learning microservice.

To provide comprehensive care advice, it integrates with **OpenAI's GPT-3** through a Java Spring Boot backend to suggest tailored solutions and treatments. Users can authenticate, keep track of their plant analyses, and interact with others in a built-in community forum powered by Node.js.

## ✨ Key Features

- 📸 **Real-time Plant Symptom Detection:** Uses TensorFlow.js (`@tensorflow/tfjs`) for immediate browser inference and a Python/FastAPI ML backend for high-accuracy deep learning classification.
- 🤖 **AI-Powered Solutions:** A robust Java Spring Boot service integrating with OpenAI to generate detailed care routines, treatments, and solutions for diagnosed plant diseases.
- 🌐 **Community Forum:** Node.js/Express backend supporting a fully-featured forum where users can post, reply, and discuss plant care with other enthusiasts.
- 🔐 **Secure Authentication:** JWT-based secure user registration and login system.
- 🗄️ **Cloud Storage:** MongoDB integration for storing user profiles, scan histories, forum posts, and analysis results seamlessly across microservices.
- ⚡ **Lightning Fast UI:** Built with React, Vite, and TailwindCSS for a highly responsive, modern user experience.

---

## 🏗️ System Architecture

The project is structured into distinct, modular microservices for scalability and separation of concerns:

1. **`Frontend` (React + Vite + TailwindCSS):** 
   Provides a beautiful user interface. Handles user interactions, camera uploads, rendering components, and local ML inference using TensorFlow.js.
2. **`Backend` / `BackendNode` (Node.js + Express + MongoDB):** 
   The core API handling user authentication, forum management, storing scan records, and serving file uploads via Multer.
3. **`BackendJava` (Spring Boot 3 + Java 17):** 
   A robust backend service for handling complex AI logic, specifically connecting with the OpenAI GPT API to generate comprehensive botanical solutions.
4. **`ML-Service` (Python + FastAPI + TensorFlow):** 
   A dedicated Python microservice exposing a `/analyze` endpoint for running heavy, high-accuracy Deep Learning models on uploaded plant images.

---

## 🚀 Getting Started

Follow these instructions to get the complete ecosystem running on your local machine.

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18+)
- **Python** (v3.8+)
- **Java JDK** (v17+)
- **Maven**
- **MongoDB** (Local instance or MongoDB Atlas cluster)

### 1️⃣ Setting up the Frontend

```bash
cd Frontend
npm install
npm run dev
```
*The frontend will start on `http://localhost:5173`.*

### 2️⃣ Setting up the Node.js Backend

```bash
cd Backend
npm install
# Ensure you create a .env file with PORT, MONGODB_URI, and JWT_SECRET
node server.js
```
*The Node API will start on `http://localhost:3001`.*

### 3️⃣ Setting up the Java Spring Boot Backend

```bash
cd BackendJava
# Ensure your application.properties contains your MongoDB URI and OpenAI API Key
./mvnw spring-boot:run
```
*The Java API will run on `http://localhost:8080`.*

### 4️⃣ Setting up the ML Service

```bash
cd ML-Service
python -m venv venv
# Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
python main.py
# or run the provided powershell script: ./run_ml_service.ps1
```
*The FastAPI server will be available at `http://localhost:8000` with Swagger Docs at `http://localhost:8000/docs`.*

---

## 📂 Repository Structure

```text
Ai-Plant-Analyze/
│
├── Frontend/           # React, Vite, Tailwind CSS, TF.js app
├── Backend/            # Node.js, Express, MongoDB (Auth, Forums, Uploads)
├── BackendNode/        # Alternative Node.js backend logic
├── BackendJava/        # Spring Boot, Java 17, OpenAI GPT-3 API integration
└── ML-Service/         # Python, FastAPI, TensorFlow image prediction
```

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🛡️ License

Distributed under the MIT License. See `LICENSE` for more information.

---
<div align="center">
  <i>Built with ❤️ for a greener future.</i>
</div>