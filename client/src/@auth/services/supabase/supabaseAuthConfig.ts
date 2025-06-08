import { createClient } from '@supabase/supabase-js';

type SupabaseAuthConfig = {
	url: string;
	anonKey: string;
	options?: {
		auth?: {
			autoRefreshToken?: boolean;
			persistSession?: boolean;
			detectSessionInUrl?: boolean;
		};
	};
};

const supabaseConfig: SupabaseAuthConfig = {
	url: import.meta.env.VITE_SUPABASE_URL,
	anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
	options: {
		auth: {
			autoRefreshToken: true,
			persistSession: true,
			detectSessionInUrl: true
		}
	}
};

export const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey, supabaseConfig.options);

export default supabaseConfig; 