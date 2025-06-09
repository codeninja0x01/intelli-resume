import React from 'react';
import { useNavigate } from 'react-router';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useOnboarding } from '@auth/useOnboarding';
import PageTitle from 'src/components/PageTitle';

const StyledCard = styled(Card)(({ theme }) => ({
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
	border: `2px solid ${theme.palette.divider}`,
	borderRadius: theme.spacing(2),
	'&:hover': {
		transform: 'translateY(-4px)',
		boxShadow: theme.shadows[8],
		borderColor: theme.palette.primary.main,
	},
}));

const ActionCard = styled(StyledCard)(({ theme }) => ({
	textAlign: 'center',
	padding: theme.spacing(3),
	minHeight: '280px',
}));

const IconContainer = styled(Box)(({ theme }) => ({
	width: 80,
	height: 80,
	borderRadius: '50%',
	backgroundColor: theme.palette.grey[100],
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	margin: '0 auto 24px auto',
	[theme.getColorSchemeSelector('dark')]: {
		backgroundColor: theme.palette.grey[800],
	},
}));

const FeatureItem = styled(Box)(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	gap: theme.spacing(1),
	'& .MuiSvgIcon-root': {
		color: theme.palette.success.main,
	},
}));

/**
 * The welcome page for first-time users
 */
function WelcomePage() {
	const navigate = useNavigate();
	const { completeUserOnboarding, isCompleting } = useOnboarding();

	const handleUploadCV = () => {
		// TODO: Implement file upload functionality
		console.log('Upload CV clicked');
		// For now, just complete onboarding and navigate
		handleGetStarted();
	};

	const handleConnectGitHub = () => {
		// TODO: Implement GitHub integration
		console.log('Connect GitHub clicked');
		// For now, just complete onboarding and navigate
		handleGetStarted();
	};

	const handleCreateManually = () => {
		// Navigate to manual CV creation
		handleGetStarted();
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

	const actionCards = [
		{
			id: 'upload',
			title: 'Upload Your CV',
			description: 'Upload your existing CV in PDF, DOC, or DOCX format and we will help you enhance it',
			icon: 'heroicons-outline:arrow-up-tray',
			buttonText: 'Choose File',
			onClick: handleUploadCV,
		},
		{
			id: 'github',
			title: 'Import from GitHub',
			description: 'Connect your GitHub profile and automatically import your professional information',
			icon: 'heroicons-outline:code-bracket',
			buttonText: 'Connect GitHub',
			onClick: handleConnectGitHub,
		},
		{
			id: 'manual',
			title: 'Create Manually',
			description: 'Start from scratch and build your CV step by step with our guided process',
			icon: 'heroicons-outline:document-text',
			buttonText: 'Start Building',
			onClick: handleCreateManually,
		},
	];

	const features = [
		'Professional templates',
		'ATS-friendly format',
		'Export in multiple formats',
		'Real-time preview',
	];

	return (
		<Container maxWidth="lg" className="py-8">
			<Box className="text-center mb-12">
				<PageTitle
					title="Let's create your perfect CV - choose how you'd like to get started."
					className="mb-8 text-center"
				/>
			</Box>

			{/* Action Cards */}
			<Box
			className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 rounded-full">
				{actionCards.map((card) => (
					<ActionCard key={card.id}>
						<CardContent className="flex-1">
							<IconContainer>
								<FuseSvgIcon size={40} color="primary">
									{card.icon}
								</FuseSvgIcon>
							</IconContainer>
							
							<Typography variant="h5" className="font-bold mb-3">
								{card.title}
							</Typography>
							
							<Typography 
								variant="body1" 
								color="text.secondary"
								className="mb-6"
							>
								{card.description}
							</Typography>
						</CardContent>
						
						<CardActions className="justify-center pb-6">
							<Button
								variant="contained"
								size="large"
								onClick={card.onClick}
								disabled={isCompleting}
								startIcon={
									card.id === 'upload' && (
										<FuseSvgIcon size={20}>heroicons-outline:arrow-up-tray</FuseSvgIcon>
									)
								}
								className="min-w-40"
							>
								{card.buttonText}
							</Button>
						</CardActions>
					</ActionCard>
				))}
			</Box>

			{/* Bottom Content */}
			<Box className="text-center">
				<Typography variant="body1" color="text.secondary" className="mb-6">
					Join thousands of professionals who have created stunning CVs with our platform
				</Typography>
				
				{/* Feature List */}
				<Box className="flex flex-wrap justify-center gap-6">
					{features.map((feature, index) => (
						<FeatureItem key={index}>
							<FuseSvgIcon size={20}>heroicons-solid:check</FuseSvgIcon>
							<Typography variant="body2" color="text.secondary">
								{feature}
							</Typography>
						</FeatureItem>
					))}
				</Box>
			</Box>
		</Container>
	);
}

export default WelcomePage; 