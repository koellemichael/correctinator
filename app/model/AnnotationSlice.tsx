import {
  createEntityAdapter,
  createSlice,
  EntityState,
} from '@reduxjs/toolkit';
import Annotation from './Annotation';
import { correctionsImport } from './CorrectionsSlice';

const adapter = createEntityAdapter<Annotation>({
  selectId: (sel) => sel.text,
  sortComparer: (a, b) => a.text.localeCompare(b.text),
});

const slice = createSlice({
  name: 'annotations',
  initialState: adapter.getInitialState(),
  reducers: {
    annotationsAddOne: adapter.addOne,
    annotationsAddMany: adapter.addMany,
    annotationsUpdateOne: adapter.updateOne,
    annotationsUpdateMany: adapter.updateMany,
    annotationsRemoveOne: adapter.removeOne,
    annotationsRemoveMany: adapter.removeMany,
    annotationsRemoveAll: adapter.removeAll,
    annotationsUpsertOne: adapter.upsertOne,
    annotationsUpsertMany: adapter.upsertMany,
  },
  extraReducers: {
    [correctionsImport.type]: (state, action) => {
      if (action.payload.annotations !== undefined) {
        adapter.upsertMany(state, action.payload.annotations);
      }
    },
  },
});

export const {
  annotationsAddOne,
  annotationsAddMany,
  annotationsUpdateOne,
  annotationsUpdateMany,
  annotationsRemoveOne,
  annotationsRemoveMany,
  annotationsRemoveAll,
  annotationsUpsertOne,
  annotationsUpsertMany,
} = slice.actions;

export const {
  selectById: selectAnnotationById,
  selectIds: selectAnnotationIds,
  selectEntities: selectAnnotationEntities,
  selectAll: selectAllAnnotations,
  selectTotal: selectTotalAnnotations,
} = adapter.getSelectors((state: any) => state.annotations);

export default slice.reducer;
