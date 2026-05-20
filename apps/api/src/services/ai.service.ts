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

const INTENT_TAXONOMY = `
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
`.trim();

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
${INTENT_TAXONOMY}

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
    const responseTemplates: Record<string, string> = {
      password_reset: 'I can help you reset your password. Please click the link below to start the password reset process.',
      email_access: 'I can help you with your email access issue. Can you describe what happens when you try to sign in?',
      email_password: 'I can help you reset your email password. Have you tried the self-service password reset portal?',
      vpn_setup: 'I can assist with VPN setup. Have you tried using the self-service VPN portal? I can guide you through the steps.',
      vpn_issue: 'I see you\'re having VPN issues. Let me help you troubleshoot. Can you describe the error message you\'re seeing?',
      laptop_slow: 'I see you\'re experiencing slow laptop performance. Let me help you run some diagnostics. What applications are running slowly?',
      laptop_wont_start: 'I understand your laptop won\'t start. This could be a hardware or software issue. Let me help you troubleshoot.',
      software_request: 'I can help you request software. Please fill out the form below and your manager will be asked to approve the request.',
      software_install: 'I can help you install software. Let me check if the software is available in the self-service portal.',
      wifi_issue: 'I can help you troubleshoot WiFi issues. Have you tried restarting your computer and checking if other devices can connect?',
      security_incident: 'This sounds like a security concern. Please provide more details so we can take appropriate action immediately.',
      account_locked: 'I can help you unlock your account. Please verify your identity through the security portal.',
      permission_request: 'I can help you request access permissions. Please specify which system or resource you need access to.',
      general_inquiry: 'I understand your request. Let me assist you with that. How can I help you further?',
    };

    const baseText = responseTemplates[intent] || 'I understand your request. Let me assist you with that. How can I help you further?';

    let policies: Array<{ id: string; title: string; content: string; relevance: number }> = [];
    if (context?.query) {
      try {
        const relevantPolicies = await policyService.retrieveRelevantPolicies(
          context.query as string,
          intent
        );
        policies = relevantPolicies;
      } catch (error) {
        console.error('Error retrieving policies:', error);
      }
    }

    return { text: baseText, policies };
  },
};