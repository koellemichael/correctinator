/* eslint-disable react/destructuring-assignment */
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  LinearProgress,
  ListItem,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from '@material-ui/core';
import React, { useState } from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useDispatch, useSelector } from 'react-redux';
import { denormalize } from 'normalizr';
import Correction from '../../model/Correction';
import Sheet from '../../model/Sheet';
import { setTabIndex } from '../../model/HomeSlice';
import Status from '../../model/Status';
import { SheetSchema } from '../../model/NormalizationSchema';
import { correctionPageSetSheetId } from '../../model/CorrectionPageSlice';
import { schemaSetSelectedSheet } from '../../model/SchemaSlice';
import { selectWorkspacePath } from '../workspace/workspaceSlice';
import SheetEntity from '../../model/SheetEntity';
import {
  selectAllEntities,
  selectCorrectionsBySheetId,
} from '../../model/Selectors';
import { msToTime } from '../../utils/TimeUtil';
import { getRateableTasks, isSingleChoiceTask } from '../../utils/TaskUtil';
import { selectSettingsGeneral } from '../../model/SettingsSlice';
import { useModal } from '../../modals/ModalProvider';
import ExportModal from '../../modals/ExportModal';
import ConfirmationDialog from '../../dialogs/ConfirmationDialog';
import ConfirmDeleteSheetDialog from '../../dialogs/ConfirmDeleteSheetDialog';
import AutoCorrectionModal from '../../modals/AutoCorrectionModal';

export default function SheetCard(props: { sheet: SheetEntity }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const showModal = useModal();
  const workspace = useSelector(selectWorkspacePath);
  const { autosave } = useSelector(selectSettingsGeneral);
  const entities = useSelector(selectAllEntities);
  const sheet: Sheet = denormalize(props.sheet, SheetSchema, entities);
  const corrections: Correction[] = useSelector(
    selectCorrectionsBySheetId(sheet.id)
  );
  const [anchorEl, setAnchorEl] = useState(null);

  const notInitialized =
    corrections.filter(
      (c) =>
        c?.ratings === undefined ||
        c?.ratings?.length === 0 ||
        c?.submission.sheet.tasks === undefined ||
        c?.submission.sheet.tasks?.length === 0
    ).length > 0;

  const autoCorrectionAvailiable =
    sheet.tasks &&
    getRateableTasks(sheet.tasks).filter((t) => isSingleChoiceTask(t))
      .length !== 0;
  const correctionsFinished =
    corrections.filter((c) => c.status !== Status.Done).length === 0;
  const autoCorrectionAttempted =
    corrections.length !== 0 &&
    corrections.filter((c) => c.autoCorrectionAttempted !== true).length === 0;

  function onStartCorrection() {
    dispatch(correctionPageSetSheetId(sheet.id));
    dispatch(setTabIndex(3));
  }

  function onCreateSchema() {
    dispatch(schemaSetSelectedSheet(sheet.id));
    dispatch(setTabIndex(2));
  }

  function onOpenMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  function onCloseMenu() {
    setAnchorEl(null);
  }

  function onExport() {
    setAnchorEl(null);
    showModal(ExportModal, { sheetId: sheet.id });
  }

  function onOpenConfirmDialog() {
    onCloseMenu();
    showModal(
      ConfirmationDialog,
      ConfirmDeleteSheetDialog(autosave, sheet, workspace, corrections)
    );
  }

  function onAutoCorrectSingleChoiceTasks() {
    showModal(AutoCorrectionModal, { sheetId: sheet.id });
    setAnchorEl(null);
  }

  return (
    <ListItem style={{ width: 'fit-content', margin: '0 auto' }}>
      <Card elevation={4}>
        <CardHeader
          // eslint-disable-next-line prettier/prettier
          action={(
            <>
              <IconButton onClick={onOpenMenu}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={onCloseMenu}
              >
                <MenuItem onClick={onExport}>Export corrections</MenuItem>
                <MenuItem onClick={onOpenConfirmDialog}>Delete sheet</MenuItem>
                <MenuItem onClick={onCreateSchema}>New task schema</MenuItem>
                <MenuItem
                  onClick={onAutoCorrectSingleChoiceTasks}
                  disabled={!autoCorrectionAvailiable}
                >
                  Auto correct single choice tasks
                </MenuItem>
              </Menu>
            </>
            // eslint-disable-next-line prettier/prettier
          )}
          // eslint-disable-next-line prettier/prettier
          subheader={(
            <>
              <div>
                {`${sheet.school.name} - ${sheet.course.name} ${
                  sheet.term.summerterm
                    ? `SoSe ${sheet.term.year}`
                    : `WiSe ${sheet.term.year}`
                } - ${[
                  ...new Set(corrections.map((c) => c.corrector.name)),
                ].join('-')}`}
              </div>
            </>
            // eslint-disable-next-line prettier/prettier
          )}
          title={sheet.name}
        />
        <CardContent>
          {notInitialized ? (
            <Typography variant="body2" color="textSecondary">
              <i
                className="fas fa-exclamation-circle"
                style={{
                  marginRight: '10px',
                  color:
                    theme.palette.type === 'dark'
                      ? theme.palette.warning.dark
                      : theme.palette.warning.light,
                }}
              />
              Exercise sheet does not contain a task schema
            </Typography>
          ) : undefined}
          {!notInitialized && !correctionsFinished ? (
            <Typography variant="body2" color="textSecondary">
              <i
                className="fas fa-info-circle"
                style={{
                  marginRight: '10px',
                  color:
                    theme.palette.type === 'dark'
                      ? theme.palette.info.dark
                      : theme.palette.info.light,
                }}
              />
              {`Ready for correction - ${
                corrections.filter((c) => c.status !== Status.Done).length
              } left`}
            </Typography>
          ) : undefined}
          {!notInitialized &&
          !correctionsFinished &&
          corrections.filter((c) => c.status === Status.Marked).length > 0 ? (
            <Typography variant="body2" color="textSecondary">
              <i
                className="fas fa-info-circle"
                style={{
                  marginRight: '10px',
                  color:
                    theme.palette.type === 'dark'
                      ? theme.palette.info.dark
                      : theme.palette.info.light,
                }}
              />
              {`You have marked ${
                corrections.filter((c) => c.status === Status.Marked).length
              } corrections`}
            </Typography>
          ) : undefined}
          {!notInitialized && correctionsFinished ? (
            <Typography variant="body2" color="textSecondary">
              <i
                className="fas fa-check-circle"
                style={{
                  marginRight: '10px',
                  color:
                    theme.palette.type === 'dark'
                      ? theme.palette.success.dark
                      : theme.palette.success.light,
                }}
              />
              Correction finished
            </Typography>
          ) : undefined}
          {autoCorrectionAvailiable &&
          !correctionsFinished &&
          !autoCorrectionAttempted ? (
            <Typography variant="body2" color="textSecondary">
              <i
                className="fas fa-info-circle"
                style={{
                  marginRight: '10px',
                  color:
                    theme.palette.type === 'dark'
                      ? theme.palette.info.dark
                      : theme.palette.info.light,
                }}
              />
              You may try to automatically correct single choice tasks
            </Typography>
          ) : undefined}
        </CardContent>
        <CardActions>
          <Grid container justify="space-between" alignItems="center">
            {notInitialized ? (
              <Grid item>
                <Button onClick={onCreateSchema}>New Task Schema</Button>
              </Grid>
            ) : (
              <Grid item>
                <Button onClick={onStartCorrection}>Correction</Button>
              </Grid>
            )}
            {autoCorrectionAvailiable &&
            !correctionsFinished &&
            !autoCorrectionAttempted ? (
              <Grid item>
                <Button onClick={onAutoCorrectSingleChoiceTasks}>
                  Auto Correction
                </Button>
              </Grid>
            ) : undefined}
            {!notInitialized && correctionsFinished ? (
              <Grid item>
                <Button onClick={onExport}>Export</Button>
              </Grid>
            ) : undefined}
            <Grid item style={{ marginRight: '10px' }}>
              <Typography variant="body2" color="textSecondary">
                <i className="far fa-clock" style={{ marginRight: '10px' }} />
                {msToTime(
                  corrections
                    .filter((s) => s.timeElapsed)
                    .reduce(
                      (a, c) => a + (c.timeElapsed ? c.timeElapsed : 0),
                      0
                    )
                )}
              </Typography>
            </Grid>
          </Grid>
        </CardActions>
        <LinearProgress
          variant="determinate"
          value={
            (corrections.filter((s) => s.status === Status.Done).length /
              corrections.length) *
            100
          }
        />
      </Card>
    </ListItem>
  );
}
