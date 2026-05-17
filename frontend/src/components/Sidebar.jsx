import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HiOutlineSquares2X2, 
  HiOutlineClipboardDocumentList, 
  HiOutlinePlusCircle, 
  HiOutlineChartBar,
  HiOutlineUsers,
  HiOutlineCheckBadge,
  HiOutlineClock,
  HiOutlineDocumentText,
  HiOutlineCog6Tooth,
  HiOutlineArrowLeftOnRectangle
} from 'react-icons/hi2';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = {
    employee: [
      { name: 'Dashboard', path: '/employee', icon: HiOutlineSquares2X2 },
      { name: 'Create Goals', path: '/employee/create-goals', icon: HiOutlinePlusCircle },
      { name: 'My Goals', path: '/employee/my-goals', icon: HiOutlineClipboardDocumentList },
      { name: 'Quarterly Updates', path: '/employee/updates', icon: HiOutlineClock },
    ],
    manager: [
      { name: 'Dashboard', path: '/manager', icon: HiOutlineSquares2X2 },
      { name: 'Team Goals', path: '/manager/team-goals', icon: HiOutlineUsers },
      { name: 'Approvals', path: '/manager/approvals', icon: HiOutlineCheckBadge },
      { name: 'Check-ins', path: '/manager/check-ins', icon: HiOutlineClock },
    ],
    admin: [
      { name: 'Dashboard', path: '/admin', icon: HiOutlineSquares2X2 },
      { name: 'All Goals', path: '/admin/all-goals', icon: HiOutlineClipboardDocumentList },
      { name: 'Users', path: '/admin/users', icon: HiOutlineUsers },
      { name: 'Audit Logs', path: '/admin/logs', icon: HiOutlineDocumentText },
      { name: 'Reports', path: '/admin/reports', icon: HiOutlineChartBar },
    ],
  };

  const currentMenuItems = menuItems[user?.role] || [];
  const settingsPath = `/${user?.role}/settings`;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col transition-all duration-300">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm">GS</div>
          GoalSync
        </h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {currentMenuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 space-y-1">
        <Link
          to={settingsPath}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
            location.pathname === settingsPath
              ? 'bg-primary/10 text-primary'
              : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
          }`}
        >
          <HiOutlineCog6Tooth className={`w-5 h-5 ${location.pathname === settingsPath ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`} />
          <span className="font-medium">Settings</span>
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-danger hover:bg-danger/5 transition-all group"
        >
          <HiOutlineArrowLeftOnRectangle className="w-5 h-5 text-danger/60 group-hover:text-danger" />
          <span className="font-bold">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
