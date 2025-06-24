import React, { useState, useEffect } from 'react'
import { 
  FiUsers, 
  FiGlobe, 
  FiMessageSquare, 
  FiTrendingUp,
  FiCalendar,
  FiDollarSign,
  FiAward,
  FiArrowUp,
  FiArrowDown
} from 'react-icons/fi'
import AdminLayout from '../components/AdminLayout'

const Dashboard = ({ onLogout }) => {
  const [stats, setStats] = useState({
    totalStudents: 2567,
    activeConsultations: 45,
    universitiesPartners: 150,
    monthlyRevenue: 125000,
    successRate: 98.5,
    pendingApplications: 23
  })

  const [recentActivities] = useState([
    {
      id: 1,
      type: 'consultation',
      message: 'New consultation request from John Doe',
      time: '2 minutes ago',
      icon: FiMessageSquare,
      color: 'text-blue-600'
    },
    {
      id: 2,
      type: 'application',
      message: 'Application submitted for University of Malaya',
      time: '15 minutes ago',
      icon: FiGlobe,
      color: 'text-green-600'
    },
    {
      id: 3,
      type: 'user',
      message: 'New user registration: Sarah Wilson',
      time: '1 hour ago',
      icon: FiUsers,
      color: 'text-purple-600'
    },
    {
      id: 4,
      type: 'revenue',
      message: 'Payment received: $2,500',
      time: '2 hours ago',
      icon: FiDollarSign,
      color: 'text-emerald-600'
    }
  ])

  const [monthlyData] = useState([
    { month: 'Jan', students: 180, revenue: 95000 },
    { month: 'Feb', students: 210, revenue: 108000 },
    { month: 'Mar', students: 195, revenue: 102000 },
    { month: 'Apr', students: 230, revenue: 125000 },
    { month: 'May', students: 245, revenue: 135000 },
    { month: 'Jun', students: 220, revenue: 118000 },
  ])

  const StatCard = ({ title, value, change, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? <FiArrowUp className="w-4 h-4 mr-1" /> : <FiArrowDown className="w-4 h-4 mr-1" />}
              {change}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )

  return (
    <AdminLayout onLogout={onLogout}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your education consultancy.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Students Placed"
            value={stats.totalStudents.toLocaleString()}
            change="+12% from last month"
            icon={FiUsers}
            color="bg-blue-500"
            trend="up"
          />
          <StatCard
            title="Active Consultations"
            value={stats.activeConsultations}
            change="+5 new today"
            icon={FiMessageSquare}
            color="bg-green-500"
            trend="up"
          />
          <StatCard
            title="Partner Universities"
            value={stats.universitiesPartners}
            change="+3 new partnerships"
            icon={FiGlobe}
            color="bg-purple-500"
            trend="up"
          />
          <StatCard
            title="Monthly Revenue"
            value={`$${stats.monthlyRevenue.toLocaleString()}`}
            change="+8% from last month"
            icon={FiDollarSign}
            color="bg-emerald-500"
            trend="up"
          />
          <StatCard
            title="Success Rate"
            value={`${stats.successRate}%`}
            change="+0.3% improvement"
            icon={FiAward}
            color="bg-yellow-500"
            trend="up"
          />
          <StatCard
            title="Pending Applications"
            value={stats.pendingApplications}
            change="Requires attention"
            icon={FiCalendar}
            color="bg-red-500"
            trend="down"
          />
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Performance Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Performance</h3>
            <div className="space-y-4">
              {monthlyData.map((data, index) => (
                <div key={data.month} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">{data.month}</span>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-900">{data.students} students</div>
                    <div className="text-sm text-green-600">${data.revenue.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full bg-gray-100 ${activity.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <FiUsers className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Add New Student</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <FiGlobe className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Add University</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <FiMessageSquare className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">Schedule Consultation</p>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <FiTrendingUp className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">View Analytics</p>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Dashboard
