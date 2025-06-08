import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import _ from 'lodash';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch } from 'src/store/hooks';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@fuse/core/Link';
import useSupabaseAuth from '../useSupabaseAuth';

/**
 * Form Validation Schema
 */
const schema = z.object({
	email: z.string().email('You must enter a valid email').nonempty('You must enter an email'),
	password: z
		.string()
		.min(4, 'Password is too short - must be at least 4 chars.')
		.nonempty('Please enter your password.'),
	remember: z.boolean().optional()
});

type FormType = z.infer<typeof schema>;

const defaultValues: FormType = {
	email: '',
	password: '',
	remember: true
};

function SupabaseSignInForm() {
	const { signIn } = useSupabaseAuth();
	const dispatch = useAppDispatch();

	const { control, formState, handleSubmit, setValue, setError } = useForm<FormType>({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	useEffect(() => {
		setValue('email', 'admin@fusetheme.com', { shouldDirty: true, shouldValidate: true });
		setValue('password', 'admin123', { shouldDirty: true, shouldValidate: true });
	}, [setValue]);

	async function onSubmit(formData: FormType) {
		const { email, password } = formData;

		const result = await signIn({
			email,
			password
		});

		if (result?.error) {
			const error = result.error;

			// Handle different Supabase error codes
			if (error.message.includes('Invalid login credentials')) {
				setError('email', {
					type: 'manual',
					message: 'Invalid email or password'
				});
				setError('password', {
					type: 'manual',
					message: 'Invalid email or password'
				});
			} else if (error.message.includes('Email not confirmed')) {
				dispatch(showMessage({ message: 'Please check your email and confirm your account before signing in.' }));
			} else {
				dispatch(showMessage({ message: error.message }));
			}
		}
	}

	return (
		<div className="w-full">
			<form
				name="loginForm"
				noValidate
				className="mt-8 flex w-full flex-col justify-center"
				onSubmit={handleSubmit(onSubmit)}
			>
				<Controller
					name="email"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mb-6"
							label="Email"
							autoFocus
							type="email"
							error={!!errors.email}
							helperText={errors?.email?.message}
							variant="outlined"
							required
							fullWidth
						/>
					)}
				/>

				<Controller
					name="password"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mb-6"
							label="Password"
							type="password"
							error={!!errors.password}
							helperText={errors?.password?.message}
							variant="outlined"
							required
							fullWidth
						/>
					)}
				/>

				<div className="flex flex-col items-center justify-center sm:flex-row sm:justify-between">
					<Controller
						name="remember"
						control={control}
						render={({ field }) => (
							<FormControl>
								<FormControlLabel
									label="Remember me"
									control={
										<Checkbox
											size="small"
											{...field}
										/>
									}
								/>
							</FormControl>
						)}
					/>

					<Link
						className="text-md font-medium"
						to="/forgot-password"
					>
						Forgot password?
					</Link>
				</div>

				<Button
					variant="contained"
					color="secondary"
					className="mt-4 w-full"
					aria-label="Sign in"
					disabled={_.isEmpty(dirtyFields) || !isValid}
					type="submit"
					size="large"
				>
					Sign in
				</Button>
			</form>
		</div>
	);
}

export default SupabaseSignInForm; 