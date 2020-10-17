/* eslint-disable react/display-name */
import {
  Button,
  Container,
  Dialog,
  DialogTitle,
  LinearProgress,
  Typography,
} from '@material-ui/core';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import MUIDataTable from 'mui-datatables';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import {
  openDirectory,
  getAllFilesInDirectory,
  getAllRatingFiles,
  getAllSubmissionDirectories,
  createSubmissionFileStruture,
  getSubmissionDir,
  getSubmissionFromAppDataDir,
  getUniqueSheets,
  exportCorrections,
} from '../../utils/FileAccess';
import routes from '../../constants/routes.json';
import LoadingItemList from '../../components/LoadingItemList';

const columns = [
  {
    name: 'rating_done',
    label: 'Status',
    options: {
      customBodyRender: (value: any) =>
        value ? (
          <CheckCircleIcon color="primary" />
        ) : (
          <CancelIcon color="secondary" />
        ),
    },
  },
  {
    name: 'submission',
    label: 'ID',
  },
  {
    name: 'sheet.name',
    label: 'Sheet',
  },
  {
    name: 'sheet.type',
    label: 'Sheet Type',
  },
  { name: 'points', label: 'Value' },
  {
    name: 'sheet.grading.max',
    label: 'Max',
  },
  {
    name: 'sheet.grading.type',
    label: 'Type',
  },
  { name: 'term', label: 'Term' },
  { name: 'school', label: 'School' },
  { name: 'course', label: 'Course' },
  { name: 'rated_by', label: 'Rated by' },
  { name: 'rated_at', label: 'Rated at' },
];

export default function Overview(props: any) {
  const { submissions } = props;
  const [open, setOpen] = React.useState(false);
  const [progress, setProgress] = React.useState(0) as any;
  const [summaryProgress, setSummaryProgress] = React.useState([]) as any;
  const [selected, setSelected] = React.useState([]) as any;

  const getMuiTheme = () =>
    createMuiTheme({
      overrides: {
        MuiTableCell: {
          root: {
            userSelect: 'none',
          },
        },
      },
    });

  function onExportSubmissions() {
    if (selected.length > 0) {
      exportCorrections(selected, 'C:/Users/Michi/Desktop/test');
    }
  }

  function onSelectionChange(
    currentRowsSelected: any[],
    allRowsSelected: any[]
  ): void {
    const sel: any[] = [];
    console.log(allRowsSelected);
    allRowsSelected.forEach((row) => {
      sel.push(submissions[row.dataIndex]);
    });
    console.log(sel);
    setSelected(sel);
  }

  /*
  function timeout(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function onOpen() {
    const path: string = await openDirectory();
    const files = getAllFilesInDirectory(path);

    setProgress(0);
    setOpen(true);
    setSummaryProgress([
      {
        message: 'Searching for submissions...',
        active: true,
        complete: false,
      },
    ]);

    await timeout(1000);

    console.log(files);
    const ratingFiles: string[] = getAllRatingFiles(path);
    console.log(ratingFiles);
    const submissionDirectories: string[] = getAllSubmissionDirectories(path);
    await timeout(1000);
    setSummaryProgress([
      {
        message: 'Searching for submissions...',
        active: true,
        complete: true,
      },
    ]);
    setProgress(30);

    setSummaryProgress([
      {
        message: 'Searching for submissions...',
        active: true,
        complete: true,
      },
      {
        message: `Creating stuctures [0/${submissionDirectories.length}]...`,
        active: true,
        complete: false,
      },
    ]);
    await timeout(1000);
    const subs: any[] = [];
    submissionDirectories.forEach((dir, i) => {
      const temp = createSubmissionFileStruture(dir);
      temp.id = i;
      subs.push(temp);
    });
    // loadSubmissions();
    setSummaryProgress([
      {
        message: 'Searching for submissions...',
        active: true,
        complete: true,
      },
      {
        message: `Creating stuctures [${submissionDirectories.length}/${submissionDirectories.length}]...`,
        active: true,
        complete: true,
      },
    ]);
    setProgress(100);
    setTimeout(() => setOpen(false), 1000);
  }
*/
  return (
    <div
      style={{
        height: 'calc(100% - 45px)', // 29px TitleBar + 16px Margin
        marginTop: '16px',
      }}
    >
      <Typography variant="h3">Overview</Typography>
      <Button
        variant="contained"
        color="secondary"
        style={{
          width: 'fit-content',
          marginTop: '16px',
          marginBottom: '16px',
        }}
        onClick={onExportSubmissions}
      >
        Export Submissions
      </Button>
      <MuiThemeProvider theme={getMuiTheme()}>
        <MUIDataTable
          title="Submission Overview"
          data={submissions}
          columns={columns}
          options={{
            enableNestedDataAccess: '.',
            print: false,
            pagination: false,
            selectableRows: 'muliple',
            selectableRowsHideCheckboxes: true,
            selectableRowsOnClick: true,
            selectToolbarPlacement: 'none',
            tableBodyHeight: '600px',
            onRowSelectionChange: onSelectionChange,
            setTableProps: () => {
              return {
                padding: 'none',
                size: 'small',
              };
            },
          }}
        />
      </MuiThemeProvider>
      <Dialog open={open}>
        <DialogTitle>Submission import</DialogTitle>
        <LoadingItemList progress={summaryProgress} />
        <LinearProgress variant="determinate" value={progress} />
      </Dialog>
    </div>
  );
}
