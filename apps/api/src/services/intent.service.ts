import { sessionRepo } from '../repositories/session.repo';
import { aiService } from './ai.service';

export const intentService = {
  async classify(text: string, history?: string[]): Promise<{ intent: string; confidence: number; entities: Record<string, string> }> {
    return aiService.classifyIntent(text, history);
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