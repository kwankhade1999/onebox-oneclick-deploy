
# OneBox – Email Intelligence System

OneBox is a production‑grade email aggregation, search, AI‑categorization, and AI‑reply generation platform.  
Designed for **real‑time IMAP sync**, **Elasticsearch search**, **Qdrant vector RAG**, and **OpenAI‑powered intelligence**.

---

## 🧪 1. System Architecture (Interview‑Focused)

### **High‑Level Design**
OneBox ingests emails from multiple IMAP accounts in real time, processes them, categorizes them using AI, indexes them for lightning‑fast search, and provides AI‑generated replies.

```
IMAP Accounts → IMAPFlow → Parser → AI Categorizer → ES Index → Search API
                                                     ↓
                                               Qdrant Vector DB
                                                     ↓
                                              AI Suggested Replies
```

### **Core Components**
| Component | Responsibility |
|----------|----------------|
| **IMAP Manager (ImapFlow)** | Real‑time email sync (INBOX only), handles reconnects, error‑safe idle loop. |
| **Parser** | Extracts subject, from, body, text, HTML from raw MIME. |
| **AI Categorizer** | Classifies emails → Interested / Spam / Booked / OOO / Not Interested. |
| **Notifier** | Sends Slack + Webhook.site triggers for *Interested* emails. |
| **Elasticsearch** | Full‑text search across subject + body + filters. |
| **Qdrant (Vector Search)** | Stores reply templates & enables RAG. |
| **RAG Service** | Generates contextual replies using OpenAI + vector matches. |
| **REST API** | Search, categorize, suggest replies, add IMAP accounts. |

---

## 🧱 2. Developer Onboarding (Setup Guide)

### **1. Clone the project**
```sh
git clone <repo-url>
cd OneBox
```

---

## **2. Environment Variables (.env)**

Create a `.env` file:

```
PORT=3000
OPENAI_API_KEY=your_key
SLACK_WEBHOOK_URL=https://hooks.slack...
INTERESTED_WEBHOOK_URL=https://webhook.site/xxxx
QDRANT_URL=http://localhost:6333
QDRANT_COLLECTION=email_templates
QDRANT_VECTOR_SIZE=1536
SKIP_EMBEDDINGS=true
RAG_DISABLED=true
```

---

## **3. Start Dependencies (Elasticsearch + Qdrant)**

### **Docker Compose**
```sh
docker compose up -d
```

This creates:
- `elasticsearch` (for search)
- `qdrant` (for vector embeddings)

---

## **4. Install Dependencies Same Frontend & Backend**
```sh
npm install
```

---

## **5. Start Frontend & Backend**
```sh
npm run dev
```

Runs on:  
➡️ **Backend = http://localhost:3000**
➡️ **Frontend = http://localhost:5143**

---

## 🧠 3. Key Features (Explained for Interviews)

### **✔ Real-time IMAP Sync**
- Uses persistent IMAPFlow IDLE loop.
- Auto reconnects if server drops.
- Syncs last 30 days + continues realtime.

### **✔ AI-Based Email Categorization**
Classifies each incoming mail into:
- Interested  
- Meeting Booked  
- Not Interested  
- Spam  
- Out of Office  

Implemented using:
```ts
client.chat.completions.create({ model: "gpt-4o-mini", ... })
```

---

## **✔ Slack + Webhook Notifications**
When an email is categorized as **Interested**, OneBox:
- Sends a Slack message  
- Sends a webhook event (great for automation demos)

---

## **✔ Elasticsearch Search Engine**
Supports:
- Full-text search  
- Sender filter  
- Folder filter  
- Date range  
- Category  
- Pagination  
- Account-specific filtering  

---

## **✔ RAG (Retrieval Augmented AI Reply Generation)**
When enabled:
1. Email → embed → search Qdrant templates  
2. Use top matches to guide reply generation  
3. OpenAI generates final reply  

---

## 🧪 4. API List (Interview Friendly)

### **Search Emails**
```
GET /api/search?q=hello&accountId=work1&folder=INBOX
```

### **Generate Suggested Reply**
```
POST /api/reply/:id/suggest-reply
```

### **Add IMAP Account**
```
POST /api/accounts
{
  "id": "work1",
  "host": "imap.gmail.com",
  "user": "you@gmail.com",
  "pass": "xxx"
}
```

### **Health Check**
```
GET /health
```

---

## 💾 5. Project Structure

```
src/
 ┣ core/
 ┃ ┣ esClient.ts
 ┃ ┣ qdrantClient.ts
 ┃ ┗ imapManagerSingleton.ts
 ┣ modules/
 ┃ ┣ imap/
 ┃ ┣ search/
 ┃ ┣ reply/
 ┃ ┣ accounts/
 ┃ ┗ rag/
 ┣ app.ts
 ┗ server.ts
```

---

## 👨‍💻 6. For Interviewers – What This Project Shows

### You demonstrate:
- Event-driven architecture  
- Real-time streams + IMAP idle  
- AI integration (classification + generative replies)  
- Search engine design  
- Microservices‑friendly structure  
- Production‑grade folder structuring  

---

## 🚀 7. Future Enhancements
- Multi-folder sync  
- Batch processing  
- Template editor UI  
- AI training dashboards  
- OAuth IMAP login (Gmail/Outlook)

---

## 🏁 8. Conclusion

This project is structured to showcase:
- **Backend engineering**
- **System design**
- **AI integration**
- **Clean architecture**
- **Production readiness**

Perfect for **interviews**, **showcase**, and **portfolio demonstration**.

---

Made by **Pranay Mahalle** 🚀
