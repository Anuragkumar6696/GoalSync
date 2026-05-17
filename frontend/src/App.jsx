import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';

// Employee Pages
import EmployeeDashboard from './pages/employee/Dashboard';
import CreateGoal from './pages/employee/CreateGoal';
import MyGoals from './pages/employee/MyGoals';
import QuarterlyUpdates from './pages/employee/QuarterlyUpdates';

// Manager Pages
import ManagerDashboard from './pages/manager/Dashboard';
import Approvals from './pages/manager/Approvals';
import TeamGoals from './pages/manager/TeamGoals';
import DetailedAnalytics from './pages/manager/DetailedAnalytics';
import CheckIns from './pages/manager/CheckIns';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AllGoals from './pages/admin/AllGoals';
import Users from './pages/admin/Users';
import AuditLogs from './pages/admin/AuditLogs';
import Reports from './pages/admin/Reports';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Employee Routes */}
          <Route path="/employee" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<EmployeeDashboard />} />
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="create-goals" element={<CreateGoal />} />
            <Route path="my-goals" element={<MyGoals />} />
            <Route path="updates" element={<QuarterlyUpdates />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Manager Routes */}
          <Route path="/manager" element={
            <ProtectedRoute allowedRoles={['manager']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<ManagerDashboard />} />
            <Route path="dashboard" element={<ManagerDashboard />} />
            <Route path="team-goals" element={<TeamGoals />} />
            <Route path="team-goals/:id" element={<DetailedAnalytics />} />
            <Route path="approvals" element={<Approvals />} />
            <Route path="check-ins" element={<CheckIns />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="all-goals" element={<AllGoals />} />
            <Route path="all-goals/:id" element={<DetailedAnalytics />} />
            <Route path="users" element={<Users />} />
            <Route path="logs" element={<AuditLogs />} />
            <Route path="audit-logs" element={<AuditLogs />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<div className="flex items-center justify-center h-screen font-bold text-2xl">404 - Not Found</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
