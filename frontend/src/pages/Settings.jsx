import { useAuth } from '../context/AuthContext';
import { HiOutlineUser, HiOutlineShieldCheck, HiOutlineBell, HiOutlinePaintBrush } from 'react-icons/hi2';

const Settings = () => {
  const { user } = useAuth();

  const sections = [
    {
      title: 'Profile Information',
      icon: HiOutlineUser,
      fields: [
        { label: 'Full Name', value: user?.name },
        { label: 'Email Address', value: user?.email },
        { label: 'Role', value: user?.role, capitalize: true },
      ]
    },
    {
      title: 'Security',
      icon: HiOutlineShieldCheck,
      description: 'Manage your password and security settings.'
    },
    {
      title: 'Notifications',
      icon: HiOutlineBell,
      description: 'Configure how you receive alerts and updates.'
    },
    {
      title: 'Appearance',
      icon: HiOutlinePaintBrush,
      description: 'Customize the look and feel of your portal.'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-2">Manage your account preferences and portal settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <div key={section.title} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                <section.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{section.title}</h3>
            </div>

            {section.fields ? (
              <div className="space-y-4">
                {section.fields.map((field) => (
                  <div key={field.label}>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{field.label}</p>
                    <p className={`mt-1 text-slate-700 font-medium ${field.capitalize ? 'capitalize' : ''}`}>
                      {field.value}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <p className="text-sm text-slate-500 leading-relaxed">{section.description}</p>
                <button className="mt-6 px-6 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all">
                  Configure
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
