import { useState, useEffect } from 'react';
import api from '../../services/api';
import { HiOutlineCheck, HiOutlineXMark, HiOutlineChatBubbleLeft } from 'react-icons/hi2';

const Approvals = () => {
  const [pendingGoals, setPendingGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentModal, setCommentModal] = useState({ show: false, goalId: null, comment: '' });

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await api.get('/manager/pending-goals');
        setPendingGoals(res.data.data);
      } catch (err) {
        console.error('Error fetching pending goals');
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, []);

  const handleAction = async (goalId, action, extraData = {}) => {
    try {
      // action will be 'approve' or 'reject'
      await api.put(`/manager/goals/${goalId}/${action}`, extraData);
      setPendingGoals(pendingGoals.filter(g => g._id !== goalId));
      if (commentModal.show) setCommentModal({ show: false, goalId: null, comment: '' });
    } catch (err) {
      console.error('Action failed');
    }
  };

  const handleUpdateInline = async (goalId, field, value) => {
    try {
      await api.put(`/manager/goals/${goalId}`, { [field]: value });
      setPendingGoals(pendingGoals.map(g => g._id === goalId ? { ...g, [field]: value } : g));
    } catch (err) {
      console.error('Update failed');
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-400 font-medium">Loading pending requests...</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Goal Approvals</h1>
        <p className="text-slate-500 mt-1">Review and approve your team's goal submissions.</p>
      </div>

      {pendingGoals.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
          <p className="text-slate-500 font-medium">No pending approvals at the moment.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase">Employee</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase">Goal Details</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase">Target</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase">Weightage</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pendingGoals.map((goal) => (
                  <tr key={goal._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <p className="font-bold text-slate-900">{goal.employee?.name}</p>
                      <p className="text-xs text-slate-400">{goal.employee?.email}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-bold text-slate-900">{goal.goalTitle}</p>
                      <p className="text-xs text-slate-500">{goal.thrustArea}</p>
                    </td>
                    <td className="px-6 py-5">
                      <input 
                        type="number"
                        className="w-20 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-primary"
                        defaultValue={goal.target}
                        onBlur={(e) => handleUpdateInline(goal._id, 'target', e.target.value)}
                      />
                      <span className="ml-1 text-xs text-slate-400">{goal.unitOfMeasurement}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1">
                        <input 
                          type="number"
                          className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-primary"
                          defaultValue={goal.weightage}
                          onBlur={(e) => handleUpdateInline(goal._id, 'weightage', e.target.value)}
                        />
                        <span className="text-xs font-bold text-slate-400">%</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleAction(goal._id, 'approve')}
                          className="p-2 text-success hover:bg-success/10 rounded-xl transition-all"
                          title="Approve"
                        >
                          <HiOutlineCheck className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleAction(goal._id, 'reject')}
                          className="p-2 text-danger hover:bg-danger/10 rounded-xl transition-all"
                          title="Reject"
                        >
                          <HiOutlineXMark className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => setCommentModal({ show: true, goalId: goal._id, comment: '' })}
                          className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-all"
                          title="Add Comment"
                        >
                          <HiOutlineChatBubbleLeft className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {commentModal.show && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Reject Goal Submission</h3>
            <p className="text-slate-500 text-sm mb-6">Please provide a reason for rejecting this goal. This will be shared with the employee.</p>
            
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-700 uppercase">Manager Comments</label>
              <textarea 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-danger/20 focus:border-danger outline-none h-32 resize-none"
                placeholder="Type your feedback here..."
                value={commentModal.comment}
                onChange={(e) => setCommentModal({ ...commentModal, comment: e.target.value })}
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <button 
                onClick={() => setCommentModal({ show: false, goalId: null, comment: '' })}
                className="py-3 px-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleAction(commentModal.goalId, 'reject', { managerComments: commentModal.comment })}
                disabled={!commentModal.comment.trim()}
                className="py-3 px-4 bg-danger text-white rounded-2xl font-bold hover:bg-danger-dark transition-all disabled:opacity-50"
              >
                Reject Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Approvals;
