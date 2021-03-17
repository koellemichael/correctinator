/* eslint react/jsx-props-no-spreading: off */
import React, { useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ipcRenderer, remote } from 'electron';
import { useDispatch, useSelector } from 'react-redux';
import { UpdateInfo } from 'electron-updater';
import * as Path from 'path';
import routes from './constants/routes.json';
import App from './containers/App';
import SchemeGeneratorPage from './containers/SchemeGeneratorPage';
import OverviewPage from './containers/OverviewPage';
import CorrectionViewPage from './containers/CorrectionViewPage';
import SheetOverviewPage from './containers/SheetOverviewPage';
import NewHomePage from './containers/NewHomePage';
import FramelessTitleBar from './containers/FramelessTitleBar';
import { reloadState, save } from './utils/FileAccess';
import { selectUnsavedChanges } from './model/SaveSlice';
import UpdaterDialog from './components/UpdaterDialog';
import {
  CHECK_FOR_UPDATE_PENDING,
  CHECK_FOR_UPDATE_SUCCESS,
  RECEIVE_FILE_PATH,
  REQUEST_FILE_PATH,
} from './constants/ipc';
import { version as currentAppVersion } from '../package.json';
import { workspaceSetPath } from './features/workspace/workspaceSlice';
import ConfirmDialog from './components/ConfirmDialog';

export default function Routes() {
  const dispatch = useDispatch();
  const unsavedChanges = useSelector(selectUnsavedChanges);
  const [openUpdaterDialog, setOpenUpdaterDialog] = useState<boolean>(false);
  const [showNotAvailiable, setShowNotAvailiable] = useState<boolean>(false);
  const [openSaveDialog, setOpenSaveDialog] = useState<boolean>(false);
  const [openSaveDialogNewFile, setOpenSaveDialogNewFile] = useState<boolean>(
    false
  );
  const [newFilePath, setNewFilePath] = useState<string>();

  function updaterDialog(show: boolean) {
    setShowNotAvailiable(show);
    setOpenUpdaterDialog(true);
  }

  function unsavedChangesDialog(path: string) {
    setNewFilePath(path);
    if (unsavedChanges) {
      setOpenSaveDialogNewFile(true);
    } else {
      dispatch(workspaceSetPath(path));
      dispatch(reloadState());
    }
  }

  useEffect(() => {
    ipcRenderer.on(
      CHECK_FOR_UPDATE_SUCCESS,
      (_event, info: UpdateInfo | undefined) => {
        const version = info && info.version;
        if (version && version !== currentAppVersion) {
          // Show updater dialog
          updaterDialog(false);
        }
      }
    );

    ipcRenderer.on(RECEIVE_FILE_PATH, (_event, data: string) => {
      if (Path.extname(data) === '.cor') {
        setNewFilePath(data);
        if (unsavedChanges) {
          setOpenSaveDialogNewFile(true);
        } else {
          dispatch(workspaceSetPath(data));
          dispatch(reloadState());
        }
      }
    });

    // Check for updates at start
    ipcRenderer.send(CHECK_FOR_UPDATE_PENDING);
    // Get file path
    ipcRenderer.send(REQUEST_FILE_PATH);

    return () => {
      ipcRenderer.removeAllListeners(CHECK_FOR_UPDATE_SUCCESS);
      ipcRenderer.removeAllListeners(RECEIVE_FILE_PATH);
    };
  }, [dispatch, unsavedChanges]);

  useEffect(() => {
    const beforeQuit = () => {
      if (unsavedChanges) {
        setOpenSaveDialog(true);
      }
    };
    window.addEventListener('beforeunload', beforeQuit, true);
    return () => {
      window.removeEventListener('beforeunload', beforeQuit, true);
    };
  }, [dispatch, unsavedChanges]);

  const [shouldUseDarkColors, setShouldUseDarkColors] = useState(
    remote.nativeTheme.shouldUseDarkColors
  );

  remote.nativeTheme.on('updated', () =>
    setShouldUseDarkColors(remote.nativeTheme.shouldUseDarkColors)
  );

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: shouldUseDarkColors ? 'dark' : 'light',
        },
        overrides: {
          MuiCssBaseline: {
            '@global': {
              '*::-webkit-scrollbar': {
                width: '0.5em',
                height: '0.5em',
              },
              '*::-webkit-scrollbar-track': {
                '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
              },
              '*::-webkit-scrollbar-thumb': {
                backgroundColor: shouldUseDarkColors
                  ? 'rgba(255,255,255,.2)'
                  : 'rgba(0,0,0,.2)',
                outline: '1px solid slategrey',
                borderRadius: '5px',
              },
              '*::-webkit-scrollbar-corner': {
                opacity: 0,
              },
            },
          },
        },
      }),
    [shouldUseDarkColors]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App>
        <FramelessTitleBar
          setOpenUpdater={updaterDialog}
          unsavedChangesDialog={unsavedChangesDialog}
        />
        <Switch>
          <Route path={routes.SHEETOVERVIEW} component={SheetOverviewPage} />
          <Route path={routes.CORRECTIONVIEW} component={CorrectionViewPage} />
          <Route path={routes.OVERVIEW} component={OverviewPage} />
          <Route
            path={routes.SCHEMAGENERATOR}
            component={SchemeGeneratorPage}
          />
          <Route path={routes.HOME} component={NewHomePage} />
        </Switch>
        <UpdaterDialog
          open={openUpdaterDialog}
          setOpen={setOpenUpdaterDialog}
          showNotAvailiable={showNotAvailiable}
        />
        <ConfirmDialog
          open={openSaveDialog}
          setOpen={setOpenSaveDialog}
          title="Unsaved changes"
          text="Do you want to save your changes?"
          onConfirm={() => {
            dispatch(save());
            setOpenSaveDialog(false);
          }}
          onReject={() => setOpenSaveDialog(false)}
        />
        <ConfirmDialog
          open={openSaveDialogNewFile}
          setOpen={setOpenSaveDialogNewFile}
          title="Unsaved changes"
          text="Do you want to save your changes, before loading the new file?"
          onConfirm={() => {
            dispatch(save());
            setOpenSaveDialogNewFile(false);
            if (newFilePath) {
              dispatch(workspaceSetPath(newFilePath));
              dispatch(reloadState());
            }
          }}
          onReject={() => {
            setOpenSaveDialogNewFile(false);
            if (newFilePath) {
              dispatch(workspaceSetPath(newFilePath));
              dispatch(reloadState());
            }
          }}
        />
      </App>
    </ThemeProvider>
  );
}
