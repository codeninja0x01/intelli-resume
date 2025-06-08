import { createContext } from 'react';
import { FuseAuthProviderState } from '@fuse/core/FuseAuthProvider/types/FuseAuthTypes';
import { User } from '@auth/user';
import { Provider } from '@supabase/supabase-js';

export type SupabaseSignInPayload = {
	email: string;
	password: string;
};

export type SupabaseSignUpPayload = {
	email: string;
	password: string;
	displayName?: string;
};

export type SupabaseSocialProvider = 'google' | 'facebook' | 'twitter' | 'github' | 'linkedin';

export type SupabaseAuthContextType = FuseAuthProviderState<User> & {
	updateUser: (U: User) => Promise<Response>;
	signIn?: (credentials: SupabaseSignInPayload) => Promise<{ error?: Error; success?: boolean }>;
	signUp?: (U: SupabaseSignUpPayload) => Promise<{ error?: Error; success?: boolean }>;
	signOut?: () => Promise<void>;
	resetPassword?: (email: string) => Promise<{ error?: Error; success?: boolean }>;
	signInWithSocial?: (provider: SupabaseSocialProvider) => Promise<{ error?: Error; success?: boolean }>;
};

const defaultAuthContext: SupabaseAuthContextType = {
	authStatus: 'configuring',
	isAuthenticated: false,
	user: null,
	updateUser: null,
	signIn: null,
	signUp: null,
	signOut: null,
	resetPassword: null,
	signInWithSocial: null
};

const SupabaseAuthContext = createContext<SupabaseAuthContextType>(defaultAuthContext);

export default SupabaseAuthContext; 