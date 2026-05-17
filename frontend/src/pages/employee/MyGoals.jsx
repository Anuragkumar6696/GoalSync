import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { 
  HiOutlineEllipsisVertical, 
  HiOutlineDocumentMagnifyingGlass, 
  HiOutlineTrash,
  HiOutlineXMark,
  HiOutlineInformationCircle,
  HiOutlineArrowTrendingUp,
  HiOutlineCalendar
} from 'react-icons/hi2';

const MyGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        console.log('Fetching goals...');
        const res = await api.get('/employee/goals');
        console.log('Goals received:', res.data);
        setGoals(res.data.data);
      } catch (err) {
        console.error('Error fetching goals:', err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, []);

  const getUOMDisplay = (uom) => {
    const map = {
      'Percentage_Min': '%',
      'Percentage_Max': '%',
      'Timeline': 'Days',
      'Numeric_Min': 'Count',
      'Numeric_Max': 'Count',
      'Zero': 'Policy'
    };
    return map[uom] || uom;
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;

    try {
      await api.delete(`/employee/goals/${id}`);
      setGoals(goals.filter(g => g._id !== id));
    } catch (err) {
      console.error('Delete failed:', err.response?.data || err);
      alert(err.response?.data?.message || 'Failed to delete goal');
    }
  };

  if (loading) return <div className="animate-pulse text-slate-400 text-center py-20 font-medium">Loading your goals...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Goals</h1>
        <p className="text-slate-500 mt-1">Review your targets, progress, and approval status.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Goal Details</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Target & Achievement</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Weightage</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {goals.map((goal) => (
                <tr key={goal._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <p className="font-bold text-slate-900 text-base">{goal.goalTitle || goal.title}</p>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-medium uppercase tracking-tight">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                      {goal.thrustArea}
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-slate-700">Target: <span className="text-slate-900">{goal.target} {getUOMDisplay(goal.unitOfMeasurement || goal.uom)}</span></p>
                      <p className="text-sm text-slate-500">Achieved: <span className="font-bold text-slate-900">{goal.achievement || 0} {getUOMDisplay(goal.unitOfMeasurement || goal.uom)}</span></p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg inline-block font-bold text-xs">
                      {goal.weightage}%
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="w-40">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-600">{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-1000 ${
                            goal.progress >= 100 ? 'bg-success' : 'bg-primary'
                          }`}
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                      goal.status === 'Approved' ? 'bg-success/10 text-success' : 
                      goal.status === 'Rejected' ? 'bg-danger/10 text-danger' : 
                      'bg-warning/10 text-warning'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        goal.status === 'Approved' ? 'bg-success' : 
                        goal.status === 'Rejected' ? 'bg-danger' : 
                        'bg-warning'
                      }`}></span>
                      {goal.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right flex items-center justify-end gap-2">
                    <button 
                      onClick={() => setSelectedGoal(goal)}
                      className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-xl transition-all"
                      title="View Details"
                    >
                      <HiOutlineDocumentMagnifyingGlass className="w-5 h-5" />
                    </button>
                    {!goal.locked && (
                      <button 
                        onClick={() => handleDelete(goal._id)}
                        className="p-2 text-slate-400 hover:text-danger hover:bg-danger/10 rounded-xl transition-all"
                        title="Delete Goal"
                      >
                        <HiOutlineTrash className="w-5 h-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {goals.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiOutlineDocumentMagnifyingGlass className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">No goals found.</p>
            <button 
              onClick={() => navigate('/employee/create-goals')}
              className="text-primary font-bold text-sm mt-2 hover:underline"
            >
              Start creating your targets
            </button>
          </div>
        )}
      </div>

      {/* Goal Details Modal */}
      {selectedGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-xl">
                  <HiOutlineInformationCircle className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Goal Details</h2>
              </div>
              <button 
                onClick={() => setSelectedGoal(null)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <HiOutlineXMark className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Goal Title</p>
                    <p className="text-lg font-bold text-slate-900 leading-tight">{selectedGoal.goalTitle || selectedGoal.title}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Description</p>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">{selectedGoal.description}</p>
                  </div>
                </div>

                <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Thrust Area</span>
                    <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase text-primary tracking-wider">
                      {selectedGoal.thrustArea}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Quarter</span>
                    <div className="flex items-center gap-1.5 text-slate-700 font-bold text-sm">
                      <HiOutlineCalendar className="w-4 h-4 text-slate-400" />
                      {selectedGoal.quarter}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Weightage</span>
                    <span className="text-slate-900 font-black text-sm">{selectedGoal.weightage}%</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Target</p>
                  <p className="text-xl font-black text-slate-900">
                    {selectedGoal.target} <span className="text-xs text-slate-500 font-bold uppercase ml-1">{getUOMDisplay(selectedGoal.unitOfMeasurement || selectedGoal.uom)}</span>
                  </p>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Achievement</p>
                  <p className="text-xl font-black text-success">
                    {selectedGoal.achievement || 0} <span className="text-xs text-slate-500 font-bold uppercase ml-1">{getUOMDisplay(selectedGoal.unitOfMeasurement || selectedGoal.uom)}</span>
                  </p>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Progress</p>
                  <div className="flex items-center gap-2">
                    <HiOutlineArrowTrendingUp className="w-5 h-5 text-primary" />
                    <p className="text-xl font-black text-primary">{selectedGoal.progress}%</p>
                  </div>
                </div>
              </div>

              {selectedGoal.managerComments && (
                <div className="p-6 bg-danger/5 border border-danger/20 rounded-2xl">
                  <p className="text-[10px] font-bold text-danger uppercase mb-2">Manager Feedback</p>
                  <p className="text-sm text-danger font-medium italic">"{selectedGoal.managerComments}"</p>
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setSelectedGoal(null)}
                className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition-all shadow-sm"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyGoals;
