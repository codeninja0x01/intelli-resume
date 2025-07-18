import FusePageSimple from '@fuse/core/FusePageSimple';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import { useEffect, useRef, useState } from 'react';
import useParams from '@fuse/hooks/useParams';
import Link from '@fuse/core/Link';
import { Step, StepContent, StepLabel } from '@mui/material';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import FuseLoading from '@fuse/core/FuseLoading';
import Error404Page from 'src/app/(public)/404/Error404Page';
import CourseInfo from '../CourseInfo';
import CourseProgress from '../CourseProgress';
import { useGetAcademyCourseQuery, useUpdateAcademyCourseMutation, useGetAcademyCourseStepsQuery } from '../AcademyApi';
import CourseStepContent from './CourseStepContent';

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
	dir?: string;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, dir, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`course-tabpanel-${index}`}
			aria-labelledby={`course-tab-${index}`}
			dir={dir}
			{...other}
			className="flex-auto"
		>
			{value === index && <Box className="h-full">{children}</Box>}
		</div>
	);
}

/**
 * The Course page.
 */
function Course() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const theme = useTheme();
	const pageLayout = useRef(null);
	const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
	const params = useParams();
	const { courseId } = params;

	const { data: course, isLoading } = useGetAcademyCourseQuery(
		{ courseId },
		{
			skip: !courseId
		}
	);
	const { data: courseSteps, isLoading: isCourseStepsLoading } = useGetAcademyCourseStepsQuery(
		{ courseId },
		{
			skip: !courseId
		}
	);
	const [updateCourse] = useUpdateAcademyCourseMutation();

	useEffect(() => {
		/**
		 * If the course is opened for the first time
		 * Change ActiveStep to 1
		 */
		if (course && course?.progress?.currentStep === 0) {
			updateCourse({
				courseId,
				data: { ...course, progress: { currentStep: 1, completed: 0 } }
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [course]);

	useEffect(() => {
		setLeftSidebarOpen(!isMobile);
	}, [isMobile]);

	const currentStep = course?.progress?.currentStep || 0;

	function updateCurrentStep(index: number) {
		if (course && (index > course.totalSteps || index < 0)) {
			return;
		}

		updateCourse({
			courseId,
			data: {
				...course,
				progress: {
					currentStep: index,
					completed: index === course.totalSteps ? 1 : course.progress.completed
				}
			}
		});
	}

	function handleNext() {
		updateCurrentStep(currentStep + 1);
	}

	function handleBack() {
		updateCurrentStep(currentStep - 1);
	}

	function handleStepChange(index: number) {
		updateCurrentStep(index + 1);
	}

	const activeStep = currentStep !== 0 ? currentStep : 1;

	if (isLoading || isCourseStepsLoading) {
		return <FuseLoading />;
	}

	if (!course) {
		return <Error404Page />;
	}

	return (
		<FusePageSimple
			content={
				<div className="flex flex-col min-h-full w-full relative">
					{!isMobile && (
						<CourseProgress
							className="sticky top-0 z-10"
							course={course}
						/>
					)}

					{isMobile && (
						<Paper
							className="flex sticky top-0 z-10 items-center w-full px-4 py-2 border-b-1 shadow-0"
							square
						>
							<IconButton
								to="/apps/academy/courses"
								component={Link}
							>
								<FuseSvgIcon>
									{theme.direction === 'ltr'
										? 'heroicons-outline:arrow-left'
										: 'heroicons-outline:arrow-right'}
								</FuseSvgIcon>
							</IconButton>

							<Typography className="text-md font-medium tracking-tight mx-2.5">
								{course.title}
							</Typography>
						</Paper>
					)}

					<div className="flex flex-col flex-auto w-full min-h-full">
						{courseSteps?.map((step, index) => (
							<TabPanel
								key={index}
								value={activeStep - 1}
								index={index}
								dir={theme.direction}
							>
								<div className="flex justify-center p-4 pb-16 sm:p-6 sm:pb-16 md:p-12 md:pb-24 min-h-full">
									<CourseStepContent step={step} />
								</div>
							</TabPanel>
						))}
					</div>

					{!isMobile && (
						<div className="flex justify-center w-full absolute bottom-0 left-0 right-0 p-4 pb-8 z-10">
							<ButtonGroup
								variant="contained"
								aria-label="Next and previous buttons"
								color="secondary"
							>
								<Button
									startIcon={<FuseSvgIcon>heroicons-outline:arrow-small-left</FuseSvgIcon>}
									onClick={handleBack}
								>
									Prev
								</Button>
								<Button className="pointer-events-none">{`${activeStep}/${course.totalSteps}`}</Button>
								<Button
									endIcon={<FuseSvgIcon>heroicons-outline:arrow-small-right</FuseSvgIcon>}
									onClick={handleNext}
								>
									Next
								</Button>
							</ButtonGroup>
						</div>
					)}

					{isMobile && (
						<Box
							sx={{ backgroundColor: 'background.paper' }}
							className="flex sticky bottom-0 z-10 items-center w-full p-4 border-t-1"
						>
							<IconButton
								onClick={() => setLeftSidebarOpen(true)}
								aria-label="open left sidebar"
								size="large"
							>
								<FuseSvgIcon>heroicons-outline:bars-3</FuseSvgIcon>
							</IconButton>

							<Typography className="mx-2">{`${activeStep}/${course.totalSteps}`}</Typography>

							<CourseProgress
								className="flex flex-1 mx-2"
								course={course}
							/>

							<IconButton onClick={handleBack}>
								<FuseSvgIcon>heroicons-outline:arrow-small-left</FuseSvgIcon>
							</IconButton>

							<IconButton onClick={handleNext}>
								<FuseSvgIcon>heroicons-outline:arrow-small-right</FuseSvgIcon>
							</IconButton>
						</Box>
					)}
				</div>
			}
			leftSidebarOpen={leftSidebarOpen}
			leftSidebarOnClose={() => {
				setLeftSidebarOpen(false);
			}}
			leftSidebarWidth={300}
			leftSidebarContent={
				<>
					<div className="p-8">
						<Button
							to="/apps/academy/courses"
							component={Link}
							className="mb-6"
							color="secondary"
							variant="text"
							startIcon={
								<FuseSvgIcon size={20}>
									{theme.direction === 'ltr'
										? 'heroicons-outline:arrow-small-left'
										: 'heroicons-outline:arrow-small-right'}
								</FuseSvgIcon>
							}
						>
							Back to courses
						</Button>

						<CourseInfo course={course} />
					</div>
					<Divider />
					<Stepper
						classes={{ root: 'p-8' }}
						activeStep={activeStep - 1}
						orientation="vertical"
					>
						{courseSteps?.map((step, index) => {
							return (
								<Step
									key={index}
									sx={{
										'& .MuiStepLabel-root, & .MuiStepContent-root': {
											cursor: 'pointer!important'
										},
										'& .MuiStepContent-root': {
											color: 'text.secondary',
											fontSize: 13
										}
									}}
									onClick={() => handleStepChange(step.order)}
									expanded
								>
									<StepLabel
										className="font-medium"
										sx={{
											'& .MuiSvgIcon-root': {
												color: 'background.default',
												'& .MuiStepIcon-text': {
													fill: (_theme) => _theme.vars.palette.text.secondary
												},
												'&.Mui-completed': {
													color: 'secondary.main',
													'& .MuiStepIcon-text ': {
														fill: (_theme) => _theme.vars.palette.secondary.contrastText
													}
												},
												'&.Mui-active': {
													color: 'secondary.main',
													'& .MuiStepIcon-text ': {
														fill: (_theme) => _theme.vars.palette.secondary.contrastText
													}
												}
											}
										}}
									>
										{step.title}
									</StepLabel>
									<StepContent>{step.subtitle}</StepContent>
								</Step>
							);
						})}
					</Stepper>
				</>
			}
			scroll="content"
			ref={pageLayout}
			contentScrollbarsProps={{
				scrollToTopOnChildChange: true
			}}
		/>
	);
}

export default Course;
