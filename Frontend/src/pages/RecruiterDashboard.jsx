import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { getUser } from '../utils/auth';
import JobCard from '../components/JobCard';

function ApplicationList({ jobId }) {
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/applications/${jobId}/applications`)
            .then(res => setApplications(res.data.data || []))
            .catch(err => setError('Failed to load applications'))
            .finally(() => setLoading(false));
    }, [jobId]);

    const updateStatus = async (appId, status) => {
        try {
            await api.put(`/applications/${appId}/status`, { status });
            setApplications(prev => prev.map(a => a._id === appId ? { ...a, status } : a));
        } catch (err) {
            alert(err.response?.data?.message || 'Update failed');
        }
    };

    if (loading) return <div>Loading applications...</div>;
    if (error) return <div className="alert error">{error}</div>;
    if (applications.length === 0) return <div className="muted">No applications yet.</div>;

    return (
        <div className="list" style={{ marginTop: '15px' }}>
            {applications.map(app => (
                <div key={app._id} className="card" style={{ padding: '15px', borderLeft: '4px solid #4f46e5' }}>
                    <h4>{app.applicant?.name} <span className="muted" style={{ fontWeight: 'normal', fontSize: '14px' }}>({app.applicant?.email})</span></h4>
                    <p className="muted" style={{ fontSize: '13px', margin: '5px 0' }}>Applied on: {new Date(app.createdAt).toLocaleDateString()}</p>
                    {app.coverLetter && <p style={{ fontSize: '14px', margin: '10px 0', background: '#f5f7fb', padding: '10px', borderRadius: '5px' }}>{app.coverLetter}</p>}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                        <span className="status" style={{
                            background: app.status === 'Accepted' ? '#ecfdf3' : app.status === 'Rejected' ? '#fff1f2' : '#fff7ed',
                            color: app.status === 'Accepted' ? '#047857' : app.status === 'Rejected' ? '#be123c' : '#c2410c'
                        }}>
                            {app.status}
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                className="btn outline"
                                style={{ padding: '5px 10px', fontSize: '13px' }}
                                onClick={() => updateStatus(app._id, 'Accepted')}
                            >
                                Accept
                            </button>
                            <button
                                className="btn danger"
                                style={{ padding: '5px 10px', fontSize: '13px', marginTop: 0 }}
                                onClick={() => updateStatus(app._id, 'Rejected')}
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function RecruiterDashboard() {
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState('');
    const [expandedJob, setExpandedJob] = useState(null);
    const user = getUser();

    const loadJobs = () => {
        api.get('/jobs')
            .then(res => {
                const allJobs = res.data.data || [];
                // Filter jobs created by this recruiter
                const myJobs = allJobs.filter(j => j.postedBy?._id === user.id || j.postedBy === user.id);
                setJobs(myJobs);
            })
            .catch(err => setError(err.response?.data?.message || 'Could not load jobs'));
    };

    useEffect(() => {
        loadJobs();
    }, []);

    const deleteJob = async (id) => {
        if (!window.confirm('Are you sure you want to delete this job?')) return;
        try {
            await api.delete(`/jobs/${id}`);
            loadJobs();
        } catch (err) {
            setError(err.response?.data?.message || 'Delete failed');
        }
    };

    return (
        <section>
            <div className="section">
                <div>
                    <span className="eyebrow">RECRUITER PANEL</span>
                    <h1>Manage Jobs</h1>
                </div>
                <Link className="btn primary" to="/jobs/create">+ Post Job</Link>
            </div>

            {error && <div className="alert error">{error}</div>}

            {jobs.length === 0 ? (
                <div className="card empty">
                    <h2>No jobs posted yet</h2>
                    <p className="muted">Create your first job listing to attract talent.</p>
                </div>
            ) : (
                <div className="list">
                    {jobs.map(job => (
                        <div key={job._id} className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 10px 0' }}>{job.title}</h3>
                                    <div style={{ display: 'flex', gap: '10px', fontSize: '14px' }} className="muted">
                                        <span>🏢 {job.company}</span>
                                        <span>📍 {job.location}</span>
                                        <span>💰 {job.salary}</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <Link to={`/jobs/${job._id}`} className="btn outline">View</Link>
                                    <Link to={`/jobs/edit/${job._id}`} className="btn outline">Edit</Link>
                                    <button className="btn danger" style={{ marginTop: 0 }} onClick={() => deleteJob(job._id)}>Delete</button>
                                </div>
                            </div>

                            <hr style={{ margin: '15px 0' }} />

                            <button
                                className="btn outline full"
                                style={{ background: '#f8fafc' }}
                                onClick={() => setExpandedJob(expandedJob === job._id ? null : job._id)}
                            >
                                {expandedJob === job._id ? 'Hide Applications' : 'View Applications'}
                            </button>

                            {expandedJob === job._id && (
                                <ApplicationList jobId={job._id} />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
