
QuickNote AI is an AI-powered note summarization app built with **Spring Boot** and the **HuggingFace Inference API**, backed by a **MySQL** database.  
Users can input raw text and receive AI-generated summaries, tags, and sentiment analysis. The app is lightweight, fast, and ready to scale with future features like Google login and syncing.

---

## 🌟 Features

- 🧠 Text summarization using HuggingFace models (e.g., `facebook/bart-large-cnn`)
- 🏷️ Sentiment classification and tag generation
- 💾 Store and delete summarized notes in MySQL
- 🔐 (Planned) Google login + JWT auth
- 🔄 (Planned) Cloud syncing and frontend interface

---

## 🛠️ Tech Stack

| Layer     | Technology                    |
|-----------|--------------------------------|
| Backend   | Spring Boot (Java)             |
| Database  | MySQL                          |
| AI API    | HuggingFace Inference API      |
| Auth      | JWT (coming soon), OAuth (planned) |
| Dev Tools | Postman, IntelliJ, Git         |

---

## 📦 Folder Structure

/src
├── controller/ # API endpoints
├── service/ # Business logic and HuggingFace integration
├── model/ # Note entity and DTOs
├── repository/ # JPA Repositories
├── config/ # CORS setup
└── resources/
└── application.properties

yaml
Copy
Edit

---

## 🚀 Running Locally

### 1. Clone the repo


git clone https://github.com/Ritik643-ui/QuickNoteAI.git
cd QuickNoteAI
2. Set up MySQL
Create a database: quicknote_ai

Update application.properties with your DB username/password

3. Add your HuggingFace API key
In application.properties:

ini
Copy
Edit
huggingface.api.key=hf_XXXXXXXXXXXXXXXXXXXX
4. Run the backend
bash
Copy
Edit
./mvnw spring-boot:run
or run via IntelliJ/VS Code.

📬 API Endpoints
POST /api/summarize – Accepts raw text, returns summary, sentiment, tags

GET /api/notes – Fetch saved notes

DELETE /api/notes/{id} – Delete specific note by ID

✨ Roadmap
✅ AI-powered text summarization (HuggingFace)

✅ MySQL-based note storage

🔜 Google login & JWT auth

🔜 Frontend (React or React Native)

🔜 User accounts + cloud sync

🔜 Export/share summaries

👨‍💻 Developer
Ritik Sharma
📍 Based in California
🎓 Student @ De Anza College
🧠 Portfolio: https://portfolio-ritik.vercel.app
📧 sharmaritik346new@gmail.com

📄 License
This project is open-source and built for educational/demo purposes. Contributions welcome!

DB Structuere
CREATE TABLE notes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    content TEXT NOT NULL,
    summary TEXT,
    sentiment VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE note_tags (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    note_id BIGINT,
    tag VARCHAR(100),
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE
);







