import FuseExample from '@fuse/core/FuseExample';
import FuseHighlight from '@fuse/core/FuseHighlight';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import BasicListComponent from '../components/lists/BasicList';
import BasicListRaw from '../components/lists/BasicList.tsx?raw';
import NestedListComponent from '../components/lists/NestedList';
import NestedListRaw from '../components/lists/NestedList.tsx?raw';
import FolderListComponent from '../components/lists/FolderList';
import FolderListRaw from '../components/lists/FolderList.tsx?raw';
import InteractiveListComponent from '../components/lists/InteractiveList';
import InteractiveListRaw from '../components/lists/InteractiveList.tsx?raw';
import SelectedListItemComponent from '../components/lists/SelectedListItem';
import SelectedListItemRaw from '../components/lists/SelectedListItem.tsx?raw';
import AlignItemsListComponent from '../components/lists/AlignItemsList';
import AlignItemsListRaw from '../components/lists/AlignItemsList.tsx?raw';
import CheckboxListComponent from '../components/lists/CheckboxList';
import CheckboxListRaw from '../components/lists/CheckboxList.tsx?raw';
import CheckboxListSecondaryComponent from '../components/lists/CheckboxListSecondary';
import CheckboxListSecondaryRaw from '../components/lists/CheckboxListSecondary.tsx?raw';
import SwitchListSecondaryComponent from '../components/lists/SwitchListSecondary';
import SwitchListSecondaryRaw from '../components/lists/SwitchListSecondary.tsx?raw';
import PinnedSubheaderListComponent from '../components/lists/PinnedSubheaderList';
import PinnedSubheaderListRaw from '../components/lists/PinnedSubheaderList.tsx?raw';
import InsetListComponent from '../components/lists/InsetList';
import InsetListRaw from '../components/lists/InsetList.tsx?raw';
import GutterlessListComponent from '../components/lists/GutterlessList';
import GutterlessListRaw from '../components/lists/GutterlessList.tsx?raw';
import VirtualizedListComponent from '../components/lists/VirtualizedList';
import VirtualizedListRaw from '../components/lists/VirtualizedList.tsx?raw';
import CustomizedListComponent from '../components/lists/CustomizedList';
import CustomizedListRaw from '../components/lists/CustomizedList.tsx?raw';

function ListsDoc(props) {
	return (
		<>
			<Button
				className="normal-case absolute right-0 not-prose"
				variant="contained"
				color="secondary"
				component="a"
				href="https://mui.com/components/lists"
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
				Lists
			</Typography>
			<Typography className="description">Lists are continuous, vertical indexes of text or images.</Typography>

			<Typography
				className="text-base mb-8"
				component="div"
			>
				Lists are a continuous group of text or images. They are composed of items containing primary and
				supplemental actions, which are represented by icons and text.
			</Typography>
			<Typography
				className="text-3xl mt-6 mb-2.5 font-bold"
				component="h2"
			>
				Introduction
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				Lists present information in a concise, easy-to-follow format through a continuous, vertical index of
				text or images.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				Material UI Lists are implemented using a collection of related components:
			</Typography>
			<ul className="space-y-4">
				<li>
					List: a wrapper for list items. Renders as a <code>{`<ul className="space-y-4">`}</code> by default.
				</li>
				<li>
					List Item: a common list item. Renders as an <code>{`<li>`}</code> by default.
				</li>
				<li>List Item Button: an action element to be used inside a list item.</li>
				<li>List Item Icon: an icon to be used inside of a list item.</li>
				<li>List Item Avatar: an avatar to be used inside of a list item.</li>
				<li>List Item Text: a container inside a list item, used to display text content.</li>
				<li>List Divider: a separator between list items.</li>
				<li>List Subheader: a label for a nested list.</li>
			</ul>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="BasicList.js"
					className="my-4"
					iframe={false}
					component={BasicListComponent}
					raw={BasicListRaw}
				/>
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				The last item of the previous demo shows how you can render a link:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{` 
<ListItemButton component="a" href="#simple-list">
  <ListItemText primary="Spam" />
</ListItemButton>
`}
			</FuseHighlight>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				You can find a{' '}
				<a href="/material-ui/integrations/routing/#list">demo with React Router following this section</a> of
				the documentation.
			</Typography>
			<Typography
				className="text-3xl mt-6 mb-2.5 font-bold"
				component="h2"
			>
				Basics
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{` 
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
`}
			</FuseHighlight>
			<Typography
				className="text-3xl mt-6 mb-2.5 font-bold"
				component="h2"
			>
				Nested List
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="NestedList.js"
					className="my-4"
					iframe={false}
					component={NestedListComponent}
					raw={NestedListRaw}
				/>
			</Typography>
			<Typography
				className="text-3xl mt-6 mb-2.5 font-bold"
				component="h2"
			>
				Folder List
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="FolderList.js"
					className="my-4"
					iframe={false}
					component={FolderListComponent}
					raw={FolderListRaw}
				/>
			</Typography>
			<Typography
				className="text-3xl mt-6 mb-2.5 font-bold"
				component="h2"
			>
				Interactive
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				Below is an interactive demo that lets you explore the visual results of the different settings:
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="InteractiveList.js"
					className="my-4"
					iframe={false}
					component={InteractiveListComponent}
					raw={InteractiveListRaw}
				/>
			</Typography>
			<Typography
				className="text-3xl mt-6 mb-2.5 font-bold"
				component="h2"
			>
				Selected ListItem
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="SelectedListItem.js"
					className="my-4"
					iframe={false}
					component={SelectedListItemComponent}
					raw={SelectedListItemRaw}
				/>
			</Typography>
			<Typography
				className="text-3xl mt-6 mb-2.5 font-bold"
				component="h2"
			>
				Align list items
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				When displaying three lines or more, the avatar is not aligned at the top. You should set the{' '}
				<code>{`alignItems="flex-start"`}</code> prop to align the avatar at the top, following the Material
				Design guidelines:
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="AlignItemsList.js"
					className="my-4"
					iframe={false}
					component={AlignItemsListComponent}
					raw={AlignItemsListRaw}
				/>
			</Typography>
			<Typography
				className="text-3xl mt-6 mb-2.5 font-bold"
				component="h2"
			>
				List Controls
			</Typography>
			<Typography
				className="text-lg mt-5 mb-2.5 font-bold"
				component="h3"
			>
				Checkbox
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				A checkbox can either be a primary action or a secondary action.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				The checkbox is the primary action and the state indicator for the list item. The comment button is a
				secondary action and a separate target.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="CheckboxList.js"
					className="my-4"
					iframe={false}
					component={CheckboxListComponent}
					raw={CheckboxListRaw}
				/>
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				The checkbox is the secondary action for the list item and a separate target.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="CheckboxListSecondary.js"
					className="my-4"
					iframe={false}
					component={CheckboxListSecondaryComponent}
					raw={CheckboxListSecondaryRaw}
				/>
			</Typography>
			<Typography
				className="text-lg mt-5 mb-2.5 font-bold"
				component="h3"
			>
				Switch
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				The switch is the secondary action and a separate target.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="SwitchListSecondary.js"
					className="my-4"
					iframe={false}
					component={SwitchListSecondaryComponent}
					raw={SwitchListSecondaryRaw}
				/>
			</Typography>
			<Typography
				className="text-3xl mt-6 mb-2.5 font-bold"
				component="h2"
			>
				Sticky subheader
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				Upon scrolling, subheaders remain pinned to the top of the screen until pushed off screen by the next
				subheader. This feature relies on CSS sticky positioning.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="PinnedSubheaderList.js"
					className="my-4"
					iframe={false}
					component={PinnedSubheaderListComponent}
					raw={PinnedSubheaderListRaw}
				/>
			</Typography>
			<Typography
				className="text-3xl mt-6 mb-2.5 font-bold"
				component="h2"
			>
				Inset List Item
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				The <code>inset</code> prop enables a list item that does not have a leading icon or avatar to align
				correctly with items that do.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="InsetList.js"
					className="my-4"
					iframe={false}
					component={InsetListComponent}
					raw={InsetListRaw}
				/>
			</Typography>
			<Typography
				className="text-3xl mt-6 mb-2.5 font-bold"
				component="h2"
			>
				Gutterless list
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				When rendering a list within a component that defines its own gutters, <code>ListItem</code> gutters can
				be disabled with <code>disableGutters</code>.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="GutterlessList.js"
					className="my-4"
					iframe={false}
					component={GutterlessListComponent}
					raw={GutterlessListRaw}
				/>
			</Typography>
			<Typography
				className="text-3xl mt-6 mb-2.5 font-bold"
				component="h2"
			>
				Virtualized List
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				In the following example, we demonstrate how to use{' '}
				<a href="https://github.com/bvaughn/react-window">react-window</a> with the <code>List</code> component.
				It renders 200 rows and can easily handle more. Virtualization helps with performance issues.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="VirtualizedList.js"
					className="my-4"
					iframe={false}
					component={VirtualizedListComponent}
					raw={VirtualizedListRaw}
				/>
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				The use of <a href="https://github.com/bvaughn/react-window">react-window</a> when possible is
				encouraged. If this library doesn&#39;t cover your use case, you should consider using alternatives like{' '}
				<a href="https://github.com/petyosi/react-virtuoso">react-virtuoso</a>.
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
				Here are some examples of customizing the component. You can learn more about this in the
				<a href="/material-ui/customization/how-to-customize/">overrides documentation page</a>.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="CustomizedList.js"
					className="my-4"
					iframe={false}
					component={CustomizedListComponent}
					raw={CustomizedListRaw}
				/>
			</Typography>
		</>
	);
}

export default ListsDoc;
