import { useState, useEffect } from 'react';
import api from '../../services/api';
import { HiOutlineUser, HiOutlineEnvelope, HiOutlineShieldCheck, HiOutlineUserPlus } from 'react-icons/hi2';

const Users = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/employees');
        setEmployees(res.data.data);
      } catch (err) {
        console.error('Error fetching users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div className="text-center py-20 text-slate-400 font-medium">Loading User Directory...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500 mt-2">Manage platform access and review employee roles.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
          <HiOutlineUserPlus className="w-5 h-5" />
          Add New User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((emp) => (
          <div key={emp._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-primary font-bold text-xl">
                {emp.name.charAt(0)}
              </div>
              <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-lg tracking-wider">
                {emp.role}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">{emp.name}</h3>
                <div className="flex items-center gap-2 text-slate-400 mt-1">
                  <HiOutlineEnvelope className="w-4 h-4" />
                  <span className="text-xs font-medium">{emp.email}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Reports To</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                    {emp.manager?.name?.charAt(0) || '?'}
                  </div>
                  <span className="text-sm font-bold text-slate-700">{emp.manager?.name || 'Unassigned'}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button className="flex-1 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-all">
                  Edit Profile
                </button>
                <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-danger hover:bg-danger/5 transition-all">
                  <HiOutlineShieldCheck className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
