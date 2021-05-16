/* eslint-disable react-hooks/exhaustive-deps */
/* eslint react/jsx-props-no-spreading: off */
import React, { useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import routes from './constants/routes.json';
import App from './containers/App';
import SchemeGeneratorPage from './containers/SchemeGeneratorPage';
import OverviewPage from './containers/OverviewPage';
import CorrectionViewPage from './containers/CorrectionViewPage';
import SheetOverviewPage from './containers/SheetOverviewPage';
import NewHomePage from './containers/NewHomePage';
import TitleBar from './containers/TitleBar';
import { selectUnsavedChanges } from './model/SaveSlice';
import UpdaterDialog from './components/UpdaterDialog';
import { selectWorkspacePath } from './features/workspace/workspaceSlice';
import { selectSettingsBackup } from './model/SettingsSlice';
import { useModal } from './modals/ModalProvider';
import SaveBeforeQuittingEffect from './effects/SaveBeforeQuittingEffect';
import LoadNewFileEffect from './effects/LoadNewFileEffect';
import BackupEffect from './effects/BackupEffect';
import CheckForUpdatesEffect from './effects/CheckForUpdatesEffect';
import RequestFilePathEffect from './effects/RequestFilePathEffect';

export default function Routes() {
  const dispatch = useDispatch();
  const showModal = useModal();
  const unsavedChanges = useSelector(selectUnsavedChanges);
  const saveBackups = useSelector(selectSettingsBackup);
  const workspacePath = useSelector(selectWorkspacePath);
  const [openUpdaterDialog, setOpenUpdaterDialog] = useState<boolean>(false);
  const [showNotAvailiable, setShowNotAvailiable] = useState<boolean>(false);
  const [quitAnyways, setQuitAnyways] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);

  function updaterDialog(show: boolean) {
    setShowNotAvailiable(show);
    setOpenUpdaterDialog(true);
  }

  useEffect(CheckForUpdatesEffect(updaterDialog), []);
  useEffect(RequestFilePathEffect(), []);
  useEffect(LoadNewFileEffect(dispatch, showModal, unsavedChanges), [
    dispatch,
    showModal,
    unsavedChanges,
  ]);
  useEffect(BackupEffect(workspacePath, saveBackups), [
    saveBackups,
    workspacePath,
  ]);
  useEffect(
    SaveBeforeQuittingEffect(
      quitAnyways,
      setQuitAnyways,
      reload,
      setReload,
      showModal,
      unsavedChanges
    ),
    [quitAnyways, setQuitAnyways, reload, setReload, showModal, unsavedChanges]
  );

  return (
    <App>
      <TitleBar setOpenUpdater={updaterDialog} setReload={setReload} />
      <Switch>
        <Route path={routes.SHEETOVERVIEW} component={SheetOverviewPage} />
        <Route path={routes.CORRECTIONVIEW} component={CorrectionViewPage} />
        <Route path={routes.OVERVIEW} component={OverviewPage} />
        <Route path={routes.SCHEMAGENERATOR} component={SchemeGeneratorPage} />
        <Route path={routes.HOME} component={NewHomePage} />
      </Switch>
      <UpdaterDialog
        open={openUpdaterDialog}
        setOpen={setOpenUpdaterDialog}
        showNotAvailiable={showNotAvailiable}
      />
    </App>
  );
}
