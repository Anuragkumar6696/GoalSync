import { useState, useEffect } from 'react';
import api from '../../services/api';
import { HiOutlineDocumentArrowDown, HiOutlineChartBar, HiOutlineTableCells } from 'react-icons/hi2';

const Reports = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        const res = await api.get('/admin/goals');
        setGoals(res.data.data);
      } catch (err) {
        console.error('Error fetching goals for reports');
      } finally {
        setLoading(false);
      }
    };
    fetchReportsData();
  }, []);

  const handleExport = async () => {
    try {
      const response = await api.get('/admin/export-csv', { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `goals-full-report-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed');
      alert('Export failed. Please try again.');
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-400 font-medium tracking-wide animate-pulse">Generating Organizational Reports...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analytics & Reports</h1>
          <p className="text-slate-500 mt-2">Comprehensive data export and organizational performance overview.</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
        >
          <HiOutlineDocumentArrowDown className="w-5 h-5" />
          Download Full CSV Report
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <HiOutlineTableCells className="w-5 h-5 text-primary" />
              Goal Summary Table
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Employee</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Thrust Area</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Progress</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Weightage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {goals.slice(0, 10).map((goal) => (
                  <tr key={goal._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{goal.employee?.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">{goal.thrustArea}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-primary">{goal.progress}%</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-bold">{goal.weightage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <HiOutlineChartBar className="w-5 h-5 text-success" />
              Report Insights
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Records</p>
                <p className="text-2xl font-black text-slate-900">{goals.length}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Average Completion</p>
                <p className="text-2xl font-black text-success">
                  {goals.length > 0 ? Math.round(goals.reduce((acc, g) => acc + (g.progress || 0), 0) / goals.length) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
