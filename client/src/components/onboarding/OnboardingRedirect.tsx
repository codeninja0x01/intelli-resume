import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useOnboarding } from '@auth/useOnboarding';
import useUser from '@auth/useUser';

interface OnboardingRedirectProps {
	children: React.ReactNode;
}

/**
 * Component that redirects first-time users to the welcome page
 */
function OnboardingRedirect({ children }: OnboardingRedirectProps) {
	const navigate = useNavigate();
	const location = useLocation();
	const { data: user } = useUser();
	const { needsOnboarding } = useOnboarding();

	useEffect(() => {
		// MANDATORY: Force redirect to welcome page for first-time users
		// Block ALL routes except the welcome page until onboarding is completed
		if (user && needsOnboarding && location.pathname !== '/welcome') {
			console.log('🚀 MANDATORY onboarding: Blocking access to', location.pathname, 'redirecting to welcome page');
			navigate('/welcome', { replace: true });
		}
	}, [user, needsOnboarding, location.pathname, navigate]);

	// Block rendering of any content if user needs onboarding and is not on welcome page
	if (user && needsOnboarding && location.pathname !== '/welcome') {
		return null; // Don't render anything while redirecting
	}

	return <>{children}</>;
}

export default OnboardingRedirect; 