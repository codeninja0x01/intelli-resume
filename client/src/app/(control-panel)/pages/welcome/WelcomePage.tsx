import React from 'react';
import { useNavigate } from 'react-router';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { styled } from '@mui/material/styles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useOnboarding } from '@auth/useOnboarding';

const StyledCard = styled(Card)(({ theme }) => ({
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
	'&:hover': {
		transform: 'translateY(-4px)',
		boxShadow: theme.shadows[8],
	},
}));

const steps = [
	{
		label: 'Welcome to Intelli Resume',
		title: 'Get Started with Your Professional Journey',
		description: 'Create stunning resumes with AI-powered assistance and land your dream job.',
		icon: 'heroicons-outline:sparkles'
	},
	{
		label: 'Explore Features',
		title: 'Discover What You Can Do',
		description: 'Build resumes, track applications, and get personalized recommendations.',
		icon: 'heroicons-outline:rocket-launch'
	},
	{
		label: 'Get Help',
		title: 'Need Assistance?',
		description: 'Access our help center, tutorials, and support whenever you need it.',
		icon: 'heroicons-outline:question-mark-circle'
	},
	{
		label: 'Start Building',
		title: 'Ready to Begin?',
		description: 'Jump into the dashboard and start creating your professional resume.',
		icon: 'heroicons-outline:document-text'
	}
];

const features = [
	{
		title: 'AI-Powered Resume Builder',
		description: 'Create professional resumes with intelligent suggestions and formatting.',
		icon: 'heroicons-outline:cpu-chip',
		color: 'primary'
	},
	{
		title: 'Application Tracking',
		description: 'Keep track of your job applications and interview progress.',
		icon: 'heroicons-outline:chart-bar',
		color: 'secondary'
	},
	{
		title: 'Template Library',
		description: 'Choose from a variety of professional resume templates.',
		icon: 'heroicons-outline:document-duplicate',
		color: 'success'
	}
];

/**
 * The welcome page for first-time users
 */
function WelcomePage() {
	const navigate = useNavigate();
	const { completeUserOnboarding, isCompleting } = useOnboarding();
	const [activeStep, setActiveStep] = React.useState(0);

	const handleNext = () => {
		if (activeStep < steps.length - 1) {
			setActiveStep((prevStep) => prevStep + 1);
		} else {
			handleGetStarted();
		}
	};

	const handleBack = () => {
		setActiveStep((prevStep) => prevStep - 1);
	};

	const handleGetStarted = async () => {
		try {
			await completeUserOnboarding();
			navigate('/dashboards/project');
		} catch (error) {
			console.error('Error completing onboarding:', error);
			// Still navigate even if onboarding completion fails
			navigate('/dashboards/project');
		}
	};



	const currentStep = steps[activeStep];

	return (
		<div className="flex min-w-0 flex-auto flex-col items-center justify-center p-4 md:p-8">
			<Paper className="flex min-h-full w-full max-w-6xl overflow-hidden rounded-xl shadow-lg">
				{/* Left Panel - Content */}
				<div className="w-full p-8 md:w-1/2 lg:p-12">
					<div className="mx-auto max-w-md">
						<img
							className="w-12 mb-8"
							src="/assets/images/logo/logo.svg"
							alt="logo"
						/>

						<Stepper activeStep={activeStep} className="mb-8">
							{steps.map((step, index) => (
								<Step key={step.label}>
									<StepLabel className="text-sm">{step.label}</StepLabel>
								</Step>
							))}
						</Stepper>

						<div className="mb-8">
							<Box className="flex items-center mb-4">
								<FuseSvgIcon 
									className="text-4xl mr-3" 
									color="primary"
								>
									{currentStep.icon}
								</FuseSvgIcon>
								<Typography className="text-3xl font-extrabold leading-tight">
									{currentStep.title}
								</Typography>
							</Box>
							<Typography className="text-lg text-gray-600">
								{currentStep.description}
							</Typography>
						</div>

						{activeStep === 1 && (
							<div className="mb-8 space-y-4">
								{features.map((feature, index) => (
									<div key={index} className="flex items-start space-x-3">
										<FuseSvgIcon 
											className="text-xl mt-1" 
											color={feature.color as any}
										>
											{feature.icon}
										</FuseSvgIcon>
										<div>
											<Typography className="font-semibold">
												{feature.title}
											</Typography>
											<Typography className="text-sm text-gray-600">
												{feature.description}
											</Typography>
										</div>
									</div>
								))}
							</div>
						)}

						<div className="flex justify-end items-center">
							<div className="space-x-2">
								{activeStep > 0 && (
									<Button
										onClick={handleBack}
										variant="outlined"
									>
										Back
									</Button>
								)}
								<Button
									onClick={handleNext}
									variant="contained"
									color="primary"
									disabled={isCompleting}
									className="min-w-24"
								>
									{activeStep === steps.length - 1 ? 'Get Started' : 'Next'}
								</Button>
							</div>
						</div>
					</div>
				</div>

				{/* Right Panel - Visual */}
				<Box
					className="relative hidden md:flex md:w-1/2 items-center justify-center p-8 lg:p-12"
					sx={{ backgroundColor: 'primary.dark', color: 'primary.contrastText' }}
				>
					{/* Background Pattern */}
					<svg
						className="pointer-events-none absolute inset-0"
						viewBox="0 0 960 540"
						width="100%"
						height="100%"
						preserveAspectRatio="xMidYMax slice"
						xmlns="http://www.w3.org/2000/svg"
					>
						<Box
							component="g"
							className="opacity-5"
							fill="none"
							stroke="currentColor"
							strokeWidth="100"
						>
							<circle r="234" cx="196" cy="23" />
							<circle r="234" cx="790" cy="491" />
						</Box>
					</svg>

					{/* Dots Pattern */}
					<Box
						component="svg"
						className="absolute -right-16 -top-16 opacity-20"
						sx={{ color: 'primary.light' }}
						viewBox="0 0 220 192"
						width="220px"
						height="192px"
						fill="none"
					>
						<defs>
							<pattern
								id="welcome-pattern"
								x="0"
								y="0"
								width="20"
								height="20"
								patternUnits="userSpaceOnUse"
							>
								<rect
									x="0"
									y="0"
									width="4"
									height="4"
									fill="currentColor"
								/>
							</pattern>
						</defs>
						<rect
							width="220"
							height="192"
							fill="url(#welcome-pattern)"
						/>
					</Box>

					{/* Main Content */}
					<div className="relative z-10 w-full max-w-md text-center">
						<div className="text-6xl font-bold leading-none text-gray-100 mb-6">
							<div>Welcome to</div>
							<div>Your Future</div>
						</div>
						<div className="text-lg leading-6 tracking-tight text-gray-400 mb-8">
							Build professional resumes with AI assistance and take the next step in your career journey.
						</div>
						
						{/* Feature Cards */}
						<div className="grid gap-4">
							{features.slice(0, 2).map((feature, index) => (
								<StyledCard 
									key={index}
									className="bg-white/10 backdrop-blur-sm border border-white/20"
								>
									<CardContent className="pb-2">
										<Box className="flex items-center mb-2">
											<FuseSvgIcon 
												className="text-2xl mr-2" 
												sx={{ color: 'primary.light' }}
											>
												{feature.icon}
											</FuseSvgIcon>
											<Typography className="font-semibold text-white">
												{feature.title}
											</Typography>
										</Box>
										<Typography className="text-sm text-gray-300">
											{feature.description}
										</Typography>
									</CardContent>
								</StyledCard>
							))}
						</div>
					</div>
				</Box>
			</Paper>
		</div>
	);
}

export default WelcomePage; 