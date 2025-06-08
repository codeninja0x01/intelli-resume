import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useAppDispatch } from 'src/store/hooks';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import useSupabaseAuth from '../useSupabaseAuth';
import { SupabaseSocialProvider } from '../SupabaseAuthContext';

/**
 * Social login buttons component
 */
function SocialLoginButtons() {
	const { signInWithSocial } = useSupabaseAuth();
	const dispatch = useAppDispatch();

	const handleSocialLogin = async (provider: SupabaseSocialProvider) => {
		try {
			const result = await signInWithSocial(provider);

			if (result?.error) {
				dispatch(showMessage({ 
					message: `Error signing in with ${provider}: ${result.error.message}`,
					variant: 'error'
				}));
			}
			// Note: On success, the user will be redirected to the OAuth provider
			// and then back to our callback page
		} catch (error) {
			console.error(`Error with ${provider} login:`, error);
			dispatch(showMessage({ 
				message: `Unexpected error with ${provider} login`,
				variant: 'error'
			}));
		}
	};

	return (
		<>
			<div className="mt-8 flex items-center">
				<div className="mt-px flex-auto border-t" />
				<Typography
					className="mx-2"
					color="text.secondary"
				>
					Or continue with
				</Typography>
				<div className="mt-px flex-auto border-t" />
			</div>

			<div className="mt-8 flex items-center space-x-4">
				<Button
					variant="outlined"
					className="flex-auto"
					onClick={() => handleSocialLogin('facebook')}
					disabled={!signInWithSocial}
				>
					<FuseSvgIcon
						size={20}
						color="action"
					>
						feather:facebook
					</FuseSvgIcon>
				</Button>
				<Button
					variant="outlined"
					className="flex-auto"
					onClick={() => handleSocialLogin('twitter')}
					disabled={!signInWithSocial}
				>
					<FuseSvgIcon
						size={20}
						color="action"
					>
						feather:twitter
					</FuseSvgIcon>
				</Button>
				<Button
					variant="outlined"
					className="flex-auto"
					onClick={() => handleSocialLogin('github')}
					disabled={!signInWithSocial}
				>
					<FuseSvgIcon
						size={20}
						color="action"
					>
						feather:github
					</FuseSvgIcon>
				</Button>
			</div>
		</>
	);
}

export default SocialLoginButtons; 