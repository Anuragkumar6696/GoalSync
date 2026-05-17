import { useState, useEffect } from 'react';
import api from '../../services/api';
import { HiOutlineChatBubbleLeftRight, HiOutlineUser, HiOutlineCalendar } from 'react-icons/hi2';

const CheckIns = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await api.get('/manager/team-goals');
        setTeam(res.data.data);
      } catch (err) {
        console.error('Error fetching team');
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const handleCheckIn = async (e) => {
    e.preventDefault();
    if (!selectedEmployee || !comment.trim()) return;

    try {
      // Assuming check-in is added to a specific goal, but for now we'll mock the check-in API
      // If we don't have a dedicated check-in endpoint, we might add it to a goal
      const goalToUpdate = selectedEmployee.goals[0]?._id;
      if (!goalToUpdate) {
        alert('Employee has no goals to check-in on');
        return;
      }

      await api.post(`/manager/goals/${goalToUpdate}/checkin`, { comment });
      alert('Check-in feedback submitted successfully!');
      setComment('');
      setSelectedEmployee(null);
    } catch (err) {
      console.error('Check-in failed');
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-400 font-medium tracking-wide animate-pulse">Loading Team Interactions...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Team Check-ins</h1>
        <p className="text-slate-500 mt-2">Provide feedback and maintain continuous dialogue with your team.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-bold text-slate-800 px-2">Select Team Member</h3>
          <div className="space-y-2">
            {team.map((member) => (
              <button
                key={member._id}
                onClick={() => setSelectedEmployee(member)}
                className={`w-full p-4 rounded-2xl border transition-all text-left flex items-center gap-4 ${
                  selectedEmployee?._id === member._id 
                    ? 'bg-primary/5 border-primary text-primary shadow-sm' 
                    : 'bg-white border-slate-100 text-slate-600 hover:border-primary/30'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                  selectedEmployee?._id === member._id ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  {member.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-sm">{member.name}</p>
                  <p className="text-[10px] uppercase font-bold tracking-tighter opacity-60">
                    {member.goalsCount} Active Goals
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedEmployee ? (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 animate-in slide-in-from-right-4">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                  <HiOutlineChatBubbleLeftRight className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Check-in with {selectedEmployee.name}</h3>
                  <p className="text-sm text-slate-500">Provide guidance and feedback on current performance.</p>
                </div>
              </div>

              <form onSubmit={handleCheckIn} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Feedback / Comments</label>
                  <textarea
                    required
                    rows="6"
                    placeholder="Share your thoughts on progress, areas of improvement, or celebrate wins..."
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500">
                    <HiOutlineCalendar className="w-5 h-5" />
                    <span className="text-xs font-bold">Scheduled for: Today</span>
                  </div>
                  <button 
                    type="submit"
                    className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                  >
                    Submit Feedback
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
              <HiOutlineUser className="w-16 h-16 text-slate-200 mb-4" />
              <h3 className="text-lg font-bold text-slate-400">Select a team member to start a check-in</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckIns;
