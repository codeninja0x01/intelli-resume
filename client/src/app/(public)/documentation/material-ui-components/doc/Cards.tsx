import FuseExample from '@fuse/core/FuseExample';
import FuseHighlight from '@fuse/core/FuseHighlight';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import BasicCardComponent from '../components/cards/BasicCard';
import BasicCardRaw from '../components/cards/BasicCard.tsx?raw';
import OutlinedCardComponent from '../components/cards/OutlinedCard';
import OutlinedCardRaw from '../components/cards/OutlinedCard.tsx?raw';
import RecipeReviewCardComponent from '../components/cards/RecipeReviewCard';
import RecipeReviewCardRaw from '../components/cards/RecipeReviewCard.tsx?raw';
import MediaCardComponent from '../components/cards/MediaCard';
import MediaCardRaw from '../components/cards/MediaCard.tsx?raw';
import ImgMediaCardComponent from '../components/cards/ImgMediaCard';
import ImgMediaCardRaw from '../components/cards/ImgMediaCard.tsx?raw';
import ActionAreaCardComponent from '../components/cards/ActionAreaCard';
import ActionAreaCardRaw from '../components/cards/ActionAreaCard.tsx?raw';
import MultiActionAreaCardComponent from '../components/cards/MultiActionAreaCard';
import MultiActionAreaCardRaw from '../components/cards/MultiActionAreaCard.tsx?raw';
import MediaControlCardComponent from '../components/cards/MediaControlCard';
import MediaControlCardRaw from '../components/cards/MediaControlCard.tsx?raw';
import SelectActionCardComponent from '../components/cards/SelectActionCard';
import SelectActionCardRaw from '../components/cards/SelectActionCard.tsx?raw';

function CardsDoc(props) {
	return (
		<>
			<Button
				className="normal-case absolute right-0 not-prose"
				variant="contained"
				color="secondary"
				component="a"
				href="https://mui.com/components/cards"
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
				Card
			</Typography>
			<Typography className="description">Cards contain content and actions about a single subject.</Typography>

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
				Cards are surfaces that display content and actions on a single topic. The Material UI Card component
				includes several complementary utility components to handle various use cases:
			</Typography>
			<ul className="space-y-4">
				<li>Card: a surface-level container for grouping related components.</li>
				<li>Card Content: the wrapper for the Card content.</li>
				<li>Card Header: an optional wrapper for the Card header.</li>
				<li>Card Media: an optional container for displaying images, videos, etc.</li>
				<li>Card Actions: an optional wrapper that groups a set of buttons.</li>
				<li>
					Card Action Area: an optional wrapper that allows users to interact with the specified area of the
					Card.
				</li>
			</ul>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="BasicCard.js"
					className="my-4"
					iframe={false}
					component={BasicCardComponent}
					raw={BasicCardRaw}
				/>
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
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
`}
			</FuseHighlight>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				:::success Although cards can support multiple actions, UI controls, and an overflow menu, use restraint
				and remember that cards are meant to be entry points to more complex and detailed information. :::
			</Typography>
			<Typography
				className="text-lg mt-5 mb-2.5 font-bold"
				component="h3"
			>
				Outlined Card
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				Set <code>{`variant="outlined"`}</code> to render an outlined card.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="OutlinedCard.js"
					className="my-4"
					iframe={false}
					component={OutlinedCardComponent}
					raw={OutlinedCardRaw}
				/>
			</Typography>
			<Typography
				className="text-3xl mt-6 mb-2.5 font-bold"
				component="h2"
			>
				Complex Interaction
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				On desktop, card content can expand. (Click the downward chevron to view the recipe.)
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="RecipeReviewCard.js"
					className="my-4"
					iframe={false}
					component={RecipeReviewCardComponent}
					raw={RecipeReviewCardRaw}
				/>
			</Typography>
			<Typography
				className="text-3xl mt-6 mb-2.5 font-bold"
				component="h2"
			>
				Media
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				Example of a card using an image to reinforce the content.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="MediaCard.js"
					className="my-4"
					iframe={false}
					component={MediaCardComponent}
					raw={MediaCardRaw}
				/>
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				By default, we use the combination of a <code>{`<div>`}</code> element and a <em>background image</em>{' '}
				to display the media. It can be problematic in some situations, for example, you might want to display a
				video or a responsive image. Use the <code>component</code> prop for these use cases:
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="ImgMediaCard.js"
					className="my-4"
					iframe={false}
					component={ImgMediaCardComponent}
					raw={ImgMediaCardRaw}
				/>
			</Typography>
			<Typography
				className="text-3xl mt-6 mb-2.5 font-bold"
				component="h2"
			>
				Primary action
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				Often a card allow users to interact with the entirety of its surface to trigger its main action, be it
				an expansion, a link to another screen or some other behavior. The action area of the card can be
				specified by wrapping its contents in a <code>CardActionArea</code> component.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="ActionAreaCard.js"
					className="my-4"
					iframe={false}
					component={ActionAreaCardComponent}
					raw={ActionAreaCardRaw}
				/>
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				A card can also offer supplemental actions which should stand detached from the main action area in
				order to avoid event overlap.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="MultiActionAreaCard.js"
					className="my-4"
					iframe={false}
					component={MultiActionAreaCardComponent}
					raw={MultiActionAreaCardRaw}
				/>
			</Typography>
			<Typography
				className="text-3xl mt-6 mb-2.5 font-bold"
				component="h2"
			>
				UI Controls
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				Supplemental actions within the card are explicitly called out using icons, text, and UI controls,
				typically placed at the bottom of the card.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				Here&#39;s an example of a media control card.
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="MediaControlCard.js"
					className="my-4"
					iframe={false}
					component={MediaControlCardComponent}
					raw={MediaControlCardRaw}
				/>
			</Typography>
			<Typography
				className="text-3xl mt-6 mb-2.5 font-bold"
				component="h2"
			>
				Active state styles
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				To customize a Card&#39;s styles when it&#39;s in an active state, you can attach a{' '}
				<code>data-active</code> attribute to the Card Action Area component and apply styles with the{' '}
				<code>&[data-active]</code> selector, as shown below:
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				<FuseExample
					name="SelectActionCard.js"
					className="my-4"
					iframe={false}
					component={SelectActionCardComponent}
					raw={SelectActionCardRaw}
				/>
			</Typography>
			<Typography
				className="text-base mb-8"
				component="div"
			>
				🎨 If you are looking for inspiration, you can check{' '}
				<a href="https://mui-treasury.com/?path=/docs/card-introduction--docs">
					MUI Treasury&#39;s customization examples
				</a>
				.
			</Typography>
		</>
	);
}

export default CardsDoc;
