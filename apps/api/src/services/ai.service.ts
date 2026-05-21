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
8. If you don't know something, say so honestly`;

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

    if (lower.includes('password') && (lower.includes('reset') || lower.includes('forgot') || lower.includes('change'))) {
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

    if (!apiKey) {
      return this.fallbackResponse(intent, userMessage);
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
              content: RESPONSE_SYSTEM_PROMPT
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
        return this.fallbackResponse(intent, userMessage);
      }

      const data = await response.json() as OpenAIResponse;
      const responseText = data.choices[0]?.message?.content;

      if (!responseText) {
        return this.fallbackResponse(intent, userMessage);
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
      return this.fallbackResponse(intent, userMessage);
    }
  },

  fallbackResponse(intent: string, userMessage: string): { text: string; policies: Array<{ id: string; title: string; content: string; relevance: number }> } {
    const responseTemplates: Record<string, string> = {
      password_reset: `Kami menerima permintaan reset password Anda.

Silakan lakukan langkah berikut:

1. Buka halaman reset password perusahaan
2. Masukkan email/username Anda
3. Ikuti instruksi yang dikirim ke email

Jika masih mengalami kendala, mohon balas pesan ini dengan screenshot error yang muncul.

Terima kasih.`,
      vpn_issue: `Silakan coba langkah berikut:

1. Pastikan koneksi internet stabil
2. Disconnect lalu reconnect VPN
3. Restart laptop/PC
4. Pastikan username & password VPN benar
5. Matikan antivirus/firewall sementara (jika diperbolehkan)

Jika masih gagal, mohon kirim:

- Screenshot error
- Nama VPN yang digunakan
- Waktu kejadian

Agar kami dapat membantu lebih lanjut.`,
      wifi_issue: `Kalau laptop tersambung ke Wi-Fi tapi tidak bisa internet, coba langkah berikut satu per satu:

1. **Cek apakah Wi-Fi benar-benar terhubung**
   * Pastikan ikon Wi-Fi tidak ada tanda seru / globe.
   * Coba buka beberapa situs berbeda.

2. **Tes perangkat lain**
   * Jika HP juga tidak bisa internet di Wi-Fi yang sama → masalah kemungkinan di router atau ISP.
   * Jika HP bisa → masalah ada di laptop.

3. **Restart sederhana**
   * Restart laptop.
   * Restart modem/router (cabut listrik 30 detik).

4. **Forget Wi-Fi lalu sambung ulang**
   * Windows:
     * Settings → Network & Internet → Wi-Fi → Manage known networks → pilih Wi-Fi → Forget.
     * Sambungkan lagi dan masukkan password.

5. **Matikan VPN / Proxy**
   * VPN sering bikin koneksi "connected but no internet".

6. **Reset jaringan Windows**
   Buka Command Prompt sebagai Administrator lalu jalankan:
\`\`\`bat
ipconfig /flushdns
ipconfig /release
ipconfig /renew
netsh winsock reset
\`\`\`
Setelah itu restart laptop.

7. **Cek adaptor jaringan**
   * Device Manager → Network adapters.
   * Pastikan tidak ada tanda kuning.
   * Klik kanan adaptor Wi-Fi → Disable → Enable.

8. **Ganti DNS**
   Gunakan:
   * \`8.8.8.8\`
   * \`1.1.1.1\`

9. **Update driver Wi-Fi**
   * Device Manager → adaptor Wi-Fi → Update driver.`,
      software_request: `Permintaan install software memerlukan approval terlebih dahulu.

Tiket support: SR00012

Mohon menunggu proses persetujuan sebelum instalasi dilakukan.

Terima kasih.`,
      excel_crash: `Kami menerima laporan bahwa aplikasi Ms. Excel mengalami crash/tidak dapat dibuka.

Silakan coba langkah berikut:

1. Tutup aplikasi lalu buka kembali
2. Restart laptop/PC
3. Pastikan tidak ada update Windows yang pending
4. Coba buka aplikasi dalam Safe Mode
5. Pastikan file yang dibuka tidak corrupt

Untuk Microsoft Excel:

* Tekan Windows + R
* Ketik: excel /safe
* Tekan Enter

Jika masih bermasalah, mohon kirim:

* Screenshot error
* Waktu kejadian
* File yang menyebabkan crash (jika ada)

Terima kasih.`,
      printer_issue: `Silakan coba langkah berikut:

1. Pastikan printer dalam keadaan ON
2. Periksa koneksi kabel/Wi-Fi printer
3. Pastikan printer tidak dalam status Offline
4. Restart printer dan laptop
5. Coba print ulang dokumen

Jika masih bermasalah, mohon kirim:

* Nama printer
* Screenshot error
* Lokasi printer

Terima kasih.`,
    };

    const baseText = responseTemplates[intent] || responseTemplates.general_inquiry;

    return { text: baseText, policies: [] };
  },
};