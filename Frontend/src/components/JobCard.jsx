import {Link} from 'react-router-dom';
export default function JobCard({job}){return <article className="card job"><div><span className="tag">{job.jobType||'Full-time'}</span><h3>{job.title}</h3><p className="muted">{job.company} · {job.location}</p></div><div className="jobfoot"><b>{job.salary}</b><Link className="btn primary" to={`/jobs/${job._id}`}>View Job</Link></div></article>}
