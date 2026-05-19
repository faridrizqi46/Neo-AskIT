import { sessionRepo } from '../repositories/session.repo';

export const intentService = {
  classify(text: string): { intent: string; confidence: number; entities: Record<string, string> } {
    const lower = text.toLowerCase();

    if (lower.includes('password') && (lower.includes('reset') || lower.includes('forgot') || lower.includes('change'))) {
      return {
        intent: 'password_reset',
        confidence: 0.9,
        entities: { service: 'password', action: 'reset' },
      };
    }

    if (lower.includes('email') || lower.includes('outlook') || lower.includes('mail')) {
      if (lower.includes('access') || lower.includes('can\'t') || lower.includes('cannot') || lower.includes('unable')) {
        return {
          intent: 'email_access',
          confidence: 0.88,
          entities: { service: 'email', problem: 'access' },
        };
      }
      if (lower.includes('password') || lower.includes('forgot')) {
        return {
          intent: 'email_password',
          confidence: 0.85,
          entities: { service: 'email', action: 'password_reset' },
        };
      }
      return {
        intent: 'email_general',
        confidence: 0.7,
        entities: { service: 'email' },
      };
    }

    if (lower.includes('vpn') || lower.includes('virtual private network')) {
      if (lower.includes('setup') || lower.includes('install') || lower.includes('configure')) {
        return {
          intent: 'vpn_setup',
          confidence: 0.9,
          entities: { service: 'vpn', action: 'setup' },
        };
      }
      if (lower.includes('not working') || lower.includes('error') || lower.includes('issue')) {
        return {
          intent: 'vpn_issue',
          confidence: 0.85,
          entities: { service: 'vpn', problem: 'not_working' },
        };
      }
      return {
        intent: 'vpn_general',
        confidence: 0.75,
        entities: { service: 'vpn' },
      };
    }

    if (lower.includes('laptop') || lower.includes('computer') || lower.includes('pc')) {
      if (lower.includes('slow') || lower.includes('lagging') || lower.includes('hang')) {
        return {
          intent: 'laptop_slow',
          confidence: 0.85,
          entities: { service: 'laptop', problem: 'slow_performance' },
        };
      }
      if (lower.includes('not starting') || lower.includes('won\'t start') || lower.includes('blue screen')) {
        return {
          intent: 'laptop_wont_start',
          confidence: 0.88,
          entities: { service: 'laptop', problem: 'startup_failure' },
        };
      }
      return {
        intent: 'laptop_issue',
        confidence: 0.8,
        entities: { service: 'laptop' },
      };
    }

    if (lower.includes('software') || lower.includes('install') || lower.includes('app')) {
      if (lower.includes('request') || lower.includes('need') || lower.includes('want')) {
        return {
          intent: 'software_request',
          confidence: 0.85,
          entities: { category: 'software', action: 'request' },
        };
      }
      return {
        intent: 'software_install',
        confidence: 0.8,
        entities: { category: 'software', action: 'install' },
      };
    }

    if (lower.includes('wifi') || lower.includes('wireless') || lower.includes('internet')) {
      if (lower.includes('not working') || lower.includes('disconnect') || lower.includes('slow')) {
        return {
          intent: 'wifi_issue',
          confidence: 0.85,
          entities: { service: 'wifi', problem: 'connectivity' },
        };
      }
      return {
        intent: 'wifi_setup',
        confidence: 0.75,
        entities: { service: 'wifi' },
      };
    }

    if (lower.includes('account') || lower.includes('locked') || lower.includes('disable')) {
      return {
        intent: 'account_locked',
        confidence: 0.88,
        entities: { category: 'account', problem: 'locked' },
      };
    }

    if (lower.includes('phishing') || lower.includes('suspicious') || lower.includes('security')) {
      return {
        intent: 'security_incident',
        confidence: 0.92,
        entities: { category: 'security', type: 'suspicious_activity' },
      };
    }

    if (lower.includes('access') || lower.includes('permission') || lower.includes('authorize')) {
      return {
        intent: 'permission_request',
        confidence: 0.82,
        entities: { category: 'access', type: 'permission' },
      };
    }

    return {
      intent: 'general_inquiry',
      confidence: 0.6,
      entities: {},
    };
  },

  getSuggestedActions(intent: string): string[] {
    const actionMap: Record<string, string[]> = {
      password_reset: ['reset_password_form', 'send_email_link', 'unlock_account'],
      email_access: ['check_email_status', 'reset_credentials', 'contact_support'],
      email_password: ['reset_email_password', 'verify_identity'],
      vpn_setup: ['download_vpn_client', 'setup_instructions', 'test_connection'],
      vpn_issue: ['restart_vpn', 'check_network', 'reinstall_client'],
      laptop_slow: ['run_diagnostics', 'clear_temp_files', 'check_resources'],
      laptop_wont_start: ['hardware_check', 'boot_safe_mode', 'support_ticket'],
      software_request: ['submit_request_form', 'check_license', 'approval_workflow'],
      software_install: ['self_service_install', 'request_admin_install'],
      wifi_issue: ['restart_adapter', 'forget_network', 'contact_network_team'],
      account_locked: ['verify_identity', 'unlock_account', 'reset_password'],
      security_incident: ['report_incident', 'change_passwords', 'scan_system'],
      permission_request: ['submit_access_request', 'manager_approval', 'audit_trail'],
      general_inquiry: ['provide_information', 'search_kb', 'escalate_support'],
    };

    return actionMap[intent] || ['general_support'];
  },
};