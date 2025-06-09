import { FuseSettingsConfigType } from '@fuse/core/FuseSettings/FuseSettings';
import { FuseAuthUser } from '@fuse/core/FuseAuthProvider/types/FuseAuthUser';
import { PartialDeep } from 'type-fest';

/**
 * The type definition for a user object matching backend response.
 */
export type User = FuseAuthUser & {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	name: string; // computed from firstName + lastName
	displayName: string; // user-friendly display name
	tokenBalance: number;
	role: 'admin' | 'user'; // simplified from backend
	isFirstTimeUser: boolean; // Track if user needs onboarding
	createdAt: string; // ISO date string
	updatedAt: string; // ISO date string
	profilePictureUrl?: string;
	avatar_url?: string; // backward compatibility alias
	
	// Fuse-specific properties (optional for compatibility)
	photoURL?: string; // alias for profilePictureUrl
	shortcuts?: string[];
	settings?: PartialDeep<FuseSettingsConfigType>;
	loginRedirectUrl?: string; // The URL to redirect to after login.
};
