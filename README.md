# 📄 Invoice Extraction AI

This project is a sophisticated AI-powered application designed to automate the extraction of structured data from invoice documents, such as images and PDFs. By leveraging cutting-edge LLMs and a robust backend, it transforms noisy document data into actionable financial insights.

## 🔗 Live Links

- **Frontend (Vercel)**: https://your-app-name.vercel.app
- **Backend API (Render)**: https://your-api-name.onrender.com
- **Demo Video**: [Insert YouTube/Loom Link Here]

---

## 🏗️ System Architecture

The application follows a modern, decoupled full-stack architecture to ensure scalability and robustness:

- **Frontend (React & Tailwind CSS)**: Provides a responsive user interface for multi-format file uploads and a comprehensive analytics dashboard.
- **Backend (FastAPI)**: A high-performance API that orchestrates the flow between storage, AI processing, and database persistence.
- **OCR & AI Layer (Google Gemini)**: Utilizes multimodal AI to process raw OCR text and convert it into structured, validated JSON.
- **Database & Storage (Supabase)**: Acts as a unified backend to store uploaded files, metadata, and extracted financial records.

---

## 🛠️ Key Design Decisions

- **Google Gemini (Multimodal AI)**: Selected for its ability to handle "noisy" OCR output and extract data directly into structured JSON formats, significantly improving accuracy over traditional rule-based parsers.
- **FastAPI**: Chosen for its native asynchronous support, which is critical for handling time-intensive AI processing tasks without blocking the main event loop.
- **Supabase**: Integrated to provide a seamless PostgreSQL backend and storage solution, facilitating easy tracking of users, file metadata, and extracted invoice data.
- **Pydantic Validation**: Employed to ensure all extracted data adheres to strict JSON schemas and correct data types before being stored in the database.

---

## ✨ Features Implemented

- **File Upload**: Supports JPG, PNG, and PDF formats through a simple drag-and-drop UI and API endpoint.
- **AI-Powered Parsing**: Converts raw document text into structured JSON fields like vendor name, date, and total amount.
- **Analytics Dashboard**: Visualizes critical financial metrics, including total spend by vendor, monthly trends, and currency-wise totals.
- **Format Detection**: Identifies similar invoice layouts to improve future extraction speed and accuracy.
- **Duplicate Detection**: Automatically flags and prevents the processing of duplicate invoices to optimize costs.

---

## 🚀 Setup Instructions

### Backend (FastAPI)
1. Navigate to the `backend` directory.
2. Install dependencies: 
   ```bash
   pip install -r requirements.txt
   ```
3. Configure your `.env` file with:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `GOOGLE_API_KEY`
4. Run the server: 
   ```bash
   uvicorn main:app --reload
   ```

### Frontend (React)
1. Navigate to the `frontend` directory.
2. Install dependencies: 
   ```bash
   npm install
   ```
3. Run the development server: 
   ```bash
   npm run dev
   ```

---

## 📝 Assumptions & Limitations

- **Document Language**: The system assumes invoices are primarily in English or languages supported by Gemini's multimodal model.
- **AI Rate Limits**: The application operates within the free-tier limits of Google Gemini, which may affect high-frequency batch processing.
- **File Size**: A maximum file size of 10MB is enforced for uploads to maintain optimal performance.

---

## 📈 Potential Improvements

- **Multi-invoice Batch Processing**: Implementing a queue system for processing multiple files simultaneously.
- **Field Highlighting**: Adding a visual layer to the UI to highlight exactly where the AI found specific data points on the document.
- **Vendor Normalization**: Implementing a learning system that improves vendor identification accuracy over time.
- **Retry Logic**: Adding robust fallback mechanisms for failed AI requests to ensure 100% processing reliability.