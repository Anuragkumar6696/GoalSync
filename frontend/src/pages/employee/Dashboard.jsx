import { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  HiOutlineClipboardDocumentList, 
  HiOutlineCheckBadge, 
  HiOutlineClock, 
  HiOutlineChartBar 
} from 'react-icons/hi2';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

const EmployeeDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    averageProgress: 0
  });
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/employee/goals');
        const goalsData = res.data.data;
        setGoals(goalsData);
        
        const approved = goalsData.filter(g => g.approved).length;
        const pending = goalsData.filter(g => !g.approved).length;
        const totalProgress = goalsData.reduce((acc, curr) => acc + (curr.progress || 0), 0);
        
        setStats({
          total: goalsData.length,
          approved,
          pending,
          averageProgress: goalsData.length > 0 ? (totalProgress / goalsData.length).toFixed(1) : 0
        });
      } catch (err) {
        console.error('Error fetching goals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const rejectedGoals = goals.filter(g => !g.approved && g.managerComments);

  const chartData = [
    { name: 'Q1', progress: 45 },
    { name: 'Q2', progress: 70 },
    { name: 'Q3', progress: 0 },
    { name: 'Q4', progress: 0 },
  ];

  const pieData = [
    { name: 'Approved', value: stats.approved },
    { name: 'Pending', value: stats.pending },
  ];

  const COLORS = ['#22c55e', '#f59e0b'];

  if (loading) return <div className="flex justify-center py-20 animate-pulse text-slate-400">Loading Dashboard...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Employee Dashboard</h1>
          <p className="text-slate-500 mt-1">Track your performance and goals for the current quarter.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600">
            FY 2026-27
          </div>
          <div className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-bold">
            Quarter 1
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Goals', value: stats.total, icon: HiOutlineClipboardDocumentList, color: 'primary' },
          { label: 'Approved', value: stats.approved, icon: HiOutlineCheckBadge, color: 'success' },
          { label: 'Pending', value: stats.pending, icon: HiOutlineClock, color: 'warning' },
          { label: 'Avg. Progress', value: `${stats.averageProgress}%`, icon: HiOutlineChartBar, color: 'secondary' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-${stat.color}/10 text-${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {rejectedGoals.length > 0 && (
        <div className="bg-danger/5 border border-danger/20 rounded-3xl p-6 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-danger/10 text-danger rounded-xl">
              <HiOutlineClipboardDocumentList className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-danger">Rejection Feedback</h3>
          </div>
          <div className="space-y-4">
            {rejectedGoals.map(goal => (
              <div key={goal._id} className="bg-white p-4 rounded-2xl border border-danger/10 shadow-sm">
                <p className="font-bold text-slate-900">{goal.goalTitle}</p>
                <div className="mt-2 p-3 bg-slate-50 rounded-xl text-sm text-slate-600 border-l-4 border-danger italic">
                  "{goal.managerComments}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Quarterly Progress</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="progress" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Approval Status</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {pieData.map((entry, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                <span className="text-sm text-slate-500">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Goals Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Recent Goals</h3>
          <button className="text-primary text-sm font-bold hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Goal Title</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Target</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {goals.slice(0, 5).map((goal) => (
                <tr key={goal._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{goal.title}</p>
                    <p className="text-xs text-slate-500">{goal.thrustArea}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{goal.target} {goal.uom}</td>
                  <td className="px-6 py-4">
                    <div className="w-full bg-slate-100 rounded-full h-2 max-w-[120px]">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-slate-500 mt-1 block">{goal.progress}%</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      goal.status === 'Approved' ? 'bg-success/10 text-success' : 
                      goal.status === 'Rejected' ? 'bg-danger/10 text-danger' : 
                      'bg-warning/10 text-warning'
                    }`}>
                      {goal.status}
                    </span>
                  </td>
                </tr>
              ))}
              {goals.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-slate-400 italic">No goals found. Create your first goal!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
