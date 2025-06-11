import { Routes, Route } from 'react-router-dom';
import ROUTES from '../consts/ROUTES';
import ProtectedRoute from './protectedRoute'

import Login from '../Pages/Login/Login';
import Signup from '../Pages/Signup/Signup';
import Profile from '../Pages/Profile/Profile';
import Dashboard from '../Pages/Dashboard/Dashboard';
import Taxes from '../Pages/Taxes/Taxes';
import NotFound from '../Pages/Not Found/NotFound';
import Cashflow from '../Pages/Cashflow/Cashflow';

function Router() {
    return (
        <Routes>
            <Route path={ROUTES.login} element={<Login />} />
            <Route path={ROUTES.signup} element={<Signup />} />
            <Route path={ROUTES.profile} element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            <Route path={ROUTES.dashboard} element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path={ROUTES.taxes} element={<ProtectedRoute><Taxes /></ProtectedRoute>} />
            <Route path={ROUTES.future} element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path={ROUTES.cashflow} element={<ProtectedRoute><Cashflow /></ProtectedRoute>} />

            <Route path={ROUTES.notfound} element={<NotFound />} />
        </Routes>
    );
}

export default Router;