# AskIT User Test Cases

## 1. Authentication

### TC-AUTH-001: User Login
- **Description**: Employee logs in with valid credentials
- **Pre-condition**: User has registered account
- **Steps**:
  1. Navigate to login page
  2. Enter email and password
  3. Click login button
- **Expected Result**: User redirected to dashboard, JWT token stored

### TC-AUTH-002: User Login with Invalid Credentials
- **Description**: Employee fails login with wrong password
- **Pre-condition**: User has registered account
- **Steps**:
  1. Navigate to login page
  2. Enter email and wrong password
  3. Click login button
- **Expected Result**: Error message displayed, no redirect

### TC-AUTH-003: User Logout
- **Description**: Employee logs out successfully
- **Pre-condition**: User is logged in
- **Steps**:
  1. Click logout button
- **Expected Result**: Session cleared, redirected to login page

### TC-AUTH-004: Access Protected Route Without Auth
- **Description**: Unauthenticated user tries to access dashboard
- **Pre-condition**: No active session
- **Steps**:
  1. Navigate directly to dashboard URL
- **Expected Result**: Redirected to login page

---

## 2. Chat Functionality

### TC-CHAT-001: Send Message and Receive Response
- **Description**: Employee sends a message and receives AI response
- **Pre-condition**: User is logged in
- **Steps**:
  1. Navigate to chat page
  2. Type "I need to reset my password"
  3. Send message
- **Expected Result**: Message appears in chat, AI responds with intent classification

### TC-CHAT-002: Intent Classification - Password Reset
- **Description**: System correctly identifies password reset intent
- **Pre-condition**: User is logged in
- **Steps**:
  1. Navigate to chat page
  2. Send "I forgot my password"
- **Expected Result**: Intent classified as `password_reset` with confidence >0.85

### TC-CHAT-003: Intent Classification - Email Access Issue
- **Description**: System correctly identifies email access intent
- **Pre-condition**: User is logged in
- **Steps**:
  1. Navigate to chat page
  2. Send "I can't access my email"
- **Expected Result**: Intent classified as `email_access` with confidence >0.80

### TC-CHAT-004: Chat History Persistence
- **Description**: Messages are saved and retrieved correctly
- **Pre-condition**: User has previous chat messages
- **Steps**:
  1. Log in
  2. Navigate to chat page
- **Expected Result**: Previous messages displayed in chat history

### TC-CHAT-005: Low Confidence Intent - Escalation
- **Description**: System escalates when intent confidence is low
- **Pre-condition**: User is logged in
- **Steps**:
  1. Navigate to chat page
  2. Send ambiguous or unclear request
- **Expected Result**: Ticket created, user informed about escalation

---

## 3. Request Management

### TC-REQ-001: Create Request via Chat
- **Description**: Request is automatically created when intent matches
- **Pre-condition**: User is logged in, sends message with identifiable intent
- **Steps**:
  1. Navigate to chat page
  2. Send "My laptop is not working"
- **Expected Result**: Request created with `laptop_issue` intent, status "open"

### TC-REQ-002: View Own Requests
- **Description**: Employee views list of their own requests
- **Pre-condition**: User has created requests
- **Steps**:
  1. Navigate to requests page
- **Expected Result**: List of user's requests displayed with status

### TC-REQ-003: View Request Details
- **Description**: Employee views details of specific request
- **Pre-condition**: User has existing request
- **Steps**:
  1. Navigate to requests page
  2. Click on a request
- **Expected Result**: Request details displayed with messages and status

### TC-REQ-004: Update Request Status (IT Staff)
- **Description**: IT staff updates request status
- **Pre-condition**: IT staff is logged in, has existing request
- **Steps**:
  1. Navigate to request details
  2. Change status to "in_progress"
- **Expected Result**: Status updated, timestamp recorded

### TC-REQ-005: Add Resolution to Request
- **Description**: IT staff marks request as resolved
- **Pre-condition**: IT staff is logged in, request is in_progress
- **Steps**:
  1. Navigate to request details
  2. Add resolution text
  3. Change status to "resolved"
- **Expected Result**: Resolution saved, resolved_at timestamp set

---

## 4. Policy Knowledge Base

### TC-POL-001: View Policies
- **Description**: User views list of active policies
- **Pre-condition**: User is logged in
- **Steps**:
  1. Navigate to policies page
- **Expected Result**: List of active policies displayed

### TC-POL-002: Search Policies
- **Description**: User searches policies using keywords
- **Pre-condition**: User is logged in, policies exist
- **Steps**:
  1. Navigate to policies page
  2. Enter search keyword
  3. Submit search
- **Expected Result**: Relevant policies returned based on semantic search

### TC-POL-003: Policy Displayed in Chat Context
- **Description**: Relevant policies surface during chat
- **Pre-condition**: User is logged in, policies exist
- **Steps**:
  1. Navigate to chat page
  2. Send message matching a policy topic
- **Expected Result**: Response includes relevant policy information

---

## 5. Admin Functions

### TC-ADMIN-001: View Admin Dashboard
- **Description**: Admin views dashboard with metrics
- **Pre-condition**: Admin is logged in
- **Steps**:
  1. Navigate to admin dashboard
- **Expected Result**: Overview metrics displayed (response times, top intents, resolutions)

### TC-ADMIN-002: Manage Employees
- **Description**: Admin creates/updates employee records
- **Pre-condition**: Admin is logged in
- **Steps**:
  1. Navigate to admin employees
  2. Create new employee or update existing
- **Expected Result**: Employee record created/updated successfully

### TC-ADMIN-003: Create Policy (Admin)
- **Description**: Admin creates new policy
- **Pre-condition**: Admin is logged in
- **Steps**:
  1. Navigate to policies admin
  2. Create new policy with title, content, category, keywords
- **Expected Result**: Policy created with version 1, is_active=true

### TC-ADMIN-004: Update Policy (Admin)
- **Description**: Admin updates existing policy
- **Pre-condition**: Admin is logged in, policy exists
- **Steps**:
  1. Navigate to policy edit
  2. Update content
  3. Save
- **Expected Result**: Policy version incremented, updated_at timestamp set

### TC-ADMIN-005: View Analytics
- **Description**: Admin views system analytics
- **Pre-condition**: Admin is logged in
- **Steps**:
  1. Navigate to admin analytics
- **Expected Result**: Metrics displayed (intent accuracy, resolution rates, response times)

---

## 6. Session Management

### TC-SESS-001: Session Expiry
- **Description**: Session expires after configured time
- **Pre-condition**: User is logged in, session expires
- **Steps**:
  1. Wait for session to expire (or set short TTL for testing)
  2. Attempt to send message
- **Expected Result**: Redirected to login, error message shown

### TC-SESS-002: Concurrent Session Handling
- **Description**: User logged in from multiple devices
- **Pre-condition**: User has active session
- **Steps**:
  1. Log in from second device
- **Expected Result**: Both sessions active, context shared

---

## 7. Error Handling

### TC-ERR-001: Network Error During Chat
- **Description**: Chat fails due to network issues
- **Pre-condition**: User is logged in
- **Steps**:
  1. Send message
  2. Simulate network failure
- **Expected Result**: Error message displayed, retry option shown

### TC-ERR-002: Invalid API Response
- **Description**: API returns malformed response
- **Pre-condition**: User is logged in
- **Steps**:
  1. Send message
- **Expected Result**: Graceful error handling, user not exposed to raw errors

### TC-ERR-003: Database Connection Failure
- **Description**: Database becomes unavailable
- **Pre-condition**: System is running
- **Steps**:
  1. Simulate DB failure
  2. Attempt user login
- **Expected Result**: Service error page, no data exposure

---

## 8. Security

### TC-SEC-001: JWT Token Validation
- **Description**: System validates JWT on each request
- **Pre-condition**: User has valid JWT
- **Steps**:
  1. Make API request with valid JWT
- **Expected Result**: Request succeeds

### TC-SEC-002: Invalid JWT Rejection
- **Description**: System rejects invalid/expired JWT
- **Pre-condition**: User has invalid JWT
- **Steps**:
  1. Make API request with tampered JWT
- **Expected Result**: 401 Unauthorized response

### TC-SEC-003: Rate Limiting
- **Description**: Rate limiting enforced on API endpoints
- **Pre-condition**: User is logged in
- **Steps**:
  1. Send excessive requests in short time
- **Expected Result**: 429 Too Many Requests after threshold

---

## 9. User Roles

### TC-ROLE-001: Employee Role Permissions
- **Description**: Employee can only access own data
- **Pre-condition**: Employee is logged in
- **Steps**:
  1. Try to access admin dashboard
  2. Try to view other employee requests
- **Expected Result**: Access denied for admin features, only own data visible

### TC-ROLE-002: IT Support Role Permissions
- **Description**: IT staff can view and manage all requests
- **Pre-condition**: IT support account is logged in
- **Steps**:
  1. View any employee request
  2. Update request status
- **Expected Result**: Full access to request management

### TC-ROLE-003: Admin Role Permissions
- **Description**: Admin has full system access
- **Pre-condition**: Admin is logged in
- **Steps**:
  1. Access all features including admin dashboard
  2. Manage employees, policies, config
- **Expected Result**: Full access granted

---

## 10. AI Integration

### TC-AI-001: High Confidence Response
- **Description**: Direct response for high confidence intent (>0.85)
- **Pre-condition**: User is logged in
- **Steps**:
  1. Send message with clear intent (e.g., "reset password")
- **Expected Result**: Direct response with action, no RAG needed

### TC-AI-002: Medium Confidence - RAG Triggered
- **Description**: RAG pipeline activates for medium confidence (0.60-0.85)
- **Pre-condition**: User is logged in
- **Steps**:
  1. Send message with somewhat ambiguous intent
- **Expected Result**: Policies searched, contextual response generated

### TC-AI-003: Intent with Entities Extraction
- **Description**: Entities extracted from user message
- **Pre-condition**: User is logged in
- **Steps**:
  1. Send "I can't access my email on my laptop"
- **Expected Result**: Intent `email_access`, entities `{ service: "email", device: "laptop" }`

---

*Test Cases Version: 1.0*
*Created: 2026-05-20*