import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { 
  HiOutlineUser, 
  HiOutlineArrowLeft, 
  HiOutlineChartPie, 
  HiOutlineArrowTrendingUp,
  HiOutlineCheckCircle
} from 'react-icons/hi2';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const DetailedAnalytics = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        let member;
        if (user?.role === 'admin') {
          const res = await api.get(`/admin/employees/${id}/analytics`);
          member = res.data.data;
        } else {
          // We use the existing team-goals endpoint but filter for this user
          const res = await api.get('/manager/team-goals');
          member = res.data.data.find(m => m._id === id);
        }
        setData(member);
      } catch (err) {
        console.error('Error fetching analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, user]);

  if (loading) return <div className="text-center py-20 text-slate-400 font-medium animate-pulse">Analyzing Performance Data...</div>;
  if (!data) return <div className="text-center py-20 text-danger font-bold">Employee not found.</div>;

  const COLORS = ['#3b82f6', '#22c55e', '#eab308', '#ef4444'];

  const pieData = [
    { name: 'Completed', value: data.goals.filter(g => g.progress >= 100).length },
    { name: 'In Progress', value: data.goals.filter(g => g.progress > 0 && g.progress < 100).length },
    { name: 'Not Started', value: data.goals.filter(g => g.progress === 0).length },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-100 rounded-xl transition-all"
        >
          <HiOutlineArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{data.name}'s Analytics</h1>
          <p className="text-slate-500">Deep dive into individual goal performance and metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-3xl bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold mb-4">
              {data.name.charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-slate-900">{data.name}</h3>
            <p className="text-sm text-slate-400 font-medium mb-6">{data.email}</p>
            
            <div className="grid grid-cols-2 gap-4 w-full pt-6 border-t border-slate-50">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Goals</p>
                <p className="text-xl font-black text-slate-900">{data.goalsCount}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Avg. Progress</p>
                <p className="text-xl font-black text-primary">{data.averageProgress}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="lg:col-span-1 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <HiOutlineChartPie className="w-5 h-5 text-primary" />
            Goal Distribution
          </h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
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
          <div className="flex justify-center gap-4 mt-4">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Overview */}
        <div className="lg:col-span-1 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <HiOutlineArrowTrendingUp className="w-5 h-5 text-success" />
            Goal Progress (%)
          </h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.goals}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="goalTitle" hide />
                <YAxis hide domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="progress" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-center text-slate-400 font-bold uppercase mt-4">Progress by Goal Title</p>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Detailed Performance Table</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Goal Title</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Weightage</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Progress</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Target</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.goals.map((goal) => (
                <tr key={goal._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900">{goal.goalTitle}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{goal.thrustArea}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-600">{goal.weightage}%</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full max-w-[80px] overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${goal.progress}%` }} />
                      </div>
                      <span className="text-sm font-black text-slate-900">{goal.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-700">{goal.target} {goal.unitOfMeasurement}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {goal.progress >= 100 ? (
                      <span className="text-success font-black text-[10px] uppercase tracking-widest">Completed</span>
                    ) : (
                      <span className="text-warning font-black text-[10px] uppercase tracking-widest">Active</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DetailedAnalytics;
