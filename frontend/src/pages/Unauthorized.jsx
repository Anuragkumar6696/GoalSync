import { Link } from 'react-router-dom';
import { HiOutlineShieldExclamation } from 'react-icons/hi2';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-3xl shadow-xl p-10 border border-slate-100">
          <div className="w-20 h-20 bg-danger/10 text-danger rounded-2xl flex items-center justify-center mx-auto mb-6">
            <HiOutlineShieldExclamation className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Access Denied</h1>
          <p className="text-slate-500 mb-8">
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center w-full px-6 py-3.5 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;