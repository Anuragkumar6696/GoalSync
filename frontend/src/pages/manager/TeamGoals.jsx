import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { HiOutlineUser, HiOutlineChartBar, HiOutlineCheckCircle } from 'react-icons/hi2';

const TeamGoals = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeamGoals = async () => {
      try {
        const res = await api.get('/manager/team-goals');
        setTeam(res.data.data);
      } catch (err) {
        console.error('Error fetching team goals');
      } finally {
        setLoading(false);
      }
    };
    fetchTeamGoals();
  }, []);

  if (loading) return <div className="text-center py-20 text-slate-400 font-medium tracking-wide animate-pulse">Loading Team Performance...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Team Goals</h1>
        <p className="text-slate-500 mt-2">Monitor and manage your team's goal progress and performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {team.map((member) => (
          <div key={member._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all p-6 group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                {member.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors">{member.name}</h3>
                <p className="text-xs text-slate-400 font-medium">{member.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Overall Progress</p>
                  <p className="text-2xl font-black text-slate-900">{member.averageProgress}%</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Active Goals</p>
                  <p className="text-lg font-bold text-slate-700">{member.goalsCount}</p>
                </div>
              </div>

              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-1000" 
                  style={{ width: `${member.averageProgress}%` }}
                />
              </div>

              <button 
                onClick={() => navigate(`/manager/team-goals/${member._id}`)}
                className="w-full mt-4 py-3 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <HiOutlineChartBar className="w-4 h-4" />
                View Detailed Analytics
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamGoals;
