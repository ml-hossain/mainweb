import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  AcademicCapIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [stats, setStats] = useState({
    universities: 0,
    services: 0,
    pages: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [universities, services, pages, users] = await Promise.all([
        supabase.from('universities').select('id', { count: 'exact' }),
        supabase.from('services').select('id', { count: 'exact' }),
        supabase.from('pages').select('id', { count: 'exact' }),
        supabase.from('admin_users').select('id', { count: 'exact' }),
        ]);

        setStats({
        universities: universities.count || 0,
        services: services.count || 0,
        pages: pages.count || 0,
        users: users.count || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
  };

  const statCards = [
    {
      name: 'Universities',
      value: stats.universities,
      icon: AcademicCapIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Services',
      value: stats.services,
      icon: BriefcaseIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Pages',
      value: stats.pages,
      icon: DocumentTextIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'Users',
      value: stats.users,
      icon: UserGroupIcon,
      color: 'bg-red-500',
    },
  ];

  if (loading) {
    return (
      <div className="animate-pulse">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-md bg-gray-200"></div>
                  <div className="ml-5 w-full">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="mt-2 h-8 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${card.color}`}>
                  <card.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {card.name}
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      {card.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button
            onClick={() => window.location.href = '/admin/universities'}
            className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-4 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <AcademicCapIcon className="mx-auto h-8 w-8 text-gray-400" />
            <span className="mt-2 block text-sm font-medium text-gray-900">
              Add University
            </span>
          </button>
          <button
            onClick={() => window.location.href = '/admin/services'}
            className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-4 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <BriefcaseIcon className="mx-auto h-8 w-8 text-gray-400" />
            <span className="mt-2 block text-sm font-medium text-gray-900">
              Manage Services
            </span>
          </button>
          <button
            onClick={() => window.location.href = '/admin/content/pages'}
            className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-4 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <DocumentTextIcon className="mx-auto h-8 w-8 text-gray-400" />
            <span className="mt-2 block text-sm font-medium text-gray-900">
              Edit Content
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 