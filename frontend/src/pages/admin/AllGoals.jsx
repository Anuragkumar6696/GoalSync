import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { 
  HiOutlineLockOpen, 
  HiOutlineCheckCircle, 
  HiOutlineClock, 
  HiOutlineMagnifyingGlass,
  HiOutlineChartBar
} from 'react-icons/hi2';

const AllGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllGoals = async () => {
      try {
        const res = await api.get('/admin/goals');
        setGoals(res.data.data);
      } catch (err) {
        console.error('Error fetching all goals');
      } finally {
        setLoading(false);
      }
    };
    fetchAllGoals();
  }, []);

  const handleUnlock = async (id) => {
    if (!window.confirm('Are you sure you want to unlock this goal? The employee will be able to edit it again.')) return;
    
    try {
      await api.put(`/admin/goals/${id}/unlock`);
      setGoals(goals.map(g => g._id === id ? { ...g, locked: false } : g));
      alert('Goal unlocked successfully');
    } catch (err) {
      console.error('Unlock failed');
    }
  };

  const filteredGoals = goals.filter(goal => 
    goal.goalTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    goal.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-20 text-slate-400 font-medium">Scanning Organizational Goals...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Organizational Goals</h1>
          <p className="text-slate-500 mt-2">Oversee and manage all employee goals across the company.</p>
        </div>
        
        <div className="relative">
          <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search goals or employees..."
            className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl w-full md:w-80 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Goal Title</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredGoals.map((goal) => (
                <tr key={goal._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900">{goal.employee?.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{goal.employee?.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-700">{goal.goalTitle}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{goal.thrustArea}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full max-w-[100px] overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${goal.progress}%` }} />
                      </div>
                      <span className="text-sm font-bold text-slate-900">{goal.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {goal.locked ? (
                      <span className="flex items-center gap-1.5 text-success font-bold text-xs">
                        <HiOutlineCheckCircle className="w-4 h-4" />
                        Locked
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-warning font-bold text-xs">
                        <HiOutlineClock className="w-4 h-4" />
                        Unlocked
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => navigate(`/admin/all-goals/${goal.employee?._id}`)}
                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                        title="View Analytics"
                      >
                        <HiOutlineChartBar className="w-5 h-5" />
                      </button>
                      {goal.locked && (
                        <button 
                          onClick={() => handleUnlock(goal._id)}
                          className="p-2 text-slate-400 hover:text-warning hover:bg-warning/10 rounded-xl transition-all"
                          title="Unlock Goal"
                        >
                          <HiOutlineLockOpen className="w-5 h-5" />
                        </button>
                      )}
                    </div>
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

export default AllGoals;
