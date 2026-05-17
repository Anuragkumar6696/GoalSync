import { useState, useEffect } from 'react';
import api from '../../services/api';
import { HiOutlineCheckCircle, HiOutlineArrowPath } from 'react-icons/hi2';

const QuarterlyUpdates = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await api.get('/employee/goals');
        setGoals(res.data.data.filter(g => g.status === 'Approved'));
      } catch (err) {
        console.error('Error fetching goals');
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, []);

  const handleUpdate = async (goalId, achievement, status) => {
    setUpdating(goalId);
    try {
      await api.patch(`/employee/goals/${goalId}`, { achievement, progressStatus: status });
      // Update local state
      setGoals(goals.map(g => 
        g._id === goalId ? { ...g, achievement, progressStatus: status, progress: (achievement / g.target) * 100 } : g
      ));
    } catch (err) {
      console.error('Update failed');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-400 font-medium animate-pulse">Loading approved goals...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Quarterly Updates</h1>
        <p className="text-slate-500 mt-1">Update your progress and achievements for the current quarter.</p>
      </div>

      {goals.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
          <p className="text-slate-500 font-medium">No approved goals available for update.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => (
            <div key={goal._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{goal.title}</h3>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mt-1">{goal.thrustArea}</p>
                </div>
                <div className="px-3 py-1 bg-primary/5 text-primary rounded-lg font-bold text-xs">
                  {goal.weightage}% Weight
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1">Target</p>
                  <p className="text-xl font-bold text-slate-900">{goal.target} <span className="text-sm font-medium text-slate-400">{goal.uom}</span></p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1">Achieved</p>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number"
                      defaultValue={goal.achievement}
                      onBlur={(e) => handleUpdate(goal._id, e.target.value, goal.progressStatus)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none font-bold text-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-slate-500 font-bold uppercase">Current Status</p>
                <div className="grid grid-cols-3 gap-2">
                  {['Not Started', 'On Track', 'Completed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleUpdate(goal._id, goal.achievement, status)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                        goal.progressStatus === status 
                          ? 'bg-primary border-primary text-white shadow-md shadow-primary/20' 
                          : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">Progress</span>
                  <span className="text-sm font-bold text-primary">{Math.round(goal.progress)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-700 ease-out"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>

              {updating === goal._id && (
                <div className="flex items-center gap-2 text-xs font-bold text-primary animate-pulse justify-center">
                  <HiOutlineArrowPath className="w-4 h-4 animate-spin" />
                  Saving Changes...
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuarterlyUpdates;
