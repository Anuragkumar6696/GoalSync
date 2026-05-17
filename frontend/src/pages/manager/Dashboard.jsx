import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { 
  HiOutlineUsers, 
  HiOutlineClipboardDocumentCheck, 
  HiOutlineChatBubbleLeftRight, 
  HiOutlineArrowTrendingUp 
} from 'react-icons/hi2';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalTeam: 0,
    pendingApprovals: 0,
    completedCheckins: 0,
    teamAvgProgress: 0
  });
  const [teamProgress, setTeamProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleReviewNow = () => {
    navigate('/manager/approvals');
  };

  const handleScheduleCheckin = () => {
    alert('Meeting scheduler coming soon! Please use your company calendar for now.');
  };

  useEffect(() => {
    const fetchManagerData = async () => {
      try {
        const [statsRes, teamRes] = await Promise.all([
          api.get('/manager/stats'),
          api.get('/manager/team-goals')
        ]);
        
        setStats(statsRes.data.data);
        
        // Transform team data for chart
        const teamData = teamRes.data.data.map(emp => ({
          name: emp.name.split(' ')[0],
          progress: emp.averageProgress || 0,
          goals: emp.goalsCount || 0
        }));
        setTeamProgress(teamData);
      } catch (err) {
        console.error('Error fetching manager data');
      } finally {
        setLoading(false);
      }
    };
    fetchManagerData();
  }, []);

  if (loading) return <div className="text-center py-20 text-slate-400 font-medium animate-pulse">Loading Team Data...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Manager Dashboard</h1>
        <p className="text-slate-500 mt-1">Oversee your team's performance and manage goal approvals.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Team Size', value: stats.totalTeam, icon: HiOutlineUsers, color: 'primary' },
          { label: 'Pending Approvals', value: stats.pendingApprovals, icon: HiOutlineClipboardDocumentCheck, color: 'warning' },
          { label: 'Check-ins Done', value: stats.completedCheckins, icon: HiOutlineChatBubbleLeftRight, color: 'success' },
          { label: 'Team Progress', value: `${stats.teamAvgProgress}%`, icon: HiOutlineArrowTrendingUp, color: 'secondary' },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Progress Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">Team Progress Overview</h3>
            <button className="text-sm font-bold text-primary hover:underline">View Details</button>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamProgress}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar name="Progress %" dataKey="progress" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={30} />
                <Bar name="Goals Count" dataKey="goals" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Center */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Action Center</h3>
          <div className="space-y-4 flex-1">
            <div className="p-4 bg-warning/5 rounded-2xl border border-warning/10">
              <div className="flex items-center gap-3 mb-2">
                <HiOutlineClipboardDocumentCheck className="w-5 h-5 text-warning" />
                <span className="font-bold text-slate-900 text-sm">Goal Approvals</span>
              </div>
              <p className="text-xs text-slate-500 mb-3">You have {stats.pendingApprovals} goals waiting for your review.</p>
              <button onClick={handleReviewNow} className="w-full py-2 bg-warning text-white rounded-xl text-xs font-bold hover:bg-warning/90 transition-all">Review Now</button>
            </div>

            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <div className="flex items-center gap-3 mb-2">
                <HiOutlineChatBubbleLeftRight className="w-5 h-5 text-primary" />
                <span className="font-bold text-slate-900 text-sm">Team Check-ins</span>
              </div>
              <p className="text-xs text-slate-500 mb-3">Keep your team on track with regular check-ins.</p>
              <button onClick={handleScheduleCheckin} className="w-full py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-dark transition-all">Schedule</button>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-50">
            <p className="text-xs text-slate-400 font-medium text-center italic">"Great leaders empower their teams to reach their full potential."</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
