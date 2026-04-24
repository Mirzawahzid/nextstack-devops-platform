# NextStack – User Manual

## Introduction

NextStack is a tech education platform accessible via web browser. It provides courses, mock interview booking, AI-powered assessments (The Evaluator), and a contact form — all in one place.

---

## Accessing the Platform

Open your browser and navigate to:
- **Local:** `http://localhost:3000`
- **Kubernetes:** `http://nextstack.local` (requires ingress + `/etc/hosts` entry)

---

## Navigation

The top navbar contains:

| Link | Description |
|------|-------------|
| Home | Landing page with hero section |
| About | Why choose NextStack |
| Courses | Browse all 6 available courses |
| Mock Interview | Book a live interview session |
| The Evaluator | AI-powered written assessment info |
| Contact | Send a message to the team |
| Login | Sign in to your account |

---

## Features

### 1. Courses
- Browse 6 courses: Full Stack, Cloud & DevOps, AI/ML, Data Science, Cybersecurity, Mobile Dev
- Click **Enroll Now** on any course card to start enrollment
- Each course shows duration, rating, and discounted price

### 2. Mock Interview
- **Single interview** – $15 per session
- **Bundle (5 interviews)** – $50
- **Monthly Unlimited** – $89/month
- Click **Book Now** to schedule a session

### 3. The Evaluator
- AI-powered written assessment with randomized question sets
- Lockdown mode prevents tab switching during exams
- Detailed KPI reports generated after each assessment
- Click **Start Assessment** to begin

### 4. Contact Form
- Fill in your name, email, subject, and message
- Click **Send Message** — response within 24 hours

### 5. AI Chatbot
- Click the red chat bubble (bottom-right corner)
- Ask about courses, pricing, mock interviews, or contact info
- Responds instantly with relevant information

### 6. Login
- Click **Login** in the navbar
- Enter your email and password
- Click **Sign In**

---

## Health Check Endpoints (for admins)

| Endpoint | Description |
|----------|-------------|
| `GET /healthz` | Liveness check — returns `{"status":"alive"}` |
| `GET /ready` | Readiness check — returns `{"status":"ready"}` |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Page not loading | Check if server is running (`npm start`) |
| Chatbot not responding | Refresh the page and try again |
| Form not submitting | Ensure all required fields are filled |
| Login fails | Verify credentials with your admin |
