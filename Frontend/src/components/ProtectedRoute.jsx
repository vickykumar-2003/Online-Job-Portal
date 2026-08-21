import {Navigate,Outlet} from 'react-router-dom';import {getUser,isLoggedIn} from '../utils/auth';
export default function ProtectedRoute({role}){if(!isLoggedIn())return <Navigate to="/login" replace/>;const u=getUser();if(role&&u?.role!==role)return <Navigate to="/" replace/>;return <Outlet/>}
