'use client';

import React from 'react';
import { AppShell } from '../layout/AppShell';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: {
    name: string;
    email: string;
    role?: string;
  };
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  return <AppShell user={user}>{children}</AppShell>;
}