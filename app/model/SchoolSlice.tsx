import {
  createEntityAdapter,
  createSlice,
  EntityState,
} from '@reduxjs/toolkit';
import { correctionsImport } from './CorrectionsSlice';
import School from './School';

const adapter = createEntityAdapter<School>({
  selectId: (school) => school.id,
});

const slice = createSlice({
  name: 'schools',
  initialState: adapter.getInitialState(),
  reducers: {
    schoolsAddOne: adapter.addOne,
    schoolsAddMany: adapter.addMany,
    schoolsUpdateOne: adapter.updateOne,
    schoolsUpdateMany: adapter.updateMany,
    schoolsRemoveOne: adapter.removeOne,
    schoolsRemoveMany: adapter.removeMany,
    schoolsRemoveAll: adapter.removeAll,
    schoolsUpsertOne: adapter.upsertOne,
    schoolsUpsertMany: adapter.upsertMany,
  },
  extraReducers: {
    [correctionsImport.type]: (state, action) => {
      adapter.upsertMany(state, action.payload.schools);
    },
  },
});

export const {
  selectById: selectSchoolById,
  selectIds: selectSchoolIds,
  selectEntities: selectSchoolEntities,
  selectAll: selectAllSchools,
  selectTotal: selectTotalSchools,
} = adapter.getSelectors(
  (state: { schools: EntityState<School> }) => state.schools
);

export const {
  schoolsAddOne,
  schoolsAddMany,
  schoolsUpdateOne,
  schoolsUpdateMany,
  schoolsRemoveOne,
  schoolsRemoveMany,
  schoolsRemoveAll,
  schoolsUpsertOne,
  schoolsUpsertMany,
} = slice.actions;
export default slice.reducer;
