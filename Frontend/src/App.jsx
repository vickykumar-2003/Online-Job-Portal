import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobDetails from './pages/JobDetails';
import CreateJob from './pages/CreateJob';
import EditJob from './pages/EditJob';
import RecruiterDashboard from './pages/RecruiterDashboard';
import MyApplications from './pages/MyApplications';

export default function App() {
    return (
        <>
            <Navbar />
            <main className="container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/jobs/:id" element={<JobDetails />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/applications" element={<MyApplications />} />
                    </Route>

                    <Route element={<ProtectedRoute role="recruiter" />}>
                        <Route path="/recruiter" element={<RecruiterDashboard />} />
                        <Route path="/jobs/create" element={<CreateJob />} />
                        <Route path="/jobs/edit/:id" element={<EditJob />} />
                    </Route>

                    <Route path="*" element={<Home />} />
                </Routes>
            </main>
        </>
    );
}
