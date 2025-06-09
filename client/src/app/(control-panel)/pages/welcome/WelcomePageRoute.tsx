import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const WelcomePage = lazy(() => import('./WelcomePage'));

/**
 * Welcome Page Route
 */
const WelcomePageRoute: FuseRouteItemType = {
	path: '/welcome',
	element: <WelcomePage />,
    settings: {
        layout: {
            config: {
                navbar: { display: false },
                toolbar: { display: false },
                footer: { display: false },
                leftSidePanel: { display: false },
                rightSidePanel: { display: false },
            }
        }
    }
};

export default WelcomePageRoute; 