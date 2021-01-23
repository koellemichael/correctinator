import {
  createEntityAdapter,
  createSlice,
  EntityState,
} from '@reduxjs/toolkit';
import { correctionsImport } from './CorrectionsSlice';
import Term from './Term';

const adapter = createEntityAdapter<Term>({
  selectId: (term) => term.id,
});

const slice = createSlice({
  name: 'terms',
  initialState: adapter.getInitialState(),
  reducers: {
    termsAddOne: adapter.addOne,
    termsAddMany: adapter.addMany,
    termsUpdateOne: adapter.updateOne,
    termsUpdateMany: adapter.updateMany,
    termsRemoveOne: adapter.removeOne,
    termsRemoveMany: adapter.removeMany,
    termsRemoveAll: adapter.removeAll,
    termsUpsertOne: adapter.upsertOne,
    termsUpsertMany: adapter.upsertMany,
  },
  extraReducers: {
    [correctionsImport.type]: (state, action) => {
      adapter.upsertMany(state, action.payload.terms);
    },
  },
});

export const {
  selectById: selectTermById,
  selectIds: selectTermIds,
  selectEntities: selectTermEntities,
  selectAll: selectAllTerms,
  selectTotal: selectTotalTerms,
} = adapter.getSelectors((state: { terms: EntityState<Term> }) => state.terms);

export const {
  termsAddOne,
  termsAddMany,
  termsUpdateOne,
  termsUpdateMany,
  termsRemoveOne,
  termsRemoveMany,
  termsRemoveAll,
  termsUpsertOne,
  termsUpsertMany,
} = slice.actions;
export default slice.reducer;
