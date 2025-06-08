import React from 'react';

import SupabaseAuthProvider from '@auth/services/supabase/SupabaseAuthProvider';
import { FuseAuthProviderType } from '@fuse/core/FuseAuthProvider/types/FuseAuthTypes';
import FuseAuthProvider from '@fuse/core/FuseAuthProvider';
import FuseAuthorization from '@fuse/core/FuseAuthorization';
import { User } from '@auth/user';
/**
 * The Authentication providers.
 */
const authProviders: FuseAuthProviderType[] = [
	{
		name: 'supabase',
		Provider: SupabaseAuthProvider
	}
];

type AuthenticationProps = {
	children: React.ReactNode;
};

function Authentication(props: AuthenticationProps) {
	const { children } = props;

	return (
		<FuseAuthProvider providers={authProviders}>
			{(authState) => {
				const userRole = authState?.user?.role as User['role'];
				return <FuseAuthorization userRole={userRole}>{children}</FuseAuthorization>;
			}}
		</FuseAuthProvider>
	);
}

export default Authentication;
