import { useDebounce, useDeepCompareEffect } from '@fuse/hooks';
import _ from 'lodash';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import clsx from 'clsx';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import { fromUnixTime } from 'date-fns/fromUnixTime';
import { getUnixTime } from 'date-fns/getUnixTime';
import { format } from 'date-fns/format';
import { Controller, useForm } from 'react-hook-form';
import { SyntheticEvent, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import { useParams } from 'react-router';
import FuseLoading from '@fuse/core/FuseLoading';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { closeCardDialog, selectCardDialogData } from '../../../../scrumboardSlice';
import CardActivity from './activity/CardActivity';
import CardAttachment from './attachment/CardAttachment';
import CardChecklist from './checklist/CardChecklist';
import CardComment from './comment/CardComment';
import DueMenu from './toolbar/DueMenu';
import LabelsMenu from './toolbar/LabelsMenu';
import MembersMenu from './toolbar/MembersMenu';
import CheckListMenu from './toolbar/CheckListMenu';
import OptionsMenu from './toolbar/OptionsMenu';
import {
	ScrumboardCard,
	ScrumboardChecklist,
	ScrumboardComment,
	ScrumboardLabel,
	ScrumboardMember,
	useDeleteScrumboardBoardCardMutation,
	useGetScrumboardBoardLabelsQuery,
	useGetScrumboardBoardListsQuery,
	useGetScrumboardBoardQuery,
	useGetScrumboardMembersQuery,
	useUpdateScrumboardBoardCardMutation
} from '../../../../ScrumboardApi';
import useUpdateScrumboardBoard from '../../../../hooks/useUpdateScrumboardBoard';
import setIn from '@/utils/setIn';

/**
 * The board card form component.
 */
function BoardCardForm() {
	const dispatch = useAppDispatch();
	const routeParams = useParams<{ boardId: string }>();
	const { boardId } = routeParams;

	const { data: board, isLoading: isBoardLoading } = useGetScrumboardBoardQuery(boardId);
	const { data: members, isLoading: isMembersLoading } = useGetScrumboardMembersQuery();
	const { data: labels, isLoading: isLabelsLoading } = useGetScrumboardBoardLabelsQuery(boardId);
	const { data: listItems, isLoading: isListItemsLoading } = useGetScrumboardBoardListsQuery(boardId);
	const loading = isBoardLoading || isMembersLoading || isLabelsLoading || isListItemsLoading;

	const card = useAppSelector(selectCardDialogData);

	const [updateCard] = useUpdateScrumboardBoardCardMutation();
	const [removeCard] = useDeleteScrumboardBoardCardMutation();
	const updateBoard = useUpdateScrumboardBoard();

	const list = _.find(listItems, { id: card?.listId });

	const { register, watch, control, setValue, formState } = useForm<ScrumboardCard>({
		mode: 'onChange',
		defaultValues: card
	});
	const { isValid } = formState;
	const cardForm = watch();

	const updateCardData = useDebounce((newCard: ScrumboardCard) => {
		updateCard(newCard)
			.unwrap()
			.then(() => {
				dispatch(
					showMessage({
						message: 'Card Saved',
						autoHideDuration: 2000,
						anchorOrigin: {
							vertical: 'top',
							horizontal: 'right'
						}
					})
				);
			});
	}, 600);

	/**
	 * Update Card
	 */
	useDeepCompareEffect(() => {
		if (!(!isValid || _.isEmpty(cardForm) || !card) && !_.isEqual(card, cardForm)) {
			updateCardData(cardForm);
		}
	}, [cardForm, isValid]);

	useEffect(() => {
		register('attachmentCoverId');
	}, [register]);

	if (loading) {
		return <FuseLoading />;
	}

	return (
		<DialogContent className="flex flex-col sm:flex-row p-2">
			<div className="flex flex-auto flex-col py-4 px-0 sm:px-4">
				<div className="flex flex-col sm:flex-row sm:justify-between justify-center items-center mb-6">
					<div className="mb-4 sm:mb-0 flex items-center">
						<Typography>{board.title}</Typography>

						<FuseSvgIcon size={20}>heroicons-outline:chevron-right</FuseSvgIcon>

						<Typography>{list && list.title}</Typography>
					</div>

					{cardForm.dueDate && (
						<DateTimePicker
							value={new Date(format(fromUnixTime(cardForm.dueDate), 'Pp'))}
							format="Pp"
							onChange={(val) => setValue('dueDate', getUnixTime(val))}
							className="w-full sm:w-auto"
							slotProps={{
								textField: {
									label: 'Due date',
									placeholder: 'Choose a due date',
									InputLabelProps: {
										shrink: true
									},
									fullWidth: true,
									variant: 'outlined'
								}
							}}
						/>
					)}
				</div>

				<div className="flex items-center mb-6">
					<Controller
						name="title"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Title"
								type="text"
								variant="outlined"
								fullWidth
								required
								slotProps={{
									input: {
										endAdornment: (
											<InputAdornment position="end">
												{card?.subscribed && (
													<FuseSvgIcon
														size={20}
														color="action"
													>
														heroicons-outline:eye
													</FuseSvgIcon>
												)}
											</InputAdornment>
										)
									}
								}}
							/>
						)}
					/>
				</div>

				<div className="w-full mb-6">
					<Controller
						name="description"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Description"
								multiline
								rows="4"
								variant="outlined"
								fullWidth
							/>
						)}
					/>
				</div>

				{cardForm.labels && cardForm.labels.length > 0 && (
					<div className="flex-1 mb-6 mx-2">
						<div className="flex items-center mt-4 mb-3">
							<FuseSvgIcon size={20}>heroicons-outline:tag</FuseSvgIcon>
							<Typography className="font-semibold text-lg mx-2">Labels</Typography>
						</div>
						<Autocomplete
							className="mt-2 mb-4"
							multiple
							freeSolo
							options={labels}
							getOptionLabel={(option: string | ScrumboardLabel) => {
								if (typeof option === 'string') {
									return option;
								}

								return option?.title;
							}}
							value={cardForm.labels.map((id) => _.find(labels, { id }))}
							onChange={(_event: SyntheticEvent<Element, Event>, value: (string | ScrumboardLabel)[]) => {
								const ids = value
									.filter((item): item is ScrumboardLabel => typeof item !== 'string')
									.map((item) => item.id);
								setValue('labels', ids);
							}}
							renderTags={(value, getTagProps) =>
								value.map((option, index) => {
									const { key, ...rest } = getTagProps({ index });
									return (
										<Chip
											key={key}
											label={typeof option === 'string' ? option : option?.title}
											className="m-0.75"
											{...rest}
										/>
									);
								})
							}
							renderInput={(params) => (
								<TextField
									{...params}
									placeholder="Select multiple Labels"
									label="Labels"
									variant="outlined"
									InputLabelProps={{
										shrink: true
									}}
								/>
							)}
						/>
					</div>
				)}

				{cardForm.memberIds && cardForm.memberIds.length > 0 && (
					<div className="flex-1 mb-6 mx-2">
						<div className="flex items-center mt-4 mb-3">
							<FuseSvgIcon size={20}>heroicons-outline:users</FuseSvgIcon>
							<Typography className="font-semibold text-lg mx-2">Members</Typography>
						</div>
						<Autocomplete
							className="mt-2 mb-4"
							multiple
							freeSolo
							options={members}
							getOptionLabel={(member: string | ScrumboardMember) => {
								return typeof member === 'string' ? member : member?.name;
							}}
							value={cardForm.memberIds.map((id) => _.find(members, { id }))}
							onChange={(
								_event: SyntheticEvent<Element, Event>,
								value: (string | ScrumboardMember)[]
							) => {
								const ids = value
									.filter((item): item is ScrumboardMember => typeof item !== 'string')
									.map((item) => item.id);
								setValue('memberIds', ids);
							}}
							renderTags={(value, getTagProps) =>
								value.map((option, index) => {
									if (typeof option === 'string') {
										// eslint-disable-next-line react/jsx-key
										return <span />;
									}

									const { key, ...rest } = getTagProps({ index });
									return (
										<Chip
											key={key}
											label={option.name}
											className={clsx('m-0.75', option?.class)}
											{...rest}
											avatar={
												<Tooltip title={option.name}>
													<Avatar src={option.avatar} />
												</Tooltip>
											}
										/>
									);
								})
							}
							renderInput={(params) => (
								<TextField
									{...params}
									placeholder="Select multiple Members"
									label="Members"
									variant="outlined"
									InputLabelProps={{
										shrink: true
									}}
								/>
							)}
						/>
					</div>
				)}

				{cardForm.attachments && cardForm.attachments.length > 0 && (
					<div className="mb-6">
						<div className="flex items-center mt-4 mb-3">
							<FuseSvgIcon size={20}>heroicons-outline:paper-clip</FuseSvgIcon>
							<Typography className="font-semibold text-lg mx-2">Attachments</Typography>
						</div>
						<div className="flex flex-col sm:flex-row flex-wrap -mx-4">
							{cardForm.attachments.map((item) => (
								<CardAttachment
									item={item}
									card={cardForm}
									makeCover={() => {
										setValue('attachmentCoverId', item.id);
									}}
									removeCover={() => {
										setValue('attachmentCoverId', '');
									}}
									removeAttachment={() => {
										setValue('attachments', _.reject(cardForm.attachments, { id: item.id }));
									}}
									key={item.id}
								/>
							))}
						</div>
					</div>
				)}

				{cardForm.checklists &&
					cardForm.checklists.map((checklist, index) => (
						<CardChecklist
							key={checklist.id}
							checklist={checklist}
							index={index}
							onCheckListChange={(item, itemIndex) => {
								setValue(
									'checklists',
									setIn(cardForm.checklists, `[${itemIndex}]`, item) as ScrumboardChecklist[]
								);
							}}
							onRemoveCheckList={() => {
								setValue('checklists', _.reject(cardForm.checklists, { id: checklist.id }));
							}}
						/>
					))}

				<div className="mb-6">
					<div className="flex items-center mt-4 mb-3">
						<FuseSvgIcon size={20}>heroicons-outline:chat-bubble-left-right</FuseSvgIcon>
						<Typography className="font-semibold text-lg mx-2">Comment</Typography>
					</div>
					<div>
						<CardComment
							onCommentAdd={(comment) =>
								setValue('activities', [comment, ...cardForm.activities] as ScrumboardComment[])
							}
						/>
					</div>
				</div>

				<Controller
					name="activities"
					control={control}
					defaultValue={[]}
					render={({ field: { value } }) => (
						<div>
							{value.length > 0 && (
								<div className="mb-6">
									<div className="flex items-center mt-4">
										<FuseSvgIcon size={20}>heroicons-outline:clipboard-document-list</FuseSvgIcon>
										<Typography className="font-semibold text-lg mx-2">Activity</Typography>
									</div>
									<List>
										{value.map((item) => (
											<CardActivity
												item={item}
												key={item.id}
											/>
										))}
									</List>
								</div>
							)}
						</div>
					)}
				/>
			</div>

			<div className="flex order-first sm:order-last items-start sticky top-0">
				<Box
					className="flex flex-row sm:flex-col items-center rounded-lg w-full overflow-hidden"
					sx={{ backgroundColor: 'background.default' }}
				>
					<IconButton
						className="order-last sm:order-first rounded-none"
						color="inherit"
						onClick={() => dispatch(closeCardDialog())}
						size="large"
					>
						<FuseSvgIcon>heroicons-outline:x-mark</FuseSvgIcon>
					</IconButton>
					<div className="flex flex-row items-center sm:items-start sm:flex-col flex-1">
						<Controller
							name="dueDate"
							control={control}
							render={({ field: { onChange, value } }) => (
								<DueMenu
									onDueChange={onChange}
									onRemoveDue={() => onChange(null)}
									dueDate={value}
								/>
							)}
						/>

						<Controller
							name="labels"
							control={control}
							defaultValue={[]}
							render={({ field: { onChange, value } }) => (
								<LabelsMenu
									onToggleLabel={(labelId) => onChange(_.xor(value, [labelId]))}
									labels={value}
								/>
							)}
						/>

						<Controller
							name="memberIds"
							control={control}
							defaultValue={[]}
							render={({ field: { onChange, value } }) => (
								<MembersMenu
									onToggleMember={(memberId) => onChange(_.xor(value, [memberId]))}
									memberIds={value}
								/>
							)}
						/>

						<Controller
							name="attachments"
							control={control}
							defaultValue={[]}
							render={() => (
								<IconButton
									size="large"
									className="rounded-none"
								>
									<FuseSvgIcon>heroicons-outline:paper-clip</FuseSvgIcon>
								</IconButton>
							)}
						/>

						<Controller
							name="checklists"
							control={control}
							defaultValue={[]}
							render={({ field: { onChange } }) => (
								<CheckListMenu
									onAddCheckList={(newList) => onChange([...cardForm.checklists, newList])}
								/>
							)}
						/>

						<OptionsMenu
							onRemoveCard={() => {
								removeCard(card.id)
									.unwrap()
									.then(() => {
										updateBoard((board) => ({
											...board,
											lists: board.lists.map((list) =>
												list.id === card.listId
													? {
															...list,
															cards: list.cards.filter((id) => id !== card.id)
														}
													: list
											)
										}));
										dispatch(closeCardDialog());
										dispatch(
											showMessage({
												message: 'Card Removed',
												autoHideDuration: 2000,
												anchorOrigin: {
													vertical: 'top',
													horizontal: 'right'
												}
											})
										);
									});
							}}
						/>
					</div>
				</Box>
			</div>
		</DialogContent>
	);
}

export default BoardCardForm;
