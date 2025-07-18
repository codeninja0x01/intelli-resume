import FuseExample from '@fuse/core/FuseExample';
import FuseHighlight from '@fuse/core/FuseHighlight';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import BasicButtonsComponent from '../components/buttons/BasicButtons';
import BasicButtonsRaw from '../components/buttons/BasicButtons.tsx?raw';
import TextButtonsComponent from '../components/buttons/TextButtons';
import TextButtonsRaw from '../components/buttons/TextButtons.tsx?raw';
import ContainedButtonsComponent from '../components/buttons/ContainedButtons';
import ContainedButtonsRaw from '../components/buttons/ContainedButtons.tsx?raw';
import DisableElevationComponent from '../components/buttons/DisableElevation';
import DisableElevationRaw from '../components/buttons/DisableElevation.tsx?raw';
import OutlinedButtonsComponent from '../components/buttons/OutlinedButtons';
import OutlinedButtonsRaw from '../components/buttons/OutlinedButtons.tsx?raw';
import ColorButtonsComponent from '../components/buttons/ColorButtons';
import ColorButtonsRaw from '../components/buttons/ColorButtons.tsx?raw';
import ButtonSizesComponent from '../components/buttons/ButtonSizes';
import ButtonSizesRaw from '../components/buttons/ButtonSizes.tsx?raw';
import IconLabelButtonsComponent from '../components/buttons/IconLabelButtons';
import IconLabelButtonsRaw from '../components/buttons/IconLabelButtons.tsx?raw';
import IconButtonsComponent from '../components/buttons/IconButtons';
import IconButtonsRaw from '../components/buttons/IconButtons.tsx?raw';
import IconButtonSizesComponent from '../components/buttons/IconButtonSizes';
import IconButtonSizesRaw from '../components/buttons/IconButtonSizes.tsx?raw';
import IconButtonColorsComponent from '../components/buttons/IconButtonColors';
import IconButtonColorsRaw from '../components/buttons/IconButtonColors.tsx?raw';
import LoadingIconButtonComponent from '../components/buttons/LoadingIconButton';
import LoadingIconButtonRaw from '../components/buttons/LoadingIconButton.tsx?raw';
import IconButtonWithBadgeComponent from '../components/buttons/IconButtonWithBadge';
import IconButtonWithBadgeRaw from '../components/buttons/IconButtonWithBadge.tsx?raw';
import InputFileUploadComponent from '../components/buttons/InputFileUpload';
import InputFileUploadRaw from '../components/buttons/InputFileUpload.tsx?raw';
import LoadingButtonsComponent from '../components/buttons/LoadingButtons';
import LoadingButtonsRaw from '../components/buttons/LoadingButtons.tsx?raw';
import LoadingButtonsTransitionComponent from '../components/buttons/LoadingButtonsTransition';
import LoadingButtonsTransitionRaw from '../components/buttons/LoadingButtonsTransition.tsx?raw';
import CustomizedButtonsComponent from '../components/buttons/CustomizedButtons';
import CustomizedButtonsRaw from '../components/buttons/CustomizedButtons.tsx?raw';
import ButtonBaseDemoComponent from '../components/buttons/ButtonBaseDemo';
import ButtonBaseDemoRaw from '../components/buttons/ButtonBaseDemo.tsx?raw';

function ButtonsDoc(props) {
	return (
		<>
			<Button
				className="normal-case absolute right-0 not-prose"
				variant="contained"
				color="secondary"
				component="a"
				href="https://mui.com/components/buttons"
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
				Button
			</Typography>
			<Typography className="description">
				Buttons allow users to take actions, and make choices, with a single tap.
			</Typography>

			<Typography
				className="text-base mb-8"
				component="div"
			>
				Buttons communicate actions that users can take. They are typically placed throughout your UI, in places
				like:
			</Typography>
			<ul className="space-y-4">
				<li>Modal windows</li>
				<li>Forms</li>
				<li>Cards</li>
				<li>Toolbars</li>
			</ul>
			<Typography
				className="text-3xl mt-6 mb-2.5 font-bold"
				component="h2"
			>
				Basic button
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				The <code>Button</code> comes with three variants: text (default), contained, and outlined.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="BasicButtons.js"
					className="my-4"
					iframe={false}
					component={BasicButtonsComponent}
					raw={BasicButtonsRaw}
				/>
			</Typography>
			<Typography
				className="text-lg mt-5 mb-2.5 font-bold"
				component="h3"
			>
				Text button
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<a href="https://m2.material.io/components/buttons#text-button">Text buttons</a>
				are typically used for less-pronounced actions, including those located: in dialogs, in cards. In cards,
				text buttons help maintain an emphasis on card content.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="TextButtons.js"
					className="my-4"
					iframe={false}
					component={TextButtonsComponent}
					raw={TextButtonsRaw}
				/>
			</Typography>
			<Typography
				className="text-lg mt-5 mb-2.5 font-bold"
				component="h3"
			>
				Contained button
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<a href="https://m2.material.io/components/buttons#contained-button">Contained buttons</a>
				are high-emphasis, distinguished by their use of elevation and fill. They contain actions that are
				primary to your app.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="ContainedButtons.js"
					className="my-4"
					iframe={false}
					component={ContainedButtonsComponent}
					raw={ContainedButtonsRaw}
				/>
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				You can remove the elevation with the <code>disableElevation</code> prop.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="DisableElevation.js"
					className="my-4"
					iframe={false}
					component={DisableElevationComponent}
					raw={DisableElevationRaw}
				/>
			</Typography>
			<Typography
				className="text-lg mt-5 mb-2.5 font-bold"
				component="h3"
			>
				Outlined button
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<a href="https://m2.material.io/components/buttons#outlined-button">Outlined buttons</a> are
				medium-emphasis buttons. They contain actions that are important but aren&#39;t the primary action in an
				app.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				Outlined buttons are also a lower emphasis alternative to contained buttons, or a higher emphasis
				alternative to text buttons.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="OutlinedButtons.js"
					className="my-4"
					iframe={false}
					component={OutlinedButtonsComponent}
					raw={OutlinedButtonsRaw}
				/>
			</Typography>
			<Typography
				className="text-3xl mt-6 mb-2.5 font-bold"
				component="h2"
			>
				Handling clicks
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				All components accept an <code>onClick</code> handler that is applied to the root DOM element.
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{` 
<Button
  onClick={() => {
    alert('clicked');
  
>
  Click me
</Button>
`}
			</FuseHighlight>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				Note that the documentation <a href="/material-ui/guides/api/#native-properties">avoids</a> mentioning
				native props (there are a lot) in the API section of the components.
			</Typography>
			<Typography
				className="text-3xl mt-6 mb-2.5 font-bold"
				component="h2"
			>
				Color
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="ColorButtons.js"
					className="my-4"
					iframe={false}
					component={ColorButtonsComponent}
					raw={ColorButtonsRaw}
				/>
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				In addition to using the default button colors, you can add custom ones, or disable any you don&#39;t
				need. See the <a href="/material-ui/customization/palette/#custom-colors">Adding new colors</a> examples
				for more info.
			</Typography>
			<Typography
				className="text-3xl mt-6 mb-2.5 font-bold"
				component="h2"
			>
				Sizes
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				For larger or smaller buttons, use the <code>size</code> prop.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="ButtonSizes.js"
					className="my-4"
					iframe={false}
					component={ButtonSizesComponent}
					raw={ButtonSizesRaw}
				/>
			</Typography>
			<Typography
				className="text-3xl mt-6 mb-2.5 font-bold"
				component="h2"
			>
				Buttons with icons and label
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				Sometimes you might want to have icons for certain buttons to enhance the UX of the application as we
				recognize logos more easily than plain text. For example, if you have a delete button you can label it
				with a dustbin icon.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="IconLabelButtons.js"
					className="my-4"
					iframe={false}
					component={IconLabelButtonsComponent}
					raw={IconLabelButtonsRaw}
				/>
			</Typography>
			<Typography
				className="text-3xl mt-6 mb-2.5 font-bold"
				component="h2"
			>
				Icon button
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				Icon buttons are commonly found in app bars and toolbars.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				Icons are also appropriate for toggle buttons that allow a single choice to be selected or deselected,
				such as adding or removing a star to an item.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="IconButtons.js"
					className="my-4"
					iframe={false}
					component={IconButtonsComponent}
					raw={IconButtonsRaw}
				/>
			</Typography>
			<Typography
				className="text-lg mt-5 mb-2.5 font-bold"
				component="h3"
			>
				Sizes
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				For larger or smaller icon buttons, use the <code>size</code> prop.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="IconButtonSizes.js"
					className="my-4"
					iframe={false}
					component={IconButtonSizesComponent}
					raw={IconButtonSizesRaw}
				/>
			</Typography>
			<Typography
				className="text-lg mt-5 mb-2.5 font-bold"
				component="h3"
			>
				Colors
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				Use <code>color</code> prop to apply theme color palette to component.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="IconButtonColors.js"
					className="my-4"
					iframe={false}
					component={IconButtonColorsComponent}
					raw={IconButtonColorsRaw}
				/>
			</Typography>
			<Typography
				className="text-lg mt-5 mb-2.5 font-bold"
				component="h3"
			>
				Loading
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				Starting from v6.4.0, use <code>loading</code> prop to set icon buttons in a loading state and disable
				interactions.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="LoadingIconButton.js"
					className="my-4"
					iframe={false}
					component={LoadingIconButtonComponent}
					raw={LoadingIconButtonRaw}
				/>
			</Typography>
			<Typography
				className="text-lg mt-5 mb-2.5 font-bold"
				component="h3"
			>
				Badge
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				You can use the{' '}
				<a href="/material-ui/react-badge/">
					<code>Badge</code>
				</a>{' '}
				component to add a badge to an <code>IconButton</code>.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="IconButtonWithBadge.js"
					className="my-4"
					iframe={false}
					component={IconButtonWithBadgeComponent}
					raw={IconButtonWithBadgeRaw}
				/>
			</Typography>
			<Typography
				className="text-3xl mt-6 mb-2.5 font-bold"
				component="h2"
			>
				File upload
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				To create a file upload button, turn the button into a label using <code>{`component="label"`}</code>{' '}
				and then create a visually-hidden input with type <code>file</code>.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="InputFileUpload.js"
					className="my-4"
					iframe={false}
					component={InputFileUploadComponent}
					raw={InputFileUploadRaw}
				/>
			</Typography>
			<Typography
				className="text-3xl mt-6 mb-2.5 font-bold"
				component="h2"
			>
				Loading
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				Starting from v6.4.0, use the <code>loading</code> prop to set buttons in a loading state and disable
				interactions.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="LoadingButtons.js"
					className="my-4"
					iframe={false}
					component={LoadingButtonsComponent}
					raw={LoadingButtonsRaw}
				/>
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				Toggle the loading switch to see the transition between the different states.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="LoadingButtonsTransition.js"
					className="my-4"
					iframe={false}
					component={LoadingButtonsTransitionComponent}
					raw={LoadingButtonsTransitionRaw}
				/>
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				:::warning When the <code>loading</code> prop is set to <code>boolean</code>, the loading wrapper is
				always present in the DOM to prevent a{' '}
				<a href="https://github.com/mui/material-ui/issues/27853">Google Translation Crash</a>.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				The <code>loading</code> value should always be <code>null</code> or <code>boolean</code>. The pattern
				below is not recommended as it can cause the Google Translation crash:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{` 
<Button {...(isFetching && { loading: true })}> // ❌ Don't do this
`}
			</FuseHighlight>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				:::
			</Typography>
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
					name="CustomizedButtons.js"
					className="my-4"
					iframe={false}
					component={CustomizedButtonsComponent}
					raw={CustomizedButtonsRaw}
				/>
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				🎨 If you are looking for inspiration, you can check{' '}
				<a href="https://mui-treasury.com/?path=/docs/button-introduction--docs">
					MUI Treasury&#39;s customization examples
				</a>
				.
			</Typography>
			<Typography
				className="text-3xl mt-6 mb-2.5 font-bold"
				component="h2"
			>
				Complex button
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				The Text Buttons, Contained Buttons, Floating Action Buttons and Icon Buttons are built on top of the
				same component: the <code>ButtonBase</code>. You can take advantage of this lower-level component to
				build custom interactions.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="ButtonBaseDemo.js"
					className="my-4"
					iframe={false}
					component={ButtonBaseDemoComponent}
					raw={ButtonBaseDemoRaw}
				/>
			</Typography>
			<Typography
				className="text-3xl mt-6 mb-2.5 font-bold"
				component="h2"
			>
				Third-party routing library
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				One frequent use case is to perform navigation on the client only, without an HTTP round-trip to the
				server. The <code>ButtonBase</code> component provides the <code>component</code> prop to handle this
				use case. Here is a <a href="/material-ui/integrations/routing/#button">more detailed guide</a>.
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
				Cursor not-allowed
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				The ButtonBase component sets <code>pointer-events: none;</code> on disabled buttons, which prevents the
				appearance of a disabled cursor.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				If you wish to use <code>not-allowed</code>, you have two options:
			</Typography>
			<ol>
				<li>
					<strong>CSS only</strong>. You can remove the pointer-events style on the disabled state of the{' '}
					<code>{`<button>`}</code> element:
				</li>
			</ol>

			<FuseHighlight
				component="pre"
				className="language-css"
			>
				{` 
.MuiButtonBase-root:disabled {
  cursor: not-allowed;
  pointer-events: auto;
}
`}
			</FuseHighlight>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				However:
			</Typography>
			<ul className="space-y-4">
				<li>
					You should add <code>pointer-events: none;</code> back when you need to display{' '}
					<a href="/material-ui/react-tooltip/#disabled-elements">tooltips on disabled elements</a>.
				</li>
				<li>
					The cursor won&#39;t change if you render something other than a button element, for instance, a
					link <code>{`<a>`}</code> element.
				</li>
			</ul>
			<ol start={2}>
				<li>
					<strong>DOM change</strong>. You can wrap the button:
				</li>
			</ol>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{` 
<span style={{ cursor: 'not-allowed' }}>
  <Button component={Link} disabled>
    disabled
  </Button>
</span>
`}
			</FuseHighlight>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				This has the advantage of supporting any element, for instance, a link <code>{`<a>`}</code> element.
			</Typography>
		</>
	);
}

export default ButtonsDoc;
