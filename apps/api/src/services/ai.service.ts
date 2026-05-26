import { policyService } from './policy.service';

interface IntentClassification {
  intent: string;
  confidence: number;
  entities: Record<string, string>;
}

interface OpenAIResponse {
  id: string;
  choices: Array<{
    finish_reason: string;
    message: {
      role: string;
      content: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

const RESPONSE_SYSTEM_PROMPT = `You are a friendly and helpful IT support assistant named "AskIT". You help users with various IT issues including:

- Password resets and account unlock
- Email access and configuration
- VPN setup and troubleshooting
- Software installation requests
- Hardware issues (laptop, network)
- WiFi connectivity problems
- Security incident reporting
- Permission and access requests

Guidelines:
1. Be conversational and friendly, not robotic
2. Ask clarifying questions when needed
3. Provide specific, actionable solutions
4. For complex issues, offer to create a support ticket
5. Keep responses concise but helpful
6. Use plain language, avoid technical jargon when possible
7. Show empathy and patience
8. If you don't know something, say so honestly
9. ALWAYS respond in the same language as the user's query. If user writes in Indonesian, respond in Indonesian. If user writes in English, respond in English.`;

function isIndonesian(text: string): boolean {
  const indonesianPatterns = [
    /[\u0600-\u06FF]/,
    /\b(aku|anda|kami|kita|saya|loro|ini|itu|dari|untuk|dengan|pada|di|ke|yang|dan|atau|tidak|ada|untuk|nya|lah|pun|sudah|sedang|tidak|akan|mau|tolong|bisa|harus|kenapa|mengapa|bagaimana|apa)\b/i,
    /^(tolong|help|bantu|saya|aku|whatsapp|sms|hubungi|customer|admin|support|butuh|butuh|membutuhkan|kebutuhan)/i,
  ];
  const indonesianCount = indonesianPatterns.filter(pattern => pattern.test(text)).length;
  return indonesianCount >= 1;
}

export const aiService = {
  async classifyIntent(text: string, history?: string[]): Promise<IntentClassification> {
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

    if (!apiKey) {
      return this.fallbackClassification(text);
    }

    try {
      const context = history && history.length > 0
        ? `Conversation history: ${history.join(' ')}\n\nCurrent message: ${text}`
        : text;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: `You are an IT support intent classifier. Analyze the user message and classify their intent.
Available intents:
- password_reset: User wants to reset or forgot password
- vpn_issue: VPN is not working properly
- wifi_issue: WiFi connectivity problems
- software_request: User wants to request software
- excel_crash: Excel application crash or not responding
- printer_issue: Printer problems

Respond with JSON in this exact format:
{"intent": "intent_name", "confidence": 0.0-1.0, "entities": {"key": "value"}}

Confidence guidelines:
- >0.9: Very certain, clear match
- 0.7-0.9: Good match, some ambiguity
- 0.5-0.7: Weak match, use general_inquiry as fallback
- <0.5: Very uncertain, likely general_inquiry

Extract entities like service names, action types, or problem descriptions.`
            },
            {
              role: 'user',
              content: context
            }
          ],
          temperature: 0.1,
          max_tokens: 200,
        }),
      });

      if (!response.ok) {
        console.error('OpenAI API error:', response.status);
        return this.fallbackClassification(text);
      }

      const data = await response.json() as OpenAIResponse;
      const content = data.choices[0]?.message?.content;

      if (!content) {
        return this.fallbackClassification(text);
      }

      const parsed = JSON.parse(content);
      return {
        intent: parsed.intent || 'general_inquiry',
        confidence: Math.max(0, Math.min(1, parsed.confidence || 0.5)),
        entities: parsed.entities || {},
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      return this.fallbackClassification(text);
    }
  },

  fallbackClassification(text: string): IntentClassification {
    const lower = text.toLowerCase();

    if (lower.includes('password') && (lower.includes('reset') || lower.includes('forgot') || lower.includes('change') || lower.includes('how') || lower.includes('lupa'))) {
      return { intent: 'password_reset', confidence: 0.9, entities: { service: 'password', action: 'reset' } };
    }
    if (lower.includes('vpn')) {
      return { intent: 'vpn_issue', confidence: 0.85, entities: { service: 'vpn', problem: 'not_working' } };
    }
    if (lower.includes('wifi') || lower.includes('wireless') || lower.includes('internet')) {
      return { intent: 'wifi_issue', confidence: 0.85, entities: { service: 'wifi', problem: 'connectivity' } };
    }
    if (lower.includes('software') || lower.includes('install') || lower.includes('app') || lower.includes('request')) {
      return { intent: 'software_request', confidence: 0.85, entities: { category: 'software', action: 'request' } };
    }
    if ((lower.includes('excel') || lower.includes('spreadsheet')) && (lower.includes('crash') || lower.includes('not responding') || lower.includes('hang') || lower.includes('freeze') || lower.includes('tidak bisa buka'))) {
      return { intent: 'excel_crash', confidence: 0.88, entities: { category: 'software', name: 'excel', problem: 'crash' } };
    }
    if (lower.includes('printer') || lower.includes('print')) {
      return { intent: 'printer_issue', confidence: 0.85, entities: { category: 'printer', problem: 'not_working' } };
    }

    return { intent: 'general_inquiry', confidence: 0.6, entities: {} };
  },

  async generateResponse(intent: string, context?: Record<string, unknown>): Promise<{ text: string; policies: Array<{ id: string; title: string; content: string; relevance: number }> }> {
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    const userMessage = context?.query as string || '';
    const detectedLang = isIndonesian(userMessage) ? 'Indonesian' : 'English';
    const langInstruction = detectedLang === 'Indonesian'
      ? 'IMPORTANT: Respond in Indonesian language only.'
      : 'IMPORTANT: Respond in English language only.';

    if (!apiKey) {
      return this.fallbackResponse(intent, userMessage, detectedLang);
    }

    try {
      const intentDescriptions: Record<string, string> = {
        password_reset: 'The user wants to reset or forgot their password',
        vpn_issue: 'The user is having VPN issues',
        wifi_issue: 'The user has WiFi connectivity problems',
        software_request: 'The user wants to request software',
        excel_crash: 'The user has Excel crash issues',
        printer_issue: 'The user has printer problems',
        general_inquiry: 'The user has a general IT question',
      };

      const intentDesc = intentDescriptions[intent] || 'General IT support request';

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: `${RESPONSE_SYSTEM_PROMPT}\n\n${langInstruction}`
            },
            {
              role: 'user',
              content: userMessage || intentDesc
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        console.error('OpenAI API error:', response.status);
        return this.fallbackResponse(intent, userMessage, detectedLang);
      }

      const data = await response.json() as OpenAIResponse;
      const responseText = data.choices[0]?.message?.content;

      if (!responseText) {
        return this.fallbackResponse(intent, userMessage, detectedLang);
      }

      let policies: Array<{ id: string; title: string; content: string; relevance: number }> = [];
      if (userMessage) {
        try {
          policies = await policyService.retrieveRelevantPolicies(userMessage, intent);
        } catch (error) {
          console.error('Error retrieving policies:', error);
        }
      }

      return { text: responseText, policies };
    } catch (error) {
      console.error('OpenAI API error:', error);
      return this.fallbackResponse(intent, userMessage, detectedLang);
    }
  },

  fallbackResponse(intent: string, userMessage: string, lang?: string): { text: string; policies: Array<{ id: string; title: string; content: string; relevance: number }> } {
    const detectedLang = lang || (isIndonesian(userMessage) ? 'Indonesian' : 'English');
    const isId = detectedLang === 'Indonesian';

    const responseTemplates: Record<string, { en: string; id: string }> = {
      password_reset: {
        en: `We have received your password reset request.

Please follow these steps:

1. Open the company password reset page
2. Enter your email/username
3. Follow the instructions sent to your email

If you're still having trouble, please reply with a screenshot of the error you're seeing.

Thank you.`,
        id: `Kami telah menerima permintaan reset password Anda.

Silakan ikuti langkah-langkah berikut:

1. Buka halaman reset password perusahaan
2. Masukkan email/username Anda
3. Ikuti instruksi yang dikirim ke email Anda

Jika masih mengalami kesulitan, mohon kirimkan tangkapan layar error yang Anda lihat.

Terima kasih.`,
      },
      vpn_issue: {
        en: `Please try the following steps:

1. Make sure your internet connection is stable
2. Disconnect and reconnect the VPN
3. Restart your laptop/PC
4. Make sure your VPN username & password are correct
5. Temporarily disable antivirus/firewall (if allowed)

If it still fails, please send:

- Screenshot of the error
- VPN name you're using
- Time of the incident

So we can help you further.`,
        id: `Silakan coba langkah-langkah berikut:

1. Pastikan koneksi internet Anda stabil
2. Putuskan dan sambungkan kembali VPN
3. Restart laptop/PC Anda
4. Pastikan username & password VPN Anda benar
5. Matikan sementara antivirus/firewall (jika diizinkan)

Jika masih gagal, mohon kirimkan:

- Tangkapan layar error
- Nama VPN yang Anda gunakan
- Waktu kejadian

Agar kami dapat membantu lebih lanjut.`,
      },
      wifi_issue: {
        en: `If your laptop is connected to Wi-Fi but can't access the internet, try these steps one by one:

1. Check if Wi-Fi is actually connected
     - Make sure the Wi-Fi icon does not have an exclamation mark / globe
     - Try opening a few different websites

  2. Test other devices
     - If your phone also cannot access the internet on the same Wi-Fi, the problem is likely with the router or ISP
     - If your phone can, the problem is on your laptop

  3. Simple restart
     - Restart your laptop
     - Restart your modem/router (unplug for 30 seconds)

  4. Forget Wi-Fi then reconnect (Windows)
     - Settings > Network & Internet > Wi-Fi > Manage known networks > select Wi-Fi > Forget
     - Reconnect and enter the password

  5. Turn off VPN / Proxy
     - VPNs often cause "connected but no internet" issues

  6. Reset Windows network
     - Open Command Prompt as Administrator and run:
       ipconfig /flushdns
       ipconfig /release
       ipconfig /renew
       netsh winsock reset
     - After that, restart your laptop.

  7. Check network adapter
     - Device Manager > Network adapters
     - Make sure there are no yellow icons
     - Right-click on Wi-Fi adapter > Disable > Enable

  8. Change DNS
     - Use 8.8.8.8 or 1.1.1.1

  9. Update Wi-Fi driver
     - Device Manager > Wi-Fi adapter > Update driver`,
        id: `Jika laptop Anda terhubung ke Wi-Fi tetapi tidak bisa mengakses internet, coba langkah-langkah berikut:

1. Cek apakah Wi-Fi benar-benar terhubung
     - Pastikan ikon Wi-Fi tidak memiliki tanda seru / globe
     - Coba buka beberapa website berbeda

  2. Tes perangkat lain
     - Jika HP Anda juga tidak bisa internet di Wi-Fi yang sama, masalah kemungkinan di router atau ISP
     - Jika HP bisa, masalah ada di laptop Anda

  3. Restart sederhana
     - Restart laptop Anda
     - Restart modem/router (cabut selama 30 detik)

  4. Lupa Wi-Fi lalu sambungkan kembali (Windows)
     - Settings > Network & Internet > Wi-Fi > Manage known networks > pilih Wi-Fi > Forget
     - Sambungkan kembali dan masukkan password

  5. Matikan VPN / Proxy
     - VPN sering menyebabkan masalah "terhubung tapi tidak ada internet"

  6. Reset network Windows
     - Buka Command Prompt as Administrator dan jalankan:
       ipconfig /flushdns
       ipconfig /release
       ipconfig /renew
       netsh winsock reset
     - Setelah itu, restart laptop Anda.

  7. Cek network adapter
     - Device Manager > Network adapters
     - Pastikan tidak ada ikon kuning
     - Klik kanan pada Wi-Fi adapter > Disable > Enable

  8. Ganti DNS
     - Gunakan 8.8.8.8 atau 1.1.1.1

  9. Update driver Wi-Fi
     - Device Manager > Wi-Fi adapter > Update driver`,
      },
      software_request: {
        en: `Software installation request has been received. Please fill out the form below.`,
        id: `Permintaan instalasi software telah diterima. Silakan isi form berikut.`,
      },
      excel_crash: {
        en: `We have received a report that Microsoft Excel application is crashing/cannot be opened.

Please try the following steps:

1. Close the application and reopen it
2. Restart your laptop/PC
3. Make sure there are no pending Windows updates
4. Try opening the application in Safe Mode
5. Make sure the file you're opening is not corrupted

For Microsoft Excel:

* Press Windows + R
* Type: excel /safe
* Press Enter

If it's still having problems, please send:

* Screenshot of the error
* Time of the incident
* File that caused the crash (if any)

Thank you.`,
        id: `Kami telah menerima laporan bahwa aplikasi Microsoft Excel crash/tidak bisa dibuka.

Silakan coba langkah-langkah berikut:

1. Tutup aplikasi dan buka kembali
2. Restart laptop/PC Anda
3. Pastikan tidak ada Windows updates yang tertunda
4. Coba buka aplikasi dalam Safe Mode
5. Pastikan file yang Anda buka tidak rusak

Untuk Microsoft Excel:

* Tekan Windows + R
* Ketik: excel /safe
* Tekan Enter

Jika masih bermasalah, mohon kirimkan:

* Tangkapan layar error
* Waktu kejadian
* File yang menyebabkan crash (jika ada)

Terima kasih.`,
      },
      printer_issue: {
        en: `Please try the following steps:

1. Make sure the printer is ON
2. Check the printer cable/Wi-Fi connection
3. Make sure the printer is not set to Offline
4. Restart the printer and laptop
5. Try printing the document again

If it's still having problems, please send:

* Printer name
* Screenshot of the error
* Printer location

Thank you.`,
        id: `Silakan coba langkah-langkah berikut:

1. Pastikan printer dalam kondisi ON
2. Cek kabel/Wi-Fi printer
3. Pastikan printer tidak设置为 Offline
4. Restart printer dan laptop
5. Coba cetak dokumen lagi

Jika masih bermasalah, mohon kirimkan:

* Nama printer
* Tangkapan layar error
* Lokasi printer

Terima kasih.`,
      },
      general_inquiry: {
        en: `Thank you for contacting IT support.

How can I help you today? Please describe your issue and I'll assist you.

Common topics I can help with:
- Password reset or account issues
- VPN and Wi-Fi connectivity
- Software installation requests
- Hardware problems
- Printer issues

Feel free to ask!`,
        id: `Terima kasih telah menghubungi IT support.

Bagaimana saya bisa membantu Anda hari ini? Mohon jelaskan masalah Anda dan saya akan membantu.

Topik umum yang bisa saya bantu:
- Reset password atau masalah akun
- VPN dan konektivitas Wi-Fi
- Permintaan instalasi software
- Masalah hardware
- Masalah printer

Silakan tanya!`,
      },
    };

    const templates = responseTemplates[intent] || responseTemplates.general_inquiry;
    const baseText = isId ? templates.id : templates.en;

    return { text: baseText, policies: [] };
  },
};