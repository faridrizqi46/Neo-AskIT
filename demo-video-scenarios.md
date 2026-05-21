# 🎬 Demo Video Scenarios — AskIT Chatbot

> **3 concrete demo scenarios** showing AskIT in action.
> Versi bahasa: 1️⃣ Bahasa Indonesia · 2️⃣ English

---

## 🌐 Scenario 1 — Reset Password

### Bahasa Indonesia

**Tujuan:** Menunjukkan how AskIT solves a common everyday IT problem end-to-end.

**Karakter:**
| Role | Nama |
|---|---|
| Employee | Sinta |
| Chatbot | AskIT |

---

**Shot 1 — Halaman Dashboard**
Sinta login ke perusahaan intranet. Sidebar-nya ada menu **"IT Assistant"**. Ia klik.

**Shot 2 — Chat Interface muncul**
Sinta lihat chat window kosong dengan placeholder: *"Tanyakan apa saja seputar IT..."*

**Shot 3 — User mengirim pesan**
Sinta ketik: *"Halo, saya lupa password akun email kantor. Bisa dibantu reset?"*
→ Enter.

**Shot 4 — Chatbot merespon dengan cepat (confidence: HIGH)**
> *"Halo Sinta! Saya bisa bantu reset password email kantor Anda. Berikut langkah-langkah yang bisa dilakukan:*
> 1. Verifikasi identitas dengan mengisi form ini
> 2. Konfirmasi nomor HP terdaftar
> 3. Sistem akan mengirim link reset ke email recovery Anda"*

Ada **2 button aksi**:
- `[📝 Form Reset Password]`
- `[📞 Hubungi IT Support]`

**Shot 5 — User klik form**
Fitur **Password Reset Form** tergulir. Sinta isi:
- Alasan: *"Lupa password, tidak bisa masuk 3 hari ini"*
- Nomor HP: `0812xxxxxxx`
→ **Kirim**

**Shot 6 — Chatbot konfirmasi & tracking ID**
> *"Permintaan reset password Anda sudah dikirim dengan **Request ID #REQ-0042**. Tim IT akan memproses dalam 15 menit. Anda bisa cek status kapan saja dengan mengetik "status permintaan saya"."*

Ada **button**:
- `[✅ Lihat Detail Request]`

**Shot 7 — Closing shot**
Kaast lembaga Request muncul, status: **"Processing"**. Sinta senang karena tidak perlu email/telepon ke tim IT langsung.

---

### English

**Goal:** Demonstrates AskIT solving a common everyday IT problem end-to-end.

**Characters:**
| Role | Name |
|---|---|
| Employee | Sinta |
| Chatbot | AskIT |

---

**Shot 1 — Dashboard Page**
Sinta logs into the company intranet. The sidebar has an **"IT Assistant"** menu item. She clicks it.

**Shot 2 — Chat Interface appears**
Sinta sees an empty chat window with placeholder: *"Ask anything about IT..."*

**Shot 3 — User sends a message**
Sinta types: *"Hi, I forgot my office email password. Can you help me reset it?"*
→ Enter.

**Shot 4 — Chatbot responds instantly (confidence: HIGH)**
> *"Hi Sinta! I can help you reset your office email password. Here are the steps you can take:*
> 1. Verify your identity by filling out this form
> 2. Confirm your registered phone number
> 3. The system will send a reset link to your recovery email"*

There are **2 action buttons**:
- `[📝 Reset Password Form]`
- `[📞 Contact IT Support]`

**Shot 5 — User clicks the form**
A **Password Reset Form** slides in. Sinta fills in:
- Reason: *"Forgot password, haven't been able to login for 3 days"*
- Phone number: `0812xxxxxxx`
→ **Submit**

**Shot 6 — Chatbot confirms with a tracking ID**
> *"Your password reset request has been submitted with **Request ID #REQ-0042**. The IT team will process it within 15 minutes. You can check the status anytime by typing "check my request status"."*

There is a **button**:
- `[✅ View Request Detail]`

**Shot 7 — Closing shot**
The Request detail panel appears, status: **"Processing"**. Sinta is relieved — no email or call to the IT team needed.

---

## 🌐 Scenario 2 — Request New Software / Hardware

### Bahasa Indonesia

**Tujuan:** Menunjukkan how AskIT handles a medium-complexity request via policy-aware response (RAG) route.

**Karakter:**
| Role | Nama |
|---|---|
| Employee | Rian |
| Chatbot | AskIT |

---

**Shot 1 — Dashboard → IT Assistant**
Rian buka halaman IT Assistant dari dashboard.

**Shot 2 — User bertanya hal baru**
Rian ketik: *"Saya mau minta software desain grafik untuk tim marketing, itu bisa?"*
→ Enter.

**Shot 3 — Chatbot checking policy (confidence: MEDIUM — RAG activated)**
Ada indikator *"Sedang mencari kebijakan perusahaan..."* lalu Chatbot respon:

> *"Berdasarkan kebijakan perangkat lunak perusahaan, pengajuan software desain grafik (misal: Figma, Adobe Creative Cloud) memang bisa diajukan oleh tim marketing dengan persetujuan atasan langsung.*
>
> *Silakan isi form pengajuan di bawah dengan:*
> - Nama software
> - Alasan penggunaan
> - Lampiran surat persetujuan atasan"*

Ada **1 button**:
- `[📄 Form Pengajuan Software]`

**Shot 4 — User isi form**
Rian isi:
- Software: *Figma*
- Alasan: *"Untuk desain materi promosi dan social media tim marketing"*
- Atasan: *"Budi Santoso — Head of Marketing"*
→ **Kirim**

**Shot 5 — Chatbot menutup dengan info kebijakan**
> *"Pengajuan Figma untuk tim marketing Anda sudah dikirim (**Request ID #REQ-0051**). Sesuai kebijakan perusahaan, software ini memerlukan persetujuan dari Manajer IT dengan estimasi 1–2 hari kerja. Anda akan dapat notifikasi email setelah disetujui."*

Ada **button**:
- `[📧 Lihat Detail Request]`

---

### English

**Goal:** Shows AskIT handling a medium-complexity request via policy-aware RAG route.

**Characters:**
| Role | Name |
|---|---|
| Employee | Rian |
| Chatbot | AskIT |

---

**Shot 1 — Dashboard → IT Assistant**
Rian opens the IT Assistant from the dashboard.

**Shot 2 — User asks something new**
Rian types: *"I'd like to request graphic design software for the marketing team — is that possible?"*
→ Enter.

**Shot 3 — Chatbot checks policy (confidence: MEDIUM — RAG activated)**
A *"Searching company policies..."* indicator appears, then Chatbot responds:

> *"Based on company software policies, graphic design software requests (e.g. Figma, Adobe Creative Cloud) can be submitted by the marketing team with direct manager approval.*
>
> *Please fill out the software request form below with:*
> - Software name
> - Purpose of use
> - Manager approval attachment"*

There is **1 button**:
- `[📄 Software Request Form]`

**Shot 4 — User fills the form**
Rian fills in:
- Software: *Figma*
- Purpose: *"For creating promo materials and social media content for the marketing team"*
- Manager: *"Budi Santoso — Head of Marketing"*
→ **Submit**

**Shot 5 — Chatbot wraps up with policy info**
> *"Your Figma request for the marketing team has been submitted (**Request ID #REQ-0051**). Per company policy, this software requires IT Manager approval with an estimated turnaround of 1–2 business days. You'll receive an email notification once it's approved."*

There is a **button**:
- `[📧 View Request Detail]`

---

## 🌐 Scenario 3 — Escalation ke IT Support (Low Confidence Route)

### Bahasa Indonesia

**Tujuan:** Menunjukkan **fallback / escalation flow** ketika chatbot tidak yakin — mengalihkan ke manusia & membuat tiket.

**Karakter:**
| Role | Nama |
|---|---|
| Employee | Dina |
| Chatbot | AskIT |
| IT Support | Bayu |

---

**Shot 1 — Dashboard → IT Assistant**
Dina buka IT Assistant dari dashboard.

**Shot 2 — User kirim pertanyaan ambigu / rumit**
Dina ketik: *"Jaringan saya lambat banget, tapi temen lain yang pakai wifi yang sama lancar. Kok bisa ya?"*
→ Enter.

**Shot 3 — Chatbot deteksi confidence LOW**
Chatbot respon dengan sikap jujur:

> *"Halo Dina, saya mendeteksi masalah jaringan Anda cukup spesifik dan membutuhkan investigasi lebih lanjut. Saya akan membuat tiket untuk Anda dan menghubungkan dengan tim IT Support khusus jaringan secara langsung."*

Ada **button**:
- `[✅ Buat Tiket Support]`

**Shot 4 — Tiket dibuat otomatis**
Sistem langsung buat tiket dengan info:
| Field | Isi |
|---|---|
| Request ID | #REQ-0078 |
| Kategori | Network Troubleshooting |
| Priority | Medium |
| Status | Open |

**Shot 5 — Chatbot bertambah info untuk IT Support**
> *"Tiket **#REQ-0078** sudah dibuat. Saya akan mengumpulkan sedikit informasi lagi agar tim IT bisa menangani lebih cepat:* Apakah Anda sudah mencoba restart router? Apakah masalahnya hanya terjadi di laptop tertentu?"*

Dina jawab: *"Sudah restart, masalahnya hanya di laptop saya saja."*

**Shot 6 — Dina terhubung dengan IT Support**
Chatbox bertambah pesan dari **Bayu (IT Support)**:

> *"Halo Dina, saya Bayu dari tim IT. Saya sudah menerima tiket Anda. Bisa tolong sebutkan nama laptop dan OS yang Anda pakai? Saya akan bantu diagnose lebih lanjut."*

**Shot 7 — Closing shot**
Dina lanjut percakapan dengan Bayu. Di sidebar ada badge **"Live with IT Support — Ticket #REQ-0078"**.

---

### English

**Goal:** Demonstrates the **fallback/escalation flow** when the chatbot isn't confident enough — transferring to a human and creating a ticket.

**Characters:**
| Role | Name |
|---|---|
| Employee | Dina |
| Chatbot | AskIT |
| IT Support | Bayu |

---

**Shot 1 — Dashboard → IT Assistant**
Dina opens IT Assistant from the dashboard.

**Shot 2 — User sends ambiguous/complex question**
Dina types: *"My internet is really slow, but my coworkers on the same WiFi are fine. Why is that happening?"*
→ Enter.

**Shot 3 — Chatbot detects LOW confidence**
Chatbot is honest and transparent:

> *"Hi Dina, I've detected that your network issue is quite specific and requires further investigation. I'll create a support ticket for you and connect you directly with our Network IT Support team."*

There is a **button**:
- `[✅ Create Support Ticket]`

**Shot 4 — Ticket is auto-created**
The system instantly creates a ticket with the following info:
| Field | Value |
|---|---|
| Request ID | #REQ-0078 |
| Category | Network Troubleshooting |
| Priority | Medium |
| Status | Open |

**Shot 5 — Chatbot gathers more info for IT Support**
> *"Ticket **#REQ-0078** has been created. Let me collect a few more details so the IT team can resolve this faster:* Have you tried restarting your router? Does this issue only happen on a specific laptop?"*

Dina replies: *"Yes I've restarted it, the issue only happens on my laptop."*

**Shot 6 — Dina is connected to IT Support**
A new message appears in the chatbox from **Bayu (IT Support)**:

> *"Hi Dina, I'm Bayu from the IT team. I've received your ticket. Could you share your laptop name and OS so I can diagnose the issue further?"*

**Shot 7 — Closing shot**
Dina continues the conversation with Bayu. The sidebar shows a badge: **"Live with IT Support — Ticket #REQ-0078"**.

---

## 📋 Summary Table

| # | Skenario | Confidence | Route | Fitur Utama |
|---|---|---|---|---|
| 1 | Reset Password | **HIGH** (>0.85) | Auto-response | Form automation, Request ID, status tracking |
| 2 | Pengajuan Software | **MEDIUM** (0.60–0.85) | RAG — Policy retrieval | Knowledge base lookup, form generation |
| 3 | Jaringan Lambat | **LOW** (<0.60) | Escalation | Auto-ticket creation, human handoff |

---

*Dokumen ini dibuat untuk keperluan video demo aplikasi AskIT. Jangan hapus header atau lembar skenario.*
