import { Controller, useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch } from 'src/store/hooks';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import useSupabaseAuth from '../useSupabaseAuth';

/**
 * Form Validation Schema
 */
const schema = z.object({
	email: z.string().email('You must enter a valid email').nonempty('You must enter an email')
});

type FormType = z.infer<typeof schema>;

const defaultValues: FormType = {
	email: ''
};

function SupabaseForgotPasswordForm() {
	const { resetPassword } = useSupabaseAuth();
	const dispatch = useAppDispatch();

	const { control, formState, handleSubmit, setError } = useForm<FormType>({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	async function onSubmit(formData: FormType) {
		const { email } = formData;

		const result = await resetPassword(email);

		if (result?.error) {
			const error = result.error;
			
			if (error.message.includes('Invalid email')) {
				setError('email', {
					type: 'manual',
					message: 'Please enter a valid email address'
				});
			} else {
				dispatch(showMessage({ message: error.message }));
			}
		} else if (result?.success) {
			dispatch(showMessage({ 
				message: 'Password reset email sent! Please check your inbox.',
				variant: 'success'
			}));
		}
	}

	return (
		<form
			name="forgotPasswordForm"
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

			<Button
				variant="contained"
				color="secondary"
				className="mt-4 w-full"
				aria-label="Send reset email"
				disabled={!isValid || !dirtyFields.email}
				type="submit"
				size="large"
			>
				Send password reset email
			</Button>
		</form>
	);
}

export default SupabaseForgotPasswordForm; 