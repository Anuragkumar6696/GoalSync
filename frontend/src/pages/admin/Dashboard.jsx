import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { 
  HiOutlineBuildingOffice2, 
  HiOutlineUserGroup, 
  HiOutlineCheckBadge, 
  HiOutlineArrowDownTray 
} from 'react-icons/hi2';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalGoals: 0,
    completionRate: 0,
    activeManagers: 0
  });
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, trendsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/trends')
        ]);
        setStats(statsRes.data.data);
        setTrends(trendsRes.data.data);
      } catch (err) {
        console.error('Error fetching admin data');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const exportReport = async () => {
    try {
      console.log('Initiating export...');
      const response = await api.get('/admin/export-csv', { responseType: 'blob' });
      
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `organizational-goals-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed. Please check backend logs.');
    }
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  if (loading) return <div className="text-center py-20 text-slate-400 font-medium">Loading Organization Overview...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Enterprise-wide goal performance and user management.</p>
        </div>
        <button 
          onClick={exportReport}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
        >
          <HiOutlineArrowDownTray className="w-5 h-5" />
          Export All Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Employees', value: stats.totalUsers, icon: HiOutlineUserGroup, color: 'primary' },
          { label: 'Active Goals', value: stats.totalGoals, icon: HiOutlineBuildingOffice2, color: 'warning' },
          { label: 'Completion Rate', value: `${stats.completionRate}%`, icon: HiOutlineCheckBadge, color: 'success' },
          { label: 'Active Managers', value: stats.activeManagers, icon: HiOutlineUserGroup, color: 'secondary' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
              stat.color === 'primary' ? 'bg-primary/10 text-primary' :
              stat.color === 'secondary' ? 'bg-secondary/10 text-secondary' :
              stat.color === 'success' ? 'bg-success/10 text-success' :
              'bg-warning/10 text-warning'
            }`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Trends Chart */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Goal Completion Trends</h3>
            <p className="text-sm text-slate-500">Quarterly progress tracking across the organization</p>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-xs font-bold text-slate-500 uppercase">Target</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success"></div>
              <span className="text-xs font-bold text-slate-500 uppercase">Achieved</span>
            </div>
          </div>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trends}>
              <defs>
                <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorAchieved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="target" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorTarget)" />
              <Area type="monotone" dataKey="achieved" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorAchieved)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Distribution */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">User Distribution</h3>
          <div className="space-y-6">
            {[
              { role: 'Employees', count: stats.totalUsers - stats.activeManagers, total: stats.totalUsers, color: 'bg-primary' },
              { role: 'Managers', count: stats.activeManagers, total: stats.totalUsers, color: 'bg-secondary' },
              { role: 'HR / Admins', count: 3, total: stats.totalUsers, color: 'bg-success' },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-700">{item.role}</span>
                  <span className="text-sm font-bold text-slate-900">{item.count}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div 
                    className={`${item.color} h-2.5 rounded-full`} 
                    style={{ width: `${(item.count / item.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => navigateTo('/admin/users')}
              className="w-full py-3 bg-primary/5 text-primary rounded-xl text-sm font-bold hover:bg-primary/10 transition-all flex items-center justify-center gap-2"
            >
              <HiOutlineUserGroup className="w-5 h-5" />
              Manage Users
            </button>
            <button 
              onClick={() => navigateTo('/admin/all-goals')}
              className="w-full py-3 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
            >
              <HiOutlineBuildingOffice2 className="w-5 h-5" />
              View All Goals
            </button>
            <button 
              onClick={exportReport}
              className="w-full py-3 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
            >
              <HiOutlineArrowDownTray className="w-5 h-5" />
              Export CSV Report
            </button>
            <button 
              onClick={() => navigateTo('/admin/logs')}
              className="w-full py-3 bg-danger/5 text-danger rounded-xl text-sm font-bold hover:bg-danger/10 transition-all flex items-center justify-center gap-2"
            >
              <HiOutlineCheckBadge className="w-5 h-5" />
              System Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
