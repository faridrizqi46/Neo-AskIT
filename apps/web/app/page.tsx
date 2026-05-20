import Link from 'next/link';
import { AppShell } from '../components/layout/AppShell';

export default function HomePage() {
  return (
    <AppShell>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back!</h1>
          <p className="text-slate-500">Your IT support dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Active</span>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">12</p>
            <p className="text-sm text-slate-500">Open Conversations</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">This Week</span>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">48</p>
            <p className="text-sm text-slate-500">Resolved Requests</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">1.2h</p>
            <p className="text-sm text-slate-500">Avg Response Time</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/chat"
                className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/50 group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">New Chat</p>
                  <p className="text-xs text-slate-500">Start conversation</p>
                </div>
              </Link>

              <Link
                href="/requests"
                className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50/50 group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-slate-200 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">My Requests</p>
                  <p className="text-xs text-slate-500">View history</p>
                </div>
              </Link>

              <Link
                href="/chat?intent=password"
                className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition-all duration-200 hover:border-amber-300 hover:bg-amber-50/50 group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Password Reset</p>
                  <p className="text-xs text-slate-500">Get help</p>
                </div>
              </Link>

              <Link
                href="/admin"
                className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50/50 group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-slate-200 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Admin Panel</p>
                  <p className="text-xs text-slate-500">Manage</p>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { time: '2 min ago', action: 'Request resolved', detail: 'VPN access granted', status: 'success' },
                { time: '15 min ago', action: 'New message', detail: 'Password reset request', status: 'info' },
                { time: '1 hour ago', action: 'Request created', detail: 'Software installation', status: 'default' },
                { time: '3 hours ago', action: 'Escalated', detail: 'Network issue - High priority', status: 'warning' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-2">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${
                    item.status === 'success' ? 'bg-emerald-500' :
                    item.status === 'warning' ? 'bg-amber-500' :
                    item.status === 'info' ? 'bg-blue-500' : 'bg-slate-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{item.action}</p>
                    <p className="text-xs text-slate-500 truncate">{item.detail}</p>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-base font-semibold text-slate-900 mb-4">Popular Topics</h2>
          <div className="flex flex-wrap gap-2">
            {[
              'Password Reset', 'VPN Access', 'Software Installation', 
              'Email Setup', 'Network Issues', 'Hardware Request',
              'Account Unlock', 'Printer Setup', 'VPN Configuration'
            ].map((topic) => (
              <Link
                key={topic}
                href={`/chat?topic=${encodeURIComponent(topic)}`}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
              >
                {topic}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}