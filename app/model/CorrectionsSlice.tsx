import {
  createAction,
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import Correction from './Correction';
import Sheet from './Sheet';

export const correctionsImport = createAction<unknown>('correctionsImport');

const adapter = createEntityAdapter<Correction>({
  selectId: (corr) => corr.submission,
  sortComparer: (a, b) => a.submission.localeCompare(b.submission),
});

const slice = createSlice({
  name: 'corrections',
  initialState: adapter.getInitialState(),
  reducers: {
    correctionsAddOne: adapter.addOne,
    correctionsAddMany: adapter.addMany,
    correctionsUpdateOne: adapter.updateOne,
    correctionsUpdateMany: adapter.updateMany,
    correctionsRemoveOne: adapter.removeOne,
    correctionsRemoveMany: adapter.removeMany,
    correctionsRemoveAll: adapter.removeAll,
    correctionsUpsertOne: adapter.upsertOne,
    correctionsUpsertMany: adapter.upsertMany,
    correctionsInitializeTasksForSheet: (
      state,
      action: PayloadAction<{ tasks: string[]; sheet: string | undefined }>
    ) => {
      console.log(state.entities);
    },
  },
  extraReducers: {
    [correctionsImport.type]: (state, action) => {
      adapter.upsertMany(state, action.payload.corrections);
    },
  },
});

export const {
  correctionsAddOne,
  correctionsAddMany,
  correctionsUpdateOne,
  correctionsUpdateMany,
  correctionsRemoveOne,
  correctionsRemoveMany,
  correctionsRemoveAll,
  correctionsUpsertOne,
  correctionsUpsertMany,
  correctionsInitializeTasksForSheet,
} = slice.actions;

export const {
  selectById: selectCorrectionById,
  selectIds: selectCorrectionIds,
  selectEntities: selectCorrectionEntities,
  selectAll: selectAllCorrections,
  selectTotal: selectTotalCorrections,
} = adapter.getSelectors(
  (state: { corrections: EntityState<Correction> }) => state.corrections
);

export default slice.reducer;
