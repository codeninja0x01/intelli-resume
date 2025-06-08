/**
 * 🔑 AUTHENTICATION FLOW - OPTION 1 (RECOMMENDED)
 * 
 * ✅ Authentication: Direct to Supabase
 *    - signIn() → supabase.auth.signInWithPassword()
 *    - signUp() → supabase.auth.signUp()
 *    - resetPassword() → supabase.auth.resetPasswordForEmail()
 *    - signOut() → supabase.auth.signOut()
 * 
 * ✅ User Profile Management: Your Backend API
 *    - User profile data stored in your database
 *    - Managed via /api/auth/user endpoints
 *    - Allows custom user fields and business logic
 * 
 * This hybrid approach gives you:
 * - Supabase's robust authentication system
 * - Your own user profile management
 * - Best of both worlds!
 */

import { useState, useEffect, useCallback, useMemo, useImperativeHandle } from 'react';
import { FuseAuthProviderComponentProps, FuseAuthProviderState } from '@fuse/core/FuseAuthProvider/types/FuseAuthTypes';
import { authCreateDbUser, authGetDbUserByEmail, authUpdateDbUser } from '@auth/authApi';
import { PartialDeep } from 'type-fest';
import { User } from '@auth/user';
import { supabase } from './supabaseAuthConfig';
import SupabaseAuthContext, { SupabaseAuthContextType, SupabaseSignInPayload, SupabaseSignUpPayload, SupabaseSocialProvider } from './SupabaseAuthContext';

function SupabaseAuthProvider(props: FuseAuthProviderComponentProps) {
	const { ref, children, onAuthStateChanged } = props;

	/**
	 * Fuse Auth Provider State
	 */
	const [authState, setAuthState] = useState<FuseAuthProviderState<User>>({
		authStatus: 'configuring',
		isAuthenticated: false,
		user: null
	});

	/**
	 * Watch for changes in the auth state
	 * and pass them to the FuseAuthProvider
	 */
	useEffect(() => {
		if (onAuthStateChanged) {
			onAuthStateChanged(authState);
		}
	}, [authState, onAuthStateChanged]);

	/**
	 * Initialize Supabase auth listener
	 */
	useEffect(() => {
		/**
		 * Get initial session
		 */
		const getInitialSession = async () => {
			const { data: { session }, error } = await supabase.auth.getSession();
			
			if (error) {
				console.error('Error getting session:', error);
				setAuthState({
					authStatus: 'unauthenticated',
					isAuthenticated: false,
					user: null
				});
				return;
			}

			if (session?.user) {
				await fetchAndSetUser(session.user.email);
			} else {
				setAuthState({
					authStatus: 'unauthenticated',
					isAuthenticated: false,
					user: null
				});
			}
		};

		/**
		 * Listen for auth state changes
		 */
		const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
			console.log('Supabase auth state changed:', event, session);

			if (event === 'SIGNED_IN' && session?.user) {
				await fetchAndSetUser(session.user.email);
			} else if (event === 'SIGNED_OUT') {
				setAuthState({
					authStatus: 'unauthenticated',
					isAuthenticated: false,
					user: null
				});
			} else if (event === 'TOKEN_REFRESHED' && session?.user) {
				await fetchAndSetUser(session.user.email);
			}
		});

		getInitialSession();

		// Cleanup subscription
		return () => {
			subscription?.unsubscribe();
		};
	}, []);

	/**
	 * Fetch user data from database and set auth state
	 * 👤 User profile data comes from your backend API
	 */
	const fetchAndSetUser = async (email: string) => {
		console.log('🔍 fetchAndSetUser called with email:', email);
		
		try {
			// Fetch user profile data from your backend (not Supabase)
			console.log('📡 Fetching user from backend...');
			const userResponse = await authGetDbUserByEmail(email);
			
			if (!userResponse.ok) {
				throw new Error(`Failed to fetch user: ${userResponse.status} ${userResponse.statusText}`);
			}
			
			const userDbData = (await userResponse.json()) as User;
			console.log('✅ User found in backend:', userDbData);

			setAuthState({
				user: userDbData,
				isAuthenticated: true,
				authStatus: 'authenticated'
			});
			console.log('✅ Auth state set to authenticated');
		} catch (error) {
			console.error('❌ Error fetching user data:', error);
			
			// If user data doesn't exist in db, create a new user record
			try {
				console.log('🔧 Creating new user in backend...');
				const { data: { user: supabaseUser } } = await supabase.auth.getUser();
				
				if (supabaseUser) {
					console.log('📝 Supabase user data:', {
						email: supabaseUser.email,
						metadata: supabaseUser.user_metadata
					});

					const newUserPayload = {
						email: supabaseUser.email,
						role: ['user'],
						displayName: supabaseUser.user_metadata?.display_name || supabaseUser.email?.split('@')[0] || 'User',
						photoURL: supabaseUser.user_metadata?.avatar_url
					};
					console.log('📤 Creating user with payload:', newUserPayload);

					const newUserResponse = await authCreateDbUser(newUserPayload);
					
					if (!newUserResponse.ok) {
						throw new Error(`Failed to create user: ${newUserResponse.status} ${newUserResponse.statusText}`);
					}
					
					const userDbData = (await newUserResponse.json()) as User;
					console.log('✅ User created in backend:', userDbData);
					
					setAuthState({
						user: userDbData,
						isAuthenticated: true,
						authStatus: 'authenticated'
					});
					console.log('✅ Auth state set to authenticated for new user');
				} else {
					console.error('❌ No Supabase user found');
					setAuthState({
						authStatus: 'unauthenticated',
						isAuthenticated: false,
						user: null
					});
				}
			} catch (createError) {
				console.error('❌ Error creating user:', createError);
				setAuthState({
					authStatus: 'unauthenticated',
					isAuthenticated: false,
					user: null
				});
			}
		}
	};

	/**
	 * Sign in with email and password
	 * 🔒 Authentication happens directly with Supabase
	 */
	const signIn: SupabaseAuthContextType['signIn'] = useCallback(async ({ email, password }) => {
		try {
			// Direct authentication with Supabase (not through backend)
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password
			});

			if (error) {
				return { error };
			}

			return { success: true };
		} catch (error) {
			console.error('Error signing in:', error);
			return { error: error as Error };
		}
	}, []);

	/**
	 * Sign up with email and password
	 * 🔒 Authentication happens directly with Supabase
	 */
	const signUp: SupabaseAuthContextType['signUp'] = useCallback(async ({ email, password, displayName }) => {
		try {
			// Direct authentication with Supabase (not through backend)
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						display_name: displayName
					}
				}
			});

			if (error) {
				return { error };
			}

			return { success: true };
		} catch (error) {
			console.error('Error signing up:', error);
			return { error: error as Error };
		}
	}, []);

	/**
	 * Sign out
	 */
	const signOut: SupabaseAuthContextType['signOut'] = useCallback(async () => {
		try {
			const { error } = await supabase.auth.signOut();
			if (error) {
				console.error('Error signing out:', error);
			}
		} catch (error) {
			console.error('Error signing out:', error);
		}
	}, []);

	/**
	 * Reset password
	 * 🔒 Password reset happens directly with Supabase
	 */
	const resetPassword: SupabaseAuthContextType['resetPassword'] = useCallback(async (email: string) => {
		try {
			// Direct password reset with Supabase (not through backend)
			const { error } = await supabase.auth.resetPasswordForEmail(email, {
				redirectTo: `${window.location.origin}/auth/reset-password`
			});

			if (error) {
				return { error };
			}

			return { success: true };
		} catch (error) {
			console.error('Error resetting password:', error);
			return { error: error as Error };
		}
	}, []);

	/**
	 * Sign in with social providers
	 * 🔒 Social authentication happens directly with Supabase
	 */
	const signInWithSocial: SupabaseAuthContextType['signInWithSocial'] = useCallback(async (provider: SupabaseSocialProvider) => {
		try {
			// Direct social authentication with Supabase (not through backend)
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider,
				options: {
					redirectTo: `${window.location.origin}/auth/callback`
				}
			});

			if (error) {
				return { error };
			}

			return { success: true };
		} catch (error) {
			console.error('Error signing in with social provider:', error);
			return { error: error as Error };
		}
	}, []);

	/**
	 * Update user data in db
	 */
	const updateUser: SupabaseAuthContextType['updateUser'] = useCallback(async (_user: PartialDeep<User>) => {
		try {
			return await authUpdateDbUser(_user);
		} catch (error) {
			console.error('Error updating user:', error);
			return Promise.reject(error);
		}
	}, []);

	/**
	 * Expose methods to the FuseAuthProvider
	 */
	useImperativeHandle(ref, () => ({
		signOut,
		updateUser
	}));

	const authContextValue = useMemo(
		() => ({
			...authState,
			signIn,
			signUp,
			signOut,
			resetPassword,
			signInWithSocial,
			updateUser
		}),
		[authState, signIn, signUp, signOut, resetPassword, signInWithSocial, updateUser]
	);

	return <SupabaseAuthContext value={authContextValue}>{children}</SupabaseAuthContext>;
}

export default SupabaseAuthProvider; 