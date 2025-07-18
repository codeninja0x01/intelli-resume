import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { Controller, useForm } from 'react-hook-form';
import _ from 'lodash';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { format } from 'date-fns/format';
import { WithRouterProps } from '@fuse/core/withRouter/withRouter';
import { useDebounce } from '@fuse/hooks';
import FuseLoading from '@fuse/core/FuseLoading';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppSelector } from 'src/store/hooks';
import NoteFormList from './tasks/NoteFormList';
import NoteFormLabelMenu from './NoteFormLabelMenu';
import NoteFormReminder from './NoteFormReminder';
import NoteFormUploadImage from './NoteFormUploadImage';
import NoteModel from '../../models/NoteModel';
import NoteReminderLabel from '../NoteReminderLabel';
import NoteLabel from '../NoteLabel';
import {
	NotesNote,
	useCreateNotesItemMutation,
	useDeleteNotesItemMutation,
	useGetNotesListQuery,
	useUpdateNotesItemMutation
} from '../../NotesApi';
import { selectNoteDialogId } from '../../notesAppSlice';
import NoteListItemModel from '../../models/NoteListItemModel';

/**
 * Form Validation Schema
 */
const tasksSchema = z.object({
	id: z.string().nonempty('ID is required'),
	content: z.string().nonempty('Content is required'),
	completed: z.boolean()
});

const schema = z.object({
	id: z.string().optional(),
	title: z.string().optional(),
	content: z.string().optional(),
	tasks: z.array(tasksSchema).default([]).optional(),
	labels: z.array(z.string()).default([]).optional(),
	image: z.string().nullable().optional(),
	reminder: z.string().nullable().optional(),
	archived: z.boolean().optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
	oneOfThemRequired: z
		.boolean()
		.optional()
		.refine(
			function (
				this: {
					parent: NotesNote;
				},
				value
			) {
				if (value === true) {
					// Now `this` is explicitly typed with `RefineContext`
					const { title, content, image, tasks } = this.parent;
					return title || content || image || (tasks && tasks.length > 0);
				}

				return true;
			},
			{
				message: 'At least one of the fields is required.'
			}
		)
});

type FormType = z.infer<typeof schema>;

type NoteFormProps = WithRouterProps & {
	variant?: 'new' | 'edit';
	note?: NotesNote;
	onClose?: () => void;
};

/**
 * The note form.
 */
function NoteForm(props: NoteFormProps) {
	const { variant = 'edit', onClose } = props;
	const [showList, setShowList] = useState(false);
	const routeParams = useParams();

	const [updateNote] = useUpdateNotesItemMutation();
	const [removeNote] = useDeleteNotesItemMutation();
	const [createNote] = useCreateNotesItemMutation();

	const { data: notes } = useGetNotesListQuery(routeParams);
	const noteId = useAppSelector(selectNoteDialogId);

	const note = useMemo(() => _.find(notes, { id: noteId }), [noteId, notes]);

	const { formState, handleSubmit, getValues, watch, reset, setValue, control } = useForm<FormType>({
		mode: 'onChange',
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields } = formState;

	const watchedNoteForm = watch();

	const resetForm = useCallback(() => {
		if (variant === 'edit' && note) {
			reset(note);
		}

		if (variant === 'new' && _.isEmpty(watchedNoteForm)) {
			reset(
				NoteModel(
					_.merge(
						routeParams.labelId ? { labels: [routeParams.labelId] } : null,
						routeParams.id === 'archive' ? { archived: true } : null
					)
				)
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [variant, routeParams, note]);

	useEffect(() => {
		resetForm();
	}, [resetForm]);

	/**
	 * Create New Note
	 */
	function handleNewNote(data: FormType) {
		createNote(NoteModel({ ...data, tasks: data.tasks?.map((task) => NoteListItemModel(task)) }));
		resetForm();
	}

	/**
	 * On Change Handler
	 */
	const handleOnChange = useDebounce((_note: FormType) => {
		updateNote(NoteModel({ ..._note, tasks: _note.tasks?.map((task) => NoteListItemModel(task)) }));
	}, 600);

	/**
	 * Update Note
	 */
	useEffect(() => {
		if (variant === 'edit' && !_.isEmpty(dirtyFields)) {
			if (!_.isEqual(note, watchedNoteForm)) {
				handleOnChange({
					...watchedNoteForm,
					tasks: watchedNoteForm.tasks?.map((task) => NoteListItemModel(task))
				});
			}
		}
	}, [watchedNoteForm, note, variant, handleOnChange, dirtyFields]);

	/**
	 * Delete  Note
	 */
	function handleOnRemove() {
		removeNote(note?.id);
		onClose?.();
	}

	if (_.isEmpty(watchedNoteForm)) {
		return <FuseLoading />;
	}

	return (
		<div className="flex flex-col w-full">
			<FuseScrollbars className="flex flex-auto w-full max-h-160">
				<div className="w-full">
					<Controller
						name="image"
						control={control}
						defaultValue=""
						render={({ field: { onChange, value } }) => {
							if (!value || value === '') {
								return <span />;
							}

							return (
								<div className="relative">
									<img
										src={value}
										className="w-full block"
										alt="note"
									/>
									<Fab
										className="absolute right-0 bottom-0 m-2"
										variant="extended"
										size="small"
										color="secondary"
										aria-label="Delete Image"
										type="button"
										onClick={() => onChange('')}
									>
										<FuseSvgIcon size={20}>heroicons-outline:trash</FuseSvgIcon>
									</Fab>
								</div>
							);
						}}
					/>

					<div className="px-1 my-1.5">
						<Controller
							name="title"
							control={control}
							render={({ field }) => (
								<Input
									{...field}
									className="font-semibold text-base"
									placeholder="Title"
									type="text"
									disableUnderline
									fullWidth
								/>
							)}
						/>
					</div>
					<div className="px-1 my-1.5">
						<Controller
							name="content"
							control={control}
							render={({ field }) => (
								<Input
									{...field}
									placeholder="Take a note..."
									multiline
									rows="4"
									disableUnderline
									fullWidth
								/>
							)}
						/>
					</div>

					<Controller
						name="tasks"
						control={control}
						defaultValue={[]}
						render={({ field: { onChange, value } }) => {
							if ((value?.length === 0 && !showList) || (!value && !showList)) {
								return <span />;
							}

							return (
								<div className="px-1">
									<NoteFormList
										tasks={value?.map((task) => NoteListItemModel(task)) || []}
										onCheckListChange={(val) => onChange(val)}
									/>
								</div>
							);
						}}
					/>

					{(watchedNoteForm.labels || watchedNoteForm.reminder || watchedNoteForm.createdAt) && (
						<div className="flex flex-wrap w-full px-4 mb-3 -mx-1">
							{watchedNoteForm.reminder && (
								<NoteReminderLabel
									className="mt-1 mx-1"
									date={watchedNoteForm.reminder}
									onDelete={() => {
										setValue('reminder', undefined);
									}}
								/>
							)}

							<Controller
								name="labels"
								control={control}
								defaultValue={[]}
								render={({ field: { onChange, value } }) => {
									if (!value) {
										return <span />;
									}

									return (
										<>
											{value.map((id) => (
												<NoteLabel
													id={id}
													key={id}
													className="mt-1 mx-1"
													onDelete={() => onChange(value.filter((_id) => _id !== id))}
												/>
											))}
										</>
									);
								}}
							/>

							{watchedNoteForm.createdAt && (
								<Typography
									color="text.secondary"
									className="text-md mt-2 mx-1"
								>
									Edited: {format(new Date(watchedNoteForm.createdAt), 'MMM dd yy, h:mm')}
								</Typography>
							)}
						</div>
					)}
				</div>
			</FuseScrollbars>

			<div className="flex flex-auto justify-between items-center px-4 pb-3">
				<div className="flex items-center space-x-1">
					<Controller
						name="reminder"
						control={control}
						render={({ field: { onChange, value } }) => (
							<NoteFormReminder
								reminder={value}
								onChange={onChange}
							/>
						)}
					/>

					<Tooltip
						title="Add image"
						placement="bottom"
					>
						<div>
							<NoteFormUploadImage
								onChange={(val: string) =>
									setValue('image', val, { shouldDirty: true, shouldValidate: true })
								}
							/>
						</div>
					</Tooltip>

					<Tooltip
						title="Add tasks"
						placement="bottom"
					>
						<IconButton
							className="p-0"
							onClick={() => setShowList(!showList)}
							size="small"
						>
							<FuseSvgIcon>heroicons-outline:pencil-square</FuseSvgIcon>
						</IconButton>
					</Tooltip>

					<Tooltip
						title="Change labels"
						placement="bottom"
					>
						<div>
							<NoteFormLabelMenu
								note={NoteModel({
									...watchedNoteForm,
									tasks: watchedNoteForm.tasks?.map((task) => NoteListItemModel(task))
								})}
								onChange={(labels: string[]) => setValue('labels', labels)}
							/>
						</div>
					</Tooltip>

					<Controller
						name="archived"
						control={control}
						defaultValue={false}
						render={({ field: { onChange, value } }) => (
							<Tooltip
								title={value ? 'Unarchive' : 'Archive'}
								placement="bottom"
							>
								<IconButton
									// disabled={newFormButtonDisabled()}
									onClick={() => {
										onChange(!value);

										if (variant === 'new') {
											setTimeout(() => handleNewNote(getValues()));
										}
									}}
									size="small"
								>
									<FuseSvgIcon>
										{value ? 'heroicons-solid:archive-box' : 'heroicons-outline:archive-box'}
									</FuseSvgIcon>
								</IconButton>
							</Tooltip>
						)}
					/>
				</div>

				<div className="flex items-center space-x-1">
					{variant === 'new' ? (
						<Button
							className=""
							type="submit"
							variant="contained"
							color="secondary"
							size="small"
							onClick={handleSubmit(handleNewNote)}
							disabled={_.isEmpty(dirtyFields) || !isValid}
						>
							Create
						</Button>
					) : (
						<>
							<Tooltip
								title="Delete Note"
								placement="bottom"
							>
								<IconButton
									className="p-0"
									onClick={handleOnRemove}
									size="small"
								>
									<FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
								</IconButton>
							</Tooltip>
							<Button
								className=""
								onClick={onClose}
								variant="text"
							>
								Close
							</Button>
						</>
					)}
				</div>
			</div>
		</div>
	);
}

export default NoteForm;
