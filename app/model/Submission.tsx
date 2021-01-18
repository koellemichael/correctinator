/* eslint-disable import/no-cycle */
import Correction from './Correction';
import Sheet from './Sheet';

type Submission = {
  id: string;
  files: string[];
  sheet: Sheet;
  correction?: Correction;
};
export default Submission;
