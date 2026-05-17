import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineBell, HiOutlineUserCircle, HiOutlineArrowLeftOnRectangle, HiOutlineUser } from 'react-icons/hi2';

const Navbar = () => {
  const { user, logout } = useAuth();

  const profilePath = `/${user?.role}/profile`;

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Welcome back, <span className="text-primary">{user?.name}</span>
        </h2>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
          {user?.role}
        </span>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-400 hover:text-primary transition-colors">
          <HiOutlineBell className="w-6 h-6" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800 leading-none">{user?.name}</p>
            <p className="text-xs text-slate-500 mt-1">{user?.email}</p>
          </div>
          <div className="group relative">
            <button className="flex items-center gap-2">
              <HiOutlineUserCircle className="w-8 h-8 text-slate-400 group-hover:text-primary transition-colors" />
            </button>
            
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 hidden group-hover:block transition-all animate-in fade-in slide-in-from-top-2">
              <Link
                to={profilePath}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
              >
                <HiOutlineUser className="w-4 h-4" />
                Edit Profile
              </Link>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-danger transition-colors"
              >
                <HiOutlineArrowLeftOnRectangle className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
