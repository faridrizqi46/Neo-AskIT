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
- email_access: User cannot access their email
- email_password: User needs to reset email password
- account_locked: User account is locked
- vpn_setup: User wants to set up VPN
- vpn_issue: VPN is not working properly
- laptop_slow: Laptop is running slow
- laptop_wont_start: Laptop won't start or boot issues
- software_request: User wants to request software
- software_install: User needs help installing software
- wifi_issue: WiFi connectivity problems
- security_incident: Suspicious activity or phishing
- permission_request: User needs access/permissions
- general_inquiry: General IT questions

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
    if (lower.includes('email') || lower.includes('outlook') || lower.includes('mail')) {
      if (lower.includes('access') || lower.includes('can\'t') || lower.includes('cannot')) {
        return { intent: 'email_access', confidence: 0.88, entities: { service: 'email', problem: 'access' } };
      }
      if (lower.includes('password') || lower.includes('forgot')) {
        return { intent: 'email_password', confidence: 0.85, entities: { service: 'email', action: 'password_reset' } };
      }
      return { intent: 'email_general', confidence: 0.7, entities: { service: 'email' } };
    }
    if (lower.includes('vpn') || lower.includes('virtual private network')) {
      if (lower.includes('setup') || lower.includes('install') || lower.includes('configure')) {
        return { intent: 'vpn_setup', confidence: 0.9, entities: { service: 'vpn', action: 'setup' } };
      }
      if (lower.includes('not working') || lower.includes('error') || lower.includes('issue')) {
        return { intent: 'vpn_issue', confidence: 0.85, entities: { service: 'vpn', problem: 'not_working' } };
      }
      return { intent: 'vpn_general', confidence: 0.75, entities: { service: 'vpn' } };
    }
    if (lower.includes('laptop') || lower.includes('computer') || lower.includes('pc')) {
      if (lower.includes('slow') || lower.includes('lagging') || lower.includes('hang')) {
        return { intent: 'laptop_slow', confidence: 0.85, entities: { service: 'laptop', problem: 'slow_performance' } };
      }
      if (lower.includes('not starting') || lower.includes('won\'t start') || lower.includes('blue screen')) {
        return { intent: 'laptop_wont_start', confidence: 0.88, entities: { service: 'laptop', problem: 'startup_failure' } };
      }
      return { intent: 'laptop_issue', confidence: 0.8, entities: { service: 'laptop' } };
    }
    if (lower.includes('software') || lower.includes('install') || lower.includes('app')) {
      if (lower.includes('request') || lower.includes('need') || lower.includes('want')) {
        return { intent: 'software_request', confidence: 0.85, entities: { category: 'software', action: 'request' } };
      }
      return { intent: 'software_install', confidence: 0.8, entities: { category: 'software', action: 'install' } };
    }
    if (lower.includes('wifi') || lower.includes('wireless') || lower.includes('internet')) {
      if (lower.includes('not working') || lower.includes('disconnect') || lower.includes('slow')) {
        return { intent: 'wifi_issue', confidence: 0.85, entities: { service: 'wifi', problem: 'connectivity' } };
      }
      return { intent: 'wifi_setup', confidence: 0.75, entities: { service: 'wifi' } };
    }
    if (lower.includes('account') || lower.includes('locked') || lower.includes('disable')) {
      return { intent: 'account_locked', confidence: 0.88, entities: { category: 'account', problem: 'locked' } };
    }
    if (lower.includes('phishing') || lower.includes('suspicious') || lower.includes('security')) {
      return { intent: 'security_incident', confidence: 0.92, entities: { category: 'security', type: 'suspicious_activity' } };
    }
    if (lower.includes('access') || lower.includes('permission') || lower.includes('authorize')) {
      return { intent: 'permission_request', confidence: 0.82, entities: { category: 'access', type: 'permission' } };
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
        email_access: 'The user cannot access their email account',
        email_password: 'The user needs to reset their email password',
        account_locked: 'The user\'s account is locked',
        vpn_setup: 'The user wants to set up VPN',
        vpn_issue: 'The user is having VPN issues',
        laptop_slow: 'The user\'s laptop is running slow',
        laptop_wont_start: 'The user\'s laptop won\'t start',
        software_request: 'The user wants to request software',
        software_install: 'The user needs help installing software',
        wifi_issue: 'The user has WiFi connectivity problems',
        security_incident: 'The user is reporting a security incident',
        permission_request: 'The user needs access permissions',
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
      password_reset: 'I can help you reset your password! First, let me confirm - are you trying to reset your computer password or your email password? For computer password resets, you can use the self-service portal at reset.company.com. For email passwords, you\'ll need to verify your identity through our security team.',
      email_access: 'I\'m sorry to hear you\'re having trouble accessing your email. Can you tell me what happens when you try to sign in? Do you see any error messages, or does it just not let you in? This will help me figure out the best way to assist you.',
      email_password: 'Let me help you reset your email password! Have you tried using the password reset link on the login page? If that doesn\'t work, I can help you verify your identity through our IT security team.',
      vpn_setup: 'I\'d be happy to help you set up VPN! To get started, I need to know which VPN client your team uses - do you have the VPN software already installed on your computer, or do you need me to guide you through the installation first?',
      vpn_issue: 'That VPN issue sounds frustrating! Let me help you troubleshoot. Can you tell me what specific error message you\'re seeing, or does it just fail to connect? Also, are you working from home or from the office?',
      laptop_slow: 'Nobody likes a slow laptop! Let me see if I can help speed things up. First, can you tell me which applications are running slowly? And do you notice if it\'s particularly slow when you have many programs open, or all the time?',
      laptop_wont_start: 'That\'s concerning when a laptop won\'t start! Before we escalate this to hardware support, let\'s try a few things. Can you try a hard reset by holding the power button for 10 seconds, then trying to turn it on again? If that doesn\'t work, let me know what you see - any lights, sounds, or just a black screen.',
      software_request: 'I can help you request software! Let me know which application you need and I\'ll submit the request for approval. What software are you looking for?',
      software_install: 'I can help you install software! Do you have administrator access on your computer, or do you need me to request that permission be granted first?',
      wifi_issue: 'WiFi issues can be tricky! Let\'s start with some basics - have you tried turning your WiFi off and on again, or restarting your computer? If that doesn\'t work, can you see other devices connecting to the same network, or is it just you?',
      security_incident: 'I take security concerns seriously. Please tell me what you\'ve noticed - are you seeing suspicious emails, unauthorized access attempts, or something else? The more details you can provide, the better we can protect the company.',
      account_locked: 'I can help you unlock your account! This usually happens after too many failed login attempts. Don\'t worry - it\'s a security feature. I can help you verify your identity and get you back in right away.',
      permission_request: 'I can help you get the access you need! Can you tell me which system or data you need access to, and why you need it? This will help me route your request to the right person for approval.',
      general_inquiry: userMessage 
        ? `Thanks for reaching out! I\'m here to help with your IT needs. You mentioned: "${userMessage}". Let me think about how best to assist you. Could you give me a bit more detail about what you\'re looking for?`
        : 'Thanks for reaching out! I\'m here to help with your IT needs. What can I assist you with today?',
    };

    const baseText = responseTemplates[intent] || responseTemplates.general_inquiry;

    return { text: baseText, policies: [] };
  },
};