import { useEffect } from 'react';
import useNavigate from '@fuse/hooks/useNavigate';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { supabase } from '@auth/services/supabase/supabaseAuthConfig';

/**
 * OAuth callback page that handles the redirect from social providers
 */
function AuthCallbackPage() {
	const navigate = useNavigate();

	useEffect(() => {
		const handleAuthCallback = async () => {
			try {
				// Check current session (SupabaseAuthProvider handles auth state changes globally)
				const { data: { session }, error } = await supabase.auth.getSession();
				
				if (error) {
					console.error('Auth callback error:', error);
					navigate('/sign-in?error=oauth_error');
					return;
				}

				if (session?.user) {
					// User successfully authenticated, redirect to dashboard
					console.log('Auth callback - user authenticated, redirecting to dashboard');
					navigate('/dashboards/project');
				} else {
					// No session yet, wait for SupabaseAuthProvider to process auth state
					// If no session after 3 seconds, redirect to sign-in
					console.log('Auth callback - no session yet, waiting...');
					setTimeout(() => {
						// Check one more time before redirecting to sign-in
						supabase.auth.getSession().then(({ data: { session } }) => {
							if (session?.user) {
								navigate('/dashboards/project');
							} else {
								navigate('/sign-in');
							}
						});
					}, 3000);
				}
			} catch (error) {
				console.error('Error handling auth callback:', error);
				navigate('/sign-in?error=callback_error');
			}
		};

		// Small delay to let URL processing complete
		const timer = setTimeout(handleAuthCallback, 500);
		
		return () => clearTimeout(timer);
	}, [navigate]);

	return (
		<Box 
			className="flex h-screen items-center justify-center bg-gray-50"
			sx={{ backgroundColor: 'background.default' }}
		>
			<div className="text-center">
				<CircularProgress size={40} className="mb-4" />
				<Typography variant="h6" className="mb-2">
					Completing sign in...
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Please wait while we complete your authentication.
				</Typography>
			</div>
		</Box>
	);
}

export default AuthCallbackPage; 