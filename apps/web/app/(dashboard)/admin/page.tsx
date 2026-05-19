'use client';

import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

interface Analytics {
  totalRequests: number;
  openRequests: number;
  avgResolutionTime: string;
  topIntents: { intent: string; count: number }[];
}

interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  department: string;
  role: string;
}

export default function AdminPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [analyticsData, employeesData] = await Promise.all([
          api<{ data: Analytics }>('/api/v1/admin/analytics'),
          api<{ employees: Employee[] }>('/api/v1/admin/employees'),
        ]);
        setAnalytics(analyticsData.data);
        setEmployees(employeesData.employees || []);
      } catch (error) {
        console.error('Failed to load admin data:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-sm text-muted-foreground">Total Requests</h3>
            <p className="text-3xl font-bold mt-2">{analytics?.totalRequests || 0}</p>
          </div>
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-sm text-muted-foreground">Open Requests</h3>
            <p className="text-3xl font-bold mt-2">{analytics?.openRequests || 0}</p>
          </div>
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-sm text-muted-foreground">Avg Resolution</h3>
            <p className="text-3xl font-bold mt-2">{analytics?.avgResolutionTime || 'N/A'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Top Intents</h2>
            <div className="space-y-3">
              {analytics?.topIntents.map((item) => (
                <div key={item.intent} className="flex justify-between items-center">
                  <span className="text-sm">{item.intent.replace('_', ' ')}</span>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Employees</h2>
            <div className="space-y-3">
              {employees.map((employee) => (
                <div key={employee.id} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{employee.name}</p>
                    <p className="text-xs text-muted-foreground">{employee.email}</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-muted rounded">{employee.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}