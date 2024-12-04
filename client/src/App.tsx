import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Login from '@/pages/Login';
import PatientDashboard from '@/pages/PatientDashboard';
import StaffDashboard from '@/pages/StaffDashboard';
import './index.css';
import ViewPostForum from './pages/ViewPostForum';

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/patient-dashboard" element={<PatientDashboard />} />

          <Route path="/staff-dashboard" element={<StaffDashboard />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>

      <footer className="grid h-[4rem] w-full place-content-center bg-white">
        <p className="text-sm text-muted-foreground">
          &copy; 2024 All rights reserved
        </p>
      </footer>
    </>
  );
}
