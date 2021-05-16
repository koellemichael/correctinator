import { correctionPageSetSheetId } from '../model/CorrectionPageSlice';
import { setTabIndex } from '../model/HomeSlice';
import SheetEntity from '../model/SheetEntity';

const StartCorrectionDialog = (selectedSheet: SheetEntity | undefined) => {
  const onStartCorrection = (dispatch) => {
    if (selectedSheet?.id !== undefined) {
      dispatch(correctionPageSetSheetId(selectedSheet?.id));
      dispatch(setTabIndex(3));
    }
  };

  return {
    title: 'Start correcting right away?',
    text: `Do you want to start correcting the sheet "${selectedSheet?.name}" now?`,
    onConfirm: (dispatch) => {
      onStartCorrection(dispatch);
    },
  };
};

export default StartCorrectionDialog;
