import {
  createEntityAdapter,
  createSlice,
  EntityState,
} from '@reduxjs/toolkit';
import Comment from './Comment';
import CommentEntity from './CommentEntity';
import { correctionsImport } from './CorrectionsSlice';

const adapter = createEntityAdapter<CommentEntity>({
  selectId: (sel) => sel.text,
  sortComparer: (a, b) => a.text.localeCompare(b.text),
});

const slice = createSlice({
  name: 'comments',
  initialState: adapter.getInitialState(),
  reducers: {
    commentsAddOne: adapter.addOne,
    commentsAddMany: adapter.addMany,
    commentsUpdateOne: adapter.updateOne,
    commentsUpdateMany: adapter.updateMany,
    commentsRemoveOne: adapter.removeOne,
    commentsRemoveMany: adapter.removeMany,
    commentsRemoveAll: adapter.removeAll,
    commentsUpsertOne: adapter.upsertOne,
    commentsUpsertMany: adapter.upsertMany,
  },
  extraReducers: {
    [correctionsImport.type]: (state, action) => {
      adapter.upsertMany(state, action.payload.comments);
    },
  },
});

export const {
  commentsAddOne,
  commentsAddMany,
  commentsUpdateOne,
  commentsUpdateMany,
  commentsRemoveOne,
  commentsRemoveMany,
  commentsRemoveAll,
  commentsUpsertOne,
  commentsUpsertMany,
} = slice.actions;

export const {
  selectById: selectCommentsById,
  selectIds: selectCommentsIds,
  selectEntities: selectCommentsEntities,
  selectAll: selectAllComments,
  selectTotal: selectTotalComments,
} = adapter.getSelectors(
  (state: { comments: EntityState<CommentEntity> }) => state.comments
);

export default slice.reducer;
