import { useState, useEffect } from 'react';
import api from '../../services/api';
import { HiOutlineDocumentText, HiOutlineClock, HiOutlineUser, HiOutlineTag } from 'react-icons/hi2';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/admin/audit-logs');
        setLogs(res.data.data);
      } catch (err) {
        console.error('Error fetching audit logs');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const getActionColor = (action) => {
    const colors = {
      'CREATE': 'text-success bg-success/10',
      'UPDATE': 'text-primary bg-primary/10',
      'DELETE': 'text-danger bg-danger/10',
      'APPROVE': 'text-success bg-success/10',
      'REJECT': 'text-danger bg-danger/10',
      'UNLOCK': 'text-warning bg-warning/10'
    };
    return colors[action] || 'text-slate-500 bg-slate-100';
  };

  if (loading) return <div className="text-center py-20 text-slate-400 font-medium">Retrieving System Audit Trail...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">System Audit Logs</h1>
        <p className="text-slate-500 mt-2">Track all administrative and goal-related activities across the platform.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Action</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Target</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400 font-medium">
                    No audit logs recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                        <HiOutlineClock className="w-4 h-4" />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                          {log.user?.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{log.user?.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{log.user?.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 font-bold">
                        <HiOutlineTag className="w-4 h-4 text-slate-400" />
                        {log.resource}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-500 max-w-xs truncate font-medium">
                        {log.action} operation on {log.resource}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
