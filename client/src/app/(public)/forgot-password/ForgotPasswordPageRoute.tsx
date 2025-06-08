import { lazy } from 'react';
import authRoles from '@auth/authRoles';

const ForgotPasswordPage = lazy(() => import('./ForgotPasswordPage'));

const ForgotPasswordPageRoute = {
	path: '/forgot-password',
	element: <ForgotPasswordPage />,
	auth: authRoles.onlyGuest,
    settings: {
        layout: {
            config: {
                navbar: { display: false },
                toolbar: { display: false },
                footer: { display: false },
                leftSidePanel: { display: false },
                rightSidePanel: { display: false }
            }
        }
    }
};

export default ForgotPasswordPageRoute; 