import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { User } from '@auth/user';

/**
 * Creates a new user object with the specified data.
 */
function UserModel(data?: PartialDeep<User>): User {
	data = data || {};

	return _.defaults(data, {
		id: '',
		email: '',
		firstName: '',
		lastName: '',
		name: '',
		displayName: '',
		tokenBalance: 0,
		role: 'user',
		isFirstTimeUser: true,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		profilePictureUrl: '',
		avatar_url: '',
		photoURL: '', // alias for compatibility
		shortcuts: [],
		settings: {},
		loginRedirectUrl: '/'
	}) as User;
}

export default UserModel;
