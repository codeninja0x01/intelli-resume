import { useState } from 'react';
import { completeOnboarding } from '@auth/authApi';
import useUser from '@auth/useUser';
import { supabase } from '@auth/services/supabase/supabaseAuthConfig';

type UseOnboarding = {
	needsOnboarding: boolean;
	isCompleting: boolean;
	completeUserOnboarding: () => Promise<void>;
	error: string | null;
};

/**
 * Hook for managing user onboarding state
 */
function useOnboarding(): UseOnboarding {
	const { data: user, updateUser } = useUser();
	const [isCompleting, setIsCompleting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const needsOnboarding = user?.isFirstTimeUser ?? false;

	const completeUserOnboarding = async () => {
		if (!user || !needsOnboarding) return;

		setIsCompleting(true);
		setError(null);

		try {
			// Get current session
			const { data: { session } } = await supabase.auth.getSession();
			
			if (!session?.access_token) {
				throw new Error('No valid session found');
			}

			// Complete onboarding on backend
			const updatedUser = await completeOnboarding(session.access_token);
			
			// Update user in frontend state
			await updateUser(updatedUser);
			
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to complete onboarding';
			setError(errorMessage);
			console.error('Error completing onboarding:', err);
		} finally {
			setIsCompleting(false);
		}
	};

	return {
		needsOnboarding,
		isCompleting,
		completeUserOnboarding,
		error
	};
}

export default useOnboarding;
export { useOnboarding }; 