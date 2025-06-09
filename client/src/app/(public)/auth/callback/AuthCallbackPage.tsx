import { useEffect, useState } from 'react';
import useNavigate from '@fuse/hooks/useNavigate';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import ErrorOutline from '@mui/icons-material/ErrorOutline';

/**
 * OAuth callback page that handles the redirect from social providers.
 * It displays a loading spinner or an error message. The actual redirection
 * on success is handled globally by SupabaseAuthProvider.
 */
function AuthCallbackPage() {
	const navigate = useNavigate();
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		/**
		 * Checks the URL hash for an 'error_description' parameter provided on OAuth failure.
		 */
		const getErrorDescriptionFromUrl = () => {
			const hash = window.location.hash;
			if (!hash) return null;
			const params = new URLSearchParams(hash.substring(1)); // Remove '#'
			return params.get('error_description');
		};

		const errorDescription = getErrorDescriptionFromUrl();

		if (errorDescription) {
			setError(decodeURIComponent(errorDescription.replace(/\+/g, ' ')));
		}
		// NOTE: There is no success handling here.
		// The global SupabaseAuthProvider is responsible for detecting the SIGNED_IN
		// event and managing the redirection to the dashboard, which is more reliable
		// and prevents a delay on this page.
	}, []);

	// Render an error message UI if an error has occurred.
	if (error) {
		return (
			<Box
				className="flex flex-col flex-auto items-center justify-center p-4 sm:p-24"
				sx={{ backgroundColor: 'background.default' }}
			>
				<Card className="w-full max-w-md shadow-lg rounded-lg">
					<CardContent className="flex flex-col items-center justify-center p-24 text-center">
						<ErrorOutline color="error" className="mb-16" style={{ fontSize: 64 }} />
						<Typography variant="h5" className="mb-16 font-semibold">
							Authentication Failed
						</Typography>
						<Typography variant="body1" color="text.secondary" className="mb-24">
							{error}
						</Typography>
						<Button
							variant="contained"
							color="secondary"
							onClick={() => navigate('/sign-in')}
						>
							Back to Sign In
						</Button>
					</CardContent>
				</Card>
			</Box>
		);
	}

	// Render the loading UI while waiting for the global provider to redirect.
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