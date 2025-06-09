/**
 * Data Transfer Object (DTO) for creating a new user profile.
 * This defines the shape of the data required by the profile creation service.
 */
export interface CreateProfileDto {
	id: string;
	email: string;
	firstName?: string;
	lastName?: string;
	role?: 'user' | 'admin';
	phone?: string;
	address?: string;
	city?: string;
	state?: string;
	postalCode?: string;
	country?: string;
	bio?: string;
	linkedinUrl?: string;
	githubUrl?: string;
	portfolioUrl?: string;
	profilePictureUrl?: string;
}
