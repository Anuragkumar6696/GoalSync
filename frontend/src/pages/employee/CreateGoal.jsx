import { useState, useEffect } from 'react';
import api from '../../services/api';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineExclamationTriangle } from 'react-icons/hi2';

const CreateGoal = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    thrustArea: '',
    title: '',
    description: '',
    uom: '',
    target: '',
    weightage: 10,
    quarter: 'Q1'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingGoalsCount, setExistingGoalsCount] = useState(0);

  useEffect(() => {
    const fetchExistingGoals = async () => {
      try {
        const res = await api.get('/employee/goals');
        setExistingGoalsCount(res.data.data.length);
      } catch (err) {
        console.error('Error fetching existing goals');
      }
    };
    fetchExistingGoals();
  }, []);

  const totalWeightage = goals.reduce((acc, g) => acc + Number(g.weightage), 0) + Number(newGoal.weightage);

  const addGoalToDraft = (e) => {
    e.preventDefault();
    if (existingGoalsCount + goals.length >= 8) {
      setError('Maximum limit of 8 goals reached');
      return;
    }
    if (totalWeightage > 100) {
      setError('Total weightage cannot exceed 100%');
      return;
    }

    // Map UOM from UI to Backend values
    const uomMap = {
      '%': 'Percentage_Min',
      'Days': 'Timeline',
      'Count': 'Numeric_Min',
      'Numeric_Max': 'Numeric_Max',
      'Zero': 'Zero'
    };

    setGoals([...goals, { 
      ...newGoal, 
      id: Date.now(),
      goalTitle: newGoal.title, // Map title to goalTitle for backend
      unitOfMeasurement: uomMap[newGoal.uom] || 'Numeric_Min' // Map uom to unitOfMeasurement
    }]);
    setNewGoal({
      thrustArea: '',
      title: '',
      description: '',
      uom: '',
      target: '',
      weightage: 10,
      quarter: 'Q1'
    });
    setError('');
  };

  const removeGoal = (id) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const submitGoals = async () => {
    setLoading(true);
    try {
      // Prepare goals for backend by removing frontend-only fields and ensuring correct types
      const goalsToSubmit = goals.map(g => ({
        thrustArea: g.thrustArea,
        goalTitle: g.goalTitle,
        description: g.description,
        unitOfMeasurement: g.unitOfMeasurement,
        target: Number(g.target),
        weightage: Number(g.weightage),
        quarter: g.quarter
      }));

      console.log('Submitting goals:', goalsToSubmit);
      await api.post('/employee/goals', { goals: goalsToSubmit });
      setSuccess('Goals created successfully!');
      setGoals([]);
      setExistingGoalsCount(prev => prev + goalsToSubmit.length);
    } catch (err) {
      console.error('Submission error:', err.response?.data || err);
      setError(err.response?.data?.message || 'Failed to submit goals');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Create Goals</h1>
        <p className="text-slate-500 mt-1">Define your performance targets and weightage.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
        <div className="mb-6 p-4 bg-primary/5 rounded-2xl border border-primary/10">
          <p className="text-sm text-primary font-bold flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-[10px]">1</span>
            Step 1: Fill the details and click "Add to List" for each goal.
          </p>
          <p className="text-sm text-primary font-bold flex items-center gap-2 mt-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-white text-[10px]">2</span>
            Step 2: Click "Create Goals Now" to save them to your profile.
          </p>
        </div>
        <form onSubmit={addGoalToDraft} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Thrust Area</label>
              <select 
                required
                value={newGoal.thrustArea}
                onChange={(e) => setNewGoal({...newGoal, thrustArea: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="">Select Area</option>
                <option value="Operational Excellence">Operational Excellence</option>
                <option value="Customer Satisfaction">Customer Satisfaction</option>
                <option value="Innovation">Innovation</option>
                <option value="People & Culture">People & Culture</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Goal Title</label>
              <input 
                type="text" required placeholder="e.g. Reduce server downtime"
                value={newGoal.title}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-slate-700">Description</label>
              <textarea 
                required placeholder="Provide details about the goal..."
                value={newGoal.description}
                onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none h-24 resize-none"
              ></textarea>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Unit of Measurement (UOM)</label>
              <select 
                required
                value={newGoal.uom}
                onChange={(e) => setNewGoal({...newGoal, uom: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="">Select UOM</option>
                <option value="%">Percentage (%)</option>
                <option value="Days">Timeline (Days)</option>
                <option value="Count">Numeric (Count)</option>
                <option value="Numeric_Max">Numeric Max</option>
                <option value="Zero">Zero Policy</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Target</label>
              <input 
                type="number" required placeholder="Target value"
                value={newGoal.target}
                onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Weightage (%)</label>
              <input 
                type="number" min="1" max="100" required
                value={newGoal.weightage}
                onChange={(e) => setNewGoal({...newGoal, weightage: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Quarter</label>
              <select 
                value={newGoal.quarter}
                onChange={(e) => setNewGoal({...newGoal, quarter: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="Q1">Quarter 1</option>
                <option value="Q2">Quarter 2</option>
                <option value="Q3">Quarter 3</option>
                <option value="Q4">Quarter 4</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit"
              className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <HiOutlinePlus className="w-5 h-5" />
              Add to List
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="p-4 bg-danger/10 border border-danger/20 text-danger rounded-2xl flex items-center gap-3">
          <HiOutlineExclamationTriangle className="w-5 h-5" />
          <span className="text-sm font-bold">{error}</span>
        </div>
      )}

      {success && (
        <div className="p-6 bg-success/10 border border-success/20 text-success rounded-2xl flex flex-col items-center gap-4 animate-in zoom-in duration-300">
          <p className="text-lg font-bold">{success}</p>
          <a href="/employee/my-goals" className="px-6 py-2 bg-success text-white rounded-xl font-bold hover:bg-success-dark transition-all">
            View My Goals
          </a>
        </div>
      )}

      {/* Goals Preview Table */}
      {goals.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Goal List ({goals.length}/8)</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 font-medium">Total Weightage:</span>
              <span className={`text-lg font-bold ${goals.reduce((acc, g) => acc + Number(g.weightage), 0) === 100 ? 'text-success' : 'text-primary'}`}>
                {goals.reduce((acc, g) => acc + Number(g.weightage), 0)}%
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Goal</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Target</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Weightage</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {goals.map((g) => (
                  <tr key={g.id}>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{g.title}</p>
                      <p className="text-xs text-slate-500">{g.thrustArea}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{g.target} {g.uom}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{g.weightage}%</td>
                    <td className="px-6 py-4">
                      <button onClick={() => removeGoal(g.id)} className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors">
                        <HiOutlineTrash className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-slate-50 flex flex-col items-center gap-4">
            <button 
              onClick={submitGoals}
              disabled={loading || goals.length === 0}
              className="w-full md:w-auto px-20 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Goals Now'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateGoal;
