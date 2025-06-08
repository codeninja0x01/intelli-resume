import { lazy } from 'react';
import authRoles from '@auth/authRoles';

const AuthCallbackPage = lazy(() => import('./AuthCallbackPage'));

const AuthCallbackPageRoute = {
	path: '/auth/callback',
	element: <AuthCallbackPage />,
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

export default AuthCallbackPageRoute; 