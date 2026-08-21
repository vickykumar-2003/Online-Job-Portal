import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function EditJob() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        description: '',
        location: '',
        salary: '',
        skills: '',
        jobType: 'Full-time'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/jobs/${id}`)
            .then(res => {
                const job = res.data.data;
                setFormData({
                    title: job.title || '',
                    company: job.company || '',
                    description: job.description || '',
                    location: job.location || '',
                    salary: job.salary || '',
                    skills: (job.skills || []).join(', '),
                    jobType: job.jobType || 'Full-time'
                });
            })
            .catch(err => setError(err.response?.data?.message || 'Failed to load job'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const payload = {
                ...formData,
                skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
            };
            await api.put(`/jobs/${id}`, payload);
            navigate('/recruiter');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update job');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="auth" style={{ maxWidth: '800px' }}>
            <Link to="/recruiter" className="back">← Back to Dashboard</Link>
            <h1>Edit Job</h1>
            {error && <div className="alert error">{error}</div>}

            <form onSubmit={handleSubmit} className="form card">
                <label>
                    Job Title
                    <input
                        required
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                </label>

                <label>
                    Company Name
                    <input
                        required
                        value={formData.company}
                        onChange={e => setFormData({ ...formData, company: e.target.value })}
                    />
                </label>

                <label>
                    Location
                    <input
                        required
                        value={formData.location}
                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                    />
                </label>

                <label>
                    Salary
                    <input
                        required
                        value={formData.salary}
                        onChange={e => setFormData({ ...formData, salary: e.target.value })}
                    />
                </label>

                <label>
                    Job Type
                    <select
                        value={formData.jobType}
                        onChange={e => setFormData({ ...formData, jobType: e.target.value })}
                    >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Internship">Internship</option>
                        <option value="Remote">Remote</option>
                    </select>
                </label>

                <label>
                    Skills (comma separated)
                    <input
                        required
                        value={formData.skills}
                        onChange={e => setFormData({ ...formData, skills: e.target.value })}
                        placeholder="e.g. React, Node, MongoDB"
                    />
                </label>

                <label className="wide">
                    Description
                    <textarea
                        required
                        rows="6"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />
                </label>

                <div className="wide">
                    <button type="submit" className="btn primary full">Update Job</button>
                </div>
            </form>
        </div>
    );
}
