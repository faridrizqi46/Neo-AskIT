# 🎬 Video Demo Script — AskIT Chatbot

> **Durasi est. 3:30–3:50 menit** · Karakter tunggal (Presenter) · 3 fitur utama dibahas
> Bahasa: 1️⃣ Indonesia · 2️⃣ English (scroll ke bawah)

---

## 📋 Scene 1 — Login & Masuk ke Chat

| Waktu | Visual | Narasi (Presenter) | On-Screen Text |
|---|---|---|---|
| 0:00 | Screen: Login page, field Employee ID & Password terlihat | *(talking to camera)* "Halo! Hari ini kita akan lihat bagaimana AskIT bisa mengerjakan tiket IT dalam hitungan detik — tanpa email atau antre." | [TITLE CARD: **AskIT Demo**] |
| 0:14 | Login → loading → Dashboard muncul | "Login dengan kredensial karyawan, dan Anda langsung di dashboard." | [Dashboard] |

---

## 📋 Scene 2 — Chat & Reset Password (HIGH Route)

| Waktu | Visual | Narasi (Presenter) | On-Screen Text |
|---|---|---|---|
| 0:14 | Klik menu **IT Assistant** di sidebar | "Sekarang saya buka **IT Assistant** — chatbot utama AskIT." | Sidebar → **IT Assistant** |
| 0:25 | Screen: Chat page dengan chip pertanyaan siap | "Ini interface chat — ada 5 pertanyaan yang bisa langsung diklik." | [How can I help you today?] |
| 0:35 | Ketik di kolom: *"Saya lupa password email kantor, bisa dibantu?"* → Enter | "Saya tulis: **Saya lupa password email kantor, bisa dibantu?**" | [Sinta]: Saya lupa password… |
| 0:44 | Loading "Thinking…" | "Chatbot sedang menganalisis intent dan tingkat kepercayaan." | [Thinking…] |
| 0:51 | Chatbot balas: badge `password_reset`, badge `96%`, 2 tombol aksi muncul | "Hasil: intent **reset password**, kepercayaan **96%** — sangat tinggi." | 🏷️ `password_reset` · ✅ `96%` |
| 1:00 | Klik tombol `[📝 Reset Password Form]` → form muncul | "Saya klik **Reset Password Form** — form muncul langsung di dalam chat." | [Form: Email] · [Employee ID] |
| 1:10 | Isi form → klik **Send Reset Link** | "Isi email dan ID, lalu kirim." | [Btn: Send Reset Link] |
| 1:17 | Chatbot balas: tiket Request ID **#REQ-0042**, estimasi 15 menit | "Chatbot buat tiket otomatis — **Request ID #REQ-0042**, estimasi 15 menit. Tidak perlu telepon." | ✔️ Request ID: **#REQ-0042** |
| 1:30 | (*end scene*) | "Itu Route **HIGH confidence** — AI sudah sangat yakin, jadi langsung kerja otomatis." | [_END OF SCENE 1_] |

---

## 📋 Scene 3 — Software Request (MEDIUM / RAG Route)

| Waktu | Visual | Narasi (Presenter) | On-Screen Text |
|---|---|---|---|
| 1:30 | Klik **New Chat** | "Mari coba kasus yang lebih kompleks — pengajuan software baru." | [Btn: New Chat] |
| 1:37 | Ketik: *"Saya mau minta software desain grafik untuk tim marketing, bisa?"* → Enter | "Pertanyaan: **Saya mau minta software desain grafik untuk tim marketing, bisa?**" | [Sinta]: Saya mau minta software… |
| 1:45 | Loading "Sedang mencari kebijakan…" muncul | "Chatbot sedang mencari kebijakan perusahaan — ini jalur **MEDIUM / RAG**." | [Sedang mencari kebijakan…] |
| 1:52 | Chatbot balas, badge `72%`, teks merujuk kebijakan perusahaan + tombol `[📄 Software Request Form]` | "Confidence **72%** — chatbot tidak terlalu yakin, jadi ia cari kebijakan dulu. Lihat — ia merujuk ke **Software Request Policy** perusahaan, lalu berikan formulirnya." | 🏷️ `software_request` · ⚠️ `72%` |
| 2:03 | Klik `[📄 Software Request Form]` → form muncul | "Form yang sesuai kebijakan muncul otomatis." | [Form: Software Name] [Purpose] [Manager] |
| 2:10 | Isi form → **Send Request** | "Kirim pengajuan." | [Btn: Send Request] |
| 2:15 | Chatbot balas: Request ID **#REQ-0051**, ETA 1–2 hari kerja | "Chatbot konfirmasi: **Request ID #REQ-0051**, ETA 1–2 hari kerja, sesuai kebijakan." | ✔️ Request ID: **#REQ-0051** · ETA: 1–2 hari |
| 2:25 | (*end scene*) | "Jalur **MEDIUM / RAG** — chatbot cek kebijakan dulu sebelum jawab." | [_END OF SCENE 2_] |

---

## 📋 Scene 4 — Escalation (LOW Confidence Route)

| Waktu | Visual | Narasi (Presenter) | On-Screen Text |
|---|---|---|---|
| 2:25 | Klik **New Chat** | "Kasus ketiga — masalah yang chatbot tidak bisa pecahkan sendiri." | [Btn: New Chat] |
| 2:31 | Ketik: *"WiFi saya lambat, temen lain lancar. Bisa dibantu?"* → Enter | "Pertanyaan: **WiFi saya lambat, temen lain yang pakai yang sama lancar.**" | [Sinta]: WiFi saya lambat… |
| 2:38 | Loading, chatbot merespon jujur dengan badge `41%`, tombol `[✅ Buat Tiket Support]` | "Chatbot jujur: kepercayaan hanya **41%**. Ia langsung buat tiket dan hubungkan ke tim IT support jaringan." | 🏷️ `general_inquiry` · 🔴 `41%` |
| 2:50 | Klik `[✅ Buat Tiket Support]` | "Klik buat tiket." | Tiket #**REQ-0078** · Status: Open |
| 2:57 | Badge sidebar muncul: **"Live with IT Support — #REQ-0078"** | "Tim IT Support langsung masuk di chat ini. Semua percakapan tercatat di satu tempat." | [Badge: Live with IT Support — #REQ-0078] |
| 3:05 | (*end scene*) | "Route **LOW confidence** — chatbot jujur dan alihkan ke manusia." | [_END OF SCENE 3_] |

---

## 📋 Scene 5 — Closing & Ringkasan

| Waktu | Visual | Narasi (Presenter) | On-Screen Text |
|---|---|---|---|
| 3:05 | Screen kembali ke Dashboard | "Tiga fitur AskIT yang baru kita lihat:" | [Dashboard] |
| 3:10 | — | "Satu — **Reset Password otomatis** via HIGH route. Dua — **Policy RAG** untuk jawaban berbasis kebijakan. Tiga — **Escalation ke support manusia** yang transparan." | ✅ HIGH · 🔍 MEDIUM/RAG · 🚨 LOW |
| 3:20 | Screen: fitur Tambah (Requests & Admin) | "Ditambah tracking tiket, kebijakan management, dan dashbor admin — semua di satu aplikasi." | [Sidebar: Requests · Admin] |
| 3:28 | *(fade out)* | "AskIT memotong 70% tiket IT yang biasanya via email atau antre — itu hasil akhir. Terima kasih!" | [TITLE CARD: **AskIT — IT Self-Service Assistant**] |

---

## 🕐 KESELURUHAN TIMELINE

| Waktu | Scene | Fitur Utama |
|---|---|---|
| 0:00 → 0:14 | Login & Dashboard | Auth flow |
| 0:14 → 1:30 | Reset Password | **HIGH route**, form automation, Request ID |
| 1:30 → 2:25 | Software Request | **MEDIUM / RAG route**, policy retrieval |
| 2:25 → 3:05 | Jaringan Lambat | **LOW route**, auto-ticket, support manusia |
| 3:05 → 3:28 | Closing & Ringkasan | Ringkasan 3 fitur |

---

---

# 🎬 Video Demo Script — AskIT Chatbot (English)

> **Est. 3:30–3:50 minutes** · Single character (Presenter) · 3 core features covered
> Bahasa: 2️⃣ English

---

## 📋 Scene 1 — Login & Entering the Chat

| Time | Visual | Narration (Presenter) | On-Screen Text |
|---|---|---|---|
| 0:00 | Screen: Login page, fields visible | *(talking to camera)* "Hi! Today we'll see how AskIT resolves IT tickets in seconds — no emails, no calls, no queues." | [TITLE CARD: **AskIT Demo**] |
| 0:14 | Login → loading → Dashboard | "Login with your employee credentials, and you're on the dashboard." | [Dashboard] |

---

## 📋 Scene 2 — Chat & Password Reset (HIGH Route)

| Time | Visual | Narration (Presenter) | On-Screen Text |
|---|---|---|---|
| 0:14 | Click **IT Assistant** in sidebar | "Now I'm opening **IT Assistant** — AskIT's main chatbot." | Sidebar → **IT Assistant** |
| 0:25 | Chat page: "How can I help you today?" + 5 chips | "This is the chat interface — suggested questions ready to click." | [How can I help you today?] |
| 0:35 | Type: *"I forgot my office email password. Can you help?"* → Enter | "I'll type: **I forgot my office email password.**" | [Sinta]: I forgot my office… |
| 0:44 | Loading "Thinking…" | "Chatbot is analyzing my intent and confidence level." | [Thinking…] |
| 0:51 | Chatbot replies: `password_reset`, `96%`, 2 action buttons | "Result: intent **reset password**, confidence **96%** — very high." | 🏷️ `password_reset` · ✅ `96%` |
| 1:00 | Click `[📝 Reset Password Form]` → form appears | "I click **Reset Password Form** — form shows up right inside chat." | [Form: Email] · [Employee ID] |
| 1:10 | Fill in form → click **Send Reset Link** | "Fill in email and ID, then submit." | [Btn: Send Reset Link] |
| 1:17 | Chatbot: ticket **#REQ-0042**, 15 mins ETA | "Ticket created automatically — **Request ID #REQ-0042**, 15 minutes ETA." | ✔️ Request ID: **#REQ-0042** |
| 1:30 | *(end scene)* | "**HIGH confidence route** — chatbot is very sure, acts automatically." | [_END OF SCENE 1_] |

---

## 📋 Scene 3 — Software Request (MEDIUM / RAG Route)

| Time | Visual | Narration (Presenter) | On-Screen Text |
|---|---|---|---|
| 1:30 | Click **New Chat** | "Now a more complex case — requesting new software." | [Btn: New Chat] |
| 1:37 | Type: *"Can I request design software for the marketing team?"* → Enter | "My question: **Can I request design software for the marketing team?**" | [Sinta]: Can I request design software… |
| 1:45 | Loading: "Searching company policies…" | "Chatbot is searching company policies — **MEDIUM / RAG route**." | [Searching company policies…] |
| 1:52 | Chatbot replies: badge `72%`, cites policy + button `[📄 Software Request Form]` | "Confidence **72%** — not high enough, so chatbot pulls company policy from the knowledge base. See — it references the **Software Request Policy**, then shows the form." | 🏷️ `software_request` · ⚠️ `72%` |
| 2:03 | Click `[📄 Software Request Form]` → form appears | "Form appears, structured to match the policy." | [Form: Software Name] [Purpose] [Manager] |
| 2:10 | Fill in → **Send Request** | "Submit and done." | [Btn: Send Request] |
| 2:15 | Chatbot: Request ID **#REQ-0051**, ETA 1–2 days | "Confirmation with **Request ID #REQ-0051**, ETA 1–2 days, citing the policy — transparent." | ✔️ Request ID: **#REQ-0051** · ETA: 1–2 days |
| 2:25 | *(end scene)* | "**MEDIUM / RAG route** — chatbot checks the policy before answering." | [_END OF SCENE 2_] |

---

## 📋 Scene 4 — Escalation (LOW Confidence Route)

| Time | Visual | Narration (Presenter) | On-Screen Text |
|---|---|---|---|
| 2:25 | Click **New Chat** | "Third scenario — a problem the chatbot can't solve alone." | [Btn: New Chat] |
| 2:31 | Type: *"My WiFi is slow but my coworkers are fine — why?"* → Enter | "Question: **My WiFi is slow, my coworkers are fine on the same network.**" | [Sinta]: My WiFi is slow… |
| 2:38 | Loading, chatbot honest reply: badge `41%`, button `[✅ Create Support Ticket]` | "Chatbot: only **41%** confidence. It's honest — creates a ticket and connects you to our Network IT team." | 🏷️ `general_inquiry` · 🔴 `41%` |
| 2:50 | Click `[✅ Create Support Ticket]` | "Click create ticket." | Tiket #**REQ-0078** · Status: Open |
| 2:57 | Badge sidebar: **"Live with IT Support — #REQ-0078"** | "IT Support joins this chat directly — all in one place." | [Badge: Live with IT Support — #REQ-0078] |
| 3:05 | *(end scene)* | "**LOW confidence route** — chatbot doesn't pretend. It's honest and passes to a human." | [_END OF SCENE 3_] |

---

## 📋 Scene 5 — Closing & Feature Summary

| Time | Visual | Narration (Presenter) | On-Screen Text |
|---|---|---|---|
| 3:05 | Dashboard | "Three features we just saw:" | [Dashboard] |
| 3:10 | — | "One — **Automated Password Reset** via HIGH route." | ✅ HIGH |
| 3:16 | — | "Two — **Policy-aware RAG** for policy-grounded answers." | 🔍 MEDIUM/RAG |
| 3:22 | — | "Three — **Transparent escalation** to human support, honest and open." | 🚨 LOW |
| 3:27 | *(fade out)* | "AskIT cuts 70% of IT tickets — instant, accurate, documented. Thanks for watching!" | [TITLE CARD: **AskIT — IT Self-Service Assistant**] |

---

## 🕐 FULL TIMELINE

| Time | Scene | Core Feature |
|---|---|---|
| 0:00 → 0:14 | Login & Dashboard | Auth flow |
| 0:14 → 1:30 | Password Reset | **HIGH route**, form automation, Request ID |
| 1:30 → 2:25 | Software Request | **MEDIUM / RAG route**, policy retrieval |
| 2:25 → 3:05 | Escalation | **LOW route**, auto-ticket, human support |
| 3:05 → 3:28 | Closing | Summary |

---

> Frontend files referenced:
> - `apps/web/app/(auth)/login/page.tsx`
> - `apps/web/components/layout/AppShell.tsx`
> - `apps/web/app/(dashboard)/chat/page.tsx` · `ChatWindow.tsx` · `ChatStore.ts`
> - `apps/api/src/routes/chat.ts` · `services/ai.service.ts` · `services/policy.service.ts`
