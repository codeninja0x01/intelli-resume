import { User } from '@auth/user';
import UserModel from '@auth/user/models/UserModel';
import { PartialDeep } from 'type-fest';
import apiFetch from '@/utils/apiFetch';

/**
 * Backend API response wrapper type
 */
type ApiResponse<T> = {
	success: boolean;
	message: string;
	data: T;
};

/**
 * Transform backend user data to include compatibility aliases
 */
function transformUserData(userData: any): User {
	return {
		...userData,
		// Add photoURL alias for backward compatibility with Fuse components
		photoURL: userData.profilePictureUrl || userData.avatar_url || ''
	} as User;
}

/**
 * 👤 USER PROFILE MANAGEMENT API
 * 
 * These functions handle user profile data in your backend database.
 * Authentication is handled directly by Supabase, but user profiles
 * are still managed through your backend for custom business logic.
 */

/**
 * Get user by id
 */
export async function authGetDbUser(userId: string): Promise<Response> {
	return apiFetch(`/api/auth/user/${userId}`);
}

/**
 * Get user by email
 */
export async function authGetDbUserByEmail(email: string): Promise<Response> {
	return apiFetch(`/api/auth/user-by-email/${email}`);
}

/**
 * Get current user profile using auth token
 */
export async function authGetCurrentProfile(accessToken: string): Promise<User> {
	console.log('🔵 authGetCurrentProfile called with token:', accessToken ? '[REDACTED]' : 'null');
	
	const response = await apiFetch('/api/profiles/me', {
		headers: {
			'Authorization': `Bearer ${accessToken}`
		}
	});
	
	console.log('🔵 authGetCurrentProfile response status:', response.status);
	
	const responseData = await response.json() as ApiResponse<User>;
	console.log('🔵 authGetCurrentProfile response data:', responseData);
	
	// Backend returns { success, message, data } - extract the data
	if (responseData && responseData.success && responseData.data) {
		const userData = transformUserData(responseData.data);
		console.log('🔵 authGetCurrentProfile transformed user:', userData);
		return userData;
	}
	
	console.error('❌ authGetCurrentProfile: Invalid response format');
	throw new Error('Invalid response format from profile endpoint');
}

/**
 * Update user
 */
export function authUpdateDbUser(user: PartialDeep<User>) {
	return apiFetch(`/api/auth/user/${user.id}`, {
		method: 'PUT',
		body: JSON.stringify(UserModel(user))
	});
}

/**
 * Create user
 */
export async function authCreateDbUser(user: PartialDeep<User>) {
	return apiFetch('/api/auth/user', {
		method: 'POST',
		body: JSON.stringify(UserModel(user))
	});
}

export async function syncProfile(accessToken: string): Promise<User> {
	try {
		// Include the auth token in the request
		const response = await apiFetch('/api/profiles/create-from-auth', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${accessToken}`
			}
		});
		
		const responseData = await response.json() as ApiResponse<User>;

		// Backend returns { success, message, data } - extract the data
		if (responseData && responseData.success && responseData.data) {
			return transformUserData(responseData.data);
		}

		// Throw a specific error if the response data is not in the expected format.
		throw new Error('Invalid data format received from the server during profile sync.');
	} catch (error) {
		console.error('Failed to sync user profile with the backend:', error);
		// Re-throw the error to be handled by the calling function (e.g., in SupabaseAuthProvider).
		throw error;
	}
}

/**
 * Complete onboarding for the current user
 */
export async function completeOnboarding(accessToken: string): Promise<User> {
	try {
		const response = await apiFetch('/api/profiles/complete-onboarding', {
			method: 'PUT',
			headers: {
				'Authorization': `Bearer ${accessToken}`
			}
		});
		
		const responseData = await response.json() as ApiResponse<User>;

		// Backend returns { success, message, data } - extract the data
		if (responseData && responseData.success && responseData.data) {
			return transformUserData(responseData.data);
		}

		throw new Error('Invalid data format received from the server during onboarding completion.');
	} catch (error) {
		console.error('Failed to complete onboarding:', error);
		throw error;
	}
}

