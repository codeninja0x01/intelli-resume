import FuseExample from '@fuse/core/FuseExample';
import FuseHighlight from '@fuse/core/FuseHighlight';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularIndeterminateComponent from '../components/progress/CircularIndeterminate';
import CircularIndeterminateRaw from '../components/progress/CircularIndeterminate.tsx?raw';
import CircularColorComponent from '../components/progress/CircularColor';
import CircularColorRaw from '../components/progress/CircularColor.tsx?raw';
import CircularSizeComponent from '../components/progress/CircularSize';
import CircularSizeRaw from '../components/progress/CircularSize.tsx?raw';
import CircularDeterminateComponent from '../components/progress/CircularDeterminate';
import CircularDeterminateRaw from '../components/progress/CircularDeterminate.tsx?raw';
import CircularIntegrationComponent from '../components/progress/CircularIntegration';
import CircularIntegrationRaw from '../components/progress/CircularIntegration.tsx?raw';
import CircularWithValueLabelComponent from '../components/progress/CircularWithValueLabel';
import CircularWithValueLabelRaw from '../components/progress/CircularWithValueLabel.tsx?raw';
import LinearIndeterminateComponent from '../components/progress/LinearIndeterminate';
import LinearIndeterminateRaw from '../components/progress/LinearIndeterminate.tsx?raw';
import LinearColorComponent from '../components/progress/LinearColor';
import LinearColorRaw from '../components/progress/LinearColor.tsx?raw';
import LinearDeterminateComponent from '../components/progress/LinearDeterminate';
import LinearDeterminateRaw from '../components/progress/LinearDeterminate.tsx?raw';
import LinearBufferComponent from '../components/progress/LinearBuffer';
import LinearBufferRaw from '../components/progress/LinearBuffer.tsx?raw';
import LinearWithValueLabelComponent from '../components/progress/LinearWithValueLabel';
import LinearWithValueLabelRaw from '../components/progress/LinearWithValueLabel.tsx?raw';
import CustomizedProgressBarsComponent from '../components/progress/CustomizedProgressBars';
import CustomizedProgressBarsRaw from '../components/progress/CustomizedProgressBars.tsx?raw';
import DelayingAppearanceComponent from '../components/progress/DelayingAppearance';
import DelayingAppearanceRaw from '../components/progress/DelayingAppearance.tsx?raw';
import CircularUnderLoadComponent from '../components/progress/CircularUnderLoad';
import CircularUnderLoadRaw from '../components/progress/CircularUnderLoad.tsx?raw';

function ProgressDoc(props) {
	// @ts-ignore
	// @ts-ignore
	return (
		<>
			<Button
				className="normal-case absolute right-0 not-prose"
				variant="contained"
				color="secondary"
				component="a"
				href="https://mui.com/components/progress"
				target="_blank"
				role="button"
				size="small"
				startIcon={<FuseSvgIcon size={16}>heroicons-outline:arrow-top-right-on-square</FuseSvgIcon>}
			>
				Reference
			</Button>
			<Typography
				className="text-5xl my-4 font-bold"
				component="h1"
			>
				Progress
			</Typography>
			<Typography className="description">
				Progress indicators commonly known as spinners, express an unspecified wait time or display the length
				of a process.
			</Typography>

			<Typography
				className="text-base mb-8"
				component="div"
			>
				Progress indicators inform users about the status of ongoing processes, such as loading an app,
				submitting a form, or saving updates.
			</Typography>
			<ul className="space-y-4">
				<li>
					<strong>Determinate</strong> indicators display how long an operation will take.
				</li>
				<li>
					<strong>Indeterminate</strong> indicators visualize an unspecified wait time.
				</li>
			</ul>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				The animations of the components rely on CSS as much as possible to work even before the JavaScript is
				loaded.
			</Typography>
			<Typography
				className="text-3xl mt-6 mb-2.5 font-bold"
				component="h2"
			>
				Circular
			</Typography>
			<Typography
				className="text-lg mt-5 mb-2.5 font-bold"
				component="h3"
			>
				Circular indeterminate
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="CircularIndeterminate.js"
					className="my-4"
					iframe={false}
					component={CircularIndeterminateComponent}
					raw={CircularIndeterminateRaw}
				/>
			</Typography>
			<Typography
				className="text-lg mt-5 mb-2.5 font-bold"
				component="h3"
			>
				Circular color
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="CircularColor.js"
					className="my-4"
					iframe={false}
					component={CircularColorComponent}
					raw={CircularColorRaw}
				/>
			</Typography>
			<Typography
				className="text-lg mt-5 mb-2.5 font-bold"
				component="h3"
			>
				Circular size
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="CircularSize.js"
					className="my-4"
					iframe={false}
					component={CircularSizeComponent}
					raw={CircularSizeRaw}
				/>
			</Typography>
			<Typography
				className="text-lg mt-5 mb-2.5 font-bold"
				component="h3"
			>
				Circular determinate
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="CircularDeterminate.js"
					className="my-4"
					iframe={false}
					component={CircularDeterminateComponent}
					raw={CircularDeterminateRaw}
				/>
			</Typography>
			<Typography
				className="text-lg mt-5 mb-2.5 font-bold"
				component="h3"
			>
				Interactive integration
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="CircularIntegration.js"
					className="my-4"
					iframe={false}
					component={CircularIntegrationComponent}
					raw={CircularIntegrationRaw}
				/>
			</Typography>
			<Typography
				className="text-lg mt-5 mb-2.5 font-bold"
				component="h3"
			>
				Circular with label
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="CircularWithValueLabel.js"
					className="my-4"
					iframe={false}
					component={CircularWithValueLabelComponent}
					raw={CircularWithValueLabelRaw}
				/>
			</Typography>
			<Typography
				className="text-3xl mt-6 mb-2.5 font-bold"
				component="h2"
			>
				Linear
			</Typography>
			<Typography
				className="text-lg mt-5 mb-2.5 font-bold"
				component="h3"
			>
				Linear indeterminate
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="LinearIndeterminate.js"
					className="my-4"
					iframe={false}
					component={LinearIndeterminateComponent}
					raw={LinearIndeterminateRaw}
				/>
			</Typography>
			<Typography
				className="text-lg mt-5 mb-2.5 font-bold"
				component="h3"
			>
				Linear color
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="LinearColor.js"
					className="my-4"
					iframe={false}
					component={LinearColorComponent}
					raw={LinearColorRaw}
				/>
			</Typography>
			<Typography
				className="text-lg mt-5 mb-2.5 font-bold"
				component="h3"
			>
				Linear determinate
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="LinearDeterminate.js"
					className="my-4"
					iframe={false}
					component={LinearDeterminateComponent}
					raw={LinearDeterminateRaw}
				/>
			</Typography>
			<Typography
				className="text-lg mt-5 mb-2.5 font-bold"
				component="h3"
			>
				Linear buffer
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="LinearBuffer.js"
					className="my-4"
					iframe={false}
					component={LinearBufferComponent}
					raw={LinearBufferRaw}
				/>
			</Typography>
			<Typography
				className="text-lg mt-5 mb-2.5 font-bold"
				component="h3"
			>
				Linear with label
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="LinearWithValueLabel.js"
					className="my-4"
					iframe={false}
					component={LinearWithValueLabelComponent}
					raw={LinearWithValueLabelRaw}
				/>
			</Typography>
			<Typography
				className="text-3xl mt-6 mb-2.5 font-bold"
				component="h2"
			>
				Non-standard ranges
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				The progress components accept a value in the range 0 - 100. This simplifies things for screen-reader
				users, where these are the default min / max values. Sometimes, however, you might be working with a
				data source where the values fall outside this range. Here&#39;s how you can easily transform a value in
				any range to a scale of 0 - 100:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{` 
// MIN = Minimum expected value
// MAX = Maximum expected value
// Function to normalise the values (MIN / MAX could be integrated)
const normalise = (value) => ((value - MIN) * 100) / (MAX - MIN);

// Example component that utilizes the \`normalise\` function at the point of render.
function Progress(props) {
  return (
    <React.Fragment>
      <CircularProgress variant="determinate" value={normalise(props.value)} />
      <LinearProgress variant="determinate" value={normalise(props.value)} />
    </React.Fragment>
  );
}
`}
			</FuseHighlight>
			<Typography
				className="text-3xl mt-6 mb-2.5 font-bold"
				component="h2"
			>
				Customization
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				Here are some examples of customizing the component. You can learn more about this in the{' '}
				<a href="/material-ui/customization/how-to-customize/">overrides documentation page</a>.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="CustomizedProgressBars.js"
					className="my-4"
					iframe={false}
					component={CustomizedProgressBarsComponent}
					raw={CustomizedProgressBarsRaw}
				/>
			</Typography>
			<Typography
				className="text-3xl mt-6 mb-2.5 font-bold"
				component="h2"
			>
				Delaying appearance
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				There are{' '}
				<a href="https://www.nngroup.com/articles/response-times-3-important-limits/">3 important limits</a> to
				know around response time. The ripple effect of the <code>ButtonBase</code> component ensures that the
				user feels that the UI is reacting instantaneously. Normally, no special feedback is necessary during
				delays of more than 0.1 but less than 1.0 second. After 1.0 second, you can display a loader to keep
				user&#39;s flow of thought uninterrupted.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="DelayingAppearance.js"
					className="my-4"
					iframe={false}
					component={DelayingAppearanceComponent}
					raw={DelayingAppearanceRaw}
				/>
			</Typography>
			<Typography
				className="text-3xl mt-6 mb-2.5 font-bold"
				component="h2"
			>
				Limitations
			</Typography>
			<Typography
				className="text-lg mt-5 mb-2.5 font-bold"
				component="h3"
			>
				High CPU load
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				Under heavy load, you might lose the stroke dash animation or see random <code>CircularProgress</code>{' '}
				ring widths. You should run processor intensive operations in a web worker or by batch in order not to
				block the main rendering thread.
			</Typography>
			<video
				autoPlay
				muted
				loop
				width="1082"
				height="158"
			>
				<source
					src="/material-ui-static/material-ui/react-components/progress-heavy-load.mp4"
					type="video/mp4"
				/>
			</video>

			<Typography
				className="text-base mb-8"
				component="div"
			>
				When it&#39;s not possible, you can leverage the <code>disableShrink</code> prop to mitigate the issue.
				See <a href="https://github.com/mui/material-ui/issues/10327">this issue</a>.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="CircularUnderLoad.js"
					className="my-4"
					iframe={false}
					component={CircularUnderLoadComponent}
					raw={CircularUnderLoadRaw}
				/>
			</Typography>
			<Typography
				className="text-lg mt-5 mb-2.5 font-bold"
				component="h3"
			>
				High frequency updates
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				The <code>LinearProgress</code> uses a transition on the CSS transform property to provide a smooth
				update between different values. The default transition duration is 200ms. In the event a parent
				component updates the <code>value</code> prop too quickly, you will at least experience a 200ms delay
				between the re-render and the progress bar fully updated.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				If you need to perform 30 re-renders per second or more, we recommend disabling the transition:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-css"
			>
				{` 
.MuiLinearProgress-bar {
  transition: none;
}
`}
			</FuseHighlight>
		</>
	);
}

export default ProgressDoc;
