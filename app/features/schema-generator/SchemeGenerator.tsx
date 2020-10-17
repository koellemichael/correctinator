/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AceEditor from 'react-ace';
import YAML from 'yaml';
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  createStyles,
  Dialog,
  DialogTitle,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Paper,
  Snackbar,
  Theme,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { red } from 'chalk';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import routes from '../../constants/routes.json';

import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-github';
import TaskSchemeList from './TaskSchemeList';
import HorizontalLinearStepper from './HorizontalStepper';
import styles from './SchemeGenerator.css';
import {
  getAllSubmissionDirectories,
  getSubmissionDir,
  getSubmissionFromAppDataDir,
  getUniqueSheets,
  saveSubmissions,
} from '../../utils/FileAccess';

export default function SchemeGenerator() {
  const [schema, setSchema] = useState([]) as any;
  const [taskCounter, setTaskCounter] = useState(0) as any;
  const [selected, setSelected] = useState({}) as any;
  const [open, setOpen] = useState(false) as any;
  const [openDialog, setOpenDialog] = useState(false) as any;
  const [message, setMessage] = useState('Test Message') as any;
  const [sheets, setSheets] = useState([]) as any;
  const [submissions, setSubmissions] = useState([]) as any;

  function addTask(task: any, parent: any) {
    const duplicates = parent?.filter((t: any) => t.name === task.name);
    if (duplicates?.length > 0) {
      throw new Error('');
    }
    if (parent) {
      parent.tasks.push(task);
      setSchema(schema);
    } else {
      setSchema((old: any) => [...old, task]);
    }
  }

  function setTasks(tasks: any) {
    setSchema(tasks);
  }

  function sumParam(tasks: any, param: string): any {
    let sum = 0;
    tasks?.forEach((t: any) => {
      if (t.tasks.length > 0) {
        sum += Number.parseFloat(sumParam(t.tasks, param));
      } else {
        console.log();
        sum += Number.parseFloat(t[param]);
      }
    });
    return sum;
  }

  function onAddTask() {
    try {
      addTask(
        {
          id: taskCounter,
          name: `Aufgabe ${taskCounter + 1}`,
          max: '5',
          value: '3',
          type: 'points',
          step: '0.5',
          comment: '',
          tasks: [],
        },
        null
      );
      setTaskCounter(taskCounter + 1);
      console.log('Added task');
    } catch (error) {
      console.error(error);
    }
  }

  function clearAllTasks() {
    setSchema([]);
    console.log('All tasks cleared!');
  }

  function fireSnack(msg: string) {
    setMessage(msg);
    setOpen(true);
  }

  function updateTask(tasksArray: any, task: any) {
    for (let i = 0; i < tasksArray.length; i += 1) {
      if (tasksArray[i].id === task.id) {
        tasksArray[i] = task;
        return;
      }
      updateTask(tasksArray[i].tasks, task);
    }
  }

  function deleteTask(tasksArray: any, task: any, parent: any, fullArray: any) {
    for (let i = 0; i < tasksArray.length; i += 1) {
      if (tasksArray[i].id === task.id) {
        tasksArray.splice(i, 1);
        if (tasksArray.length <= 0 && parent) {
          console.log('Restoring parent');
          updateTask(fullArray, {
            ...parent,
            max: '0',
            value: '0',
            type: 'points',
            step: '0.5',
            comment: '',
          });
        }
        fireSnack(`Deleted task "${task.name}"`);
        return;
      }
      deleteTask(tasksArray[i].tasks, task, tasksArray[i], fullArray);
    }
  }

  function onDeleteSelected() {
    const temp = [...schema];
    deleteTask(temp, selected, null, temp);
    setSchema(temp);
  }

  function onAddSubTask() {
    const tempTask = {
      id: selected.id,
      name: selected.name,
      type: selected.type,
      tasks: selected.tasks,
    };
    tempTask.tasks?.push({
      id: taskCounter,
      name: `Aufgabe ${taskCounter + 1}`,
      max: '5',
      value: '3',
      type: 'points',
      step: '0.5',
      comment: '',
      tasks: [],
    });
    setTaskCounter(taskCounter + 1);
    const temp = [...schema];
    updateTask(temp, tempTask);
    setSchema(temp);
  }

  function onChange(newValue: any) {
    console.log('change', newValue);
    try {
      const tasks = YAML.parse(newValue);
      setSchema(tasks);
    } catch (error) {
      console.log('YAML Parse Error');
    }
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  function onAssignToSheet() {
    const submissionsTemp: any[] = [];
    const dirs = getAllSubmissionDirectories(getSubmissionDir());
    dirs.forEach((dir) => {
      const sub: any = getSubmissionFromAppDataDir(dir);
      submissionsTemp.push(sub);
    });

    setSubmissions(submissionsTemp);
    const uniqueSheets = getUniqueSheets(submissionsTemp);
    const uniqueSheetsForScheme = uniqueSheets.filter(
      (s) => s.sheet.grading.max === sumParam(schema, 'max')
    );
    setSheets(uniqueSheets);

    if (uniqueSheetsForScheme.length === 0) {
      alert('No sheets availiable with the same max value');
    } else {
      setOpenDialog(true);
    }
  }

  function handleListItemClick(sheet) {
    setOpenDialog(false);
    console.log(sheet);
    const temp: any[] = [];
    submissions.forEach((sub) => {
      const subT = { ...sub };
      subT.tasks = schema;
      temp.push(subT);
    });
    saveSubmissions(temp);
    setSubmissions(temp);
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        marginTop: '24px',
        marginRight: '16px',
      }}
    >
      <Grid container justify="center" alignItems="center">
        <Grid container spacing={2}>
          <Grid
            container
            direction="row"
            justify="space-around"
            alignItems="center"
          >
            <Grid item style={{ marginLeft: '10px' }}>
              <Typography variant="h3">schema generator</Typography>
            </Grid>
            <Grid item style={{ marginLeft: '10px' }}>
              <Typography variant="h6" display="inline">
                {`total: ${sumParam(schema, 'value')}/${sumParam(
                  schema,
                  'max'
                )} points`}
              </Typography>
            </Grid>
            <Grid item style={{ marginRight: '10px' }}>
              <ButtonGroup
                size="small"
                aria-label="small outlined button group"
              >
                <Button type="button" onClick={onAddTask}>
                  Add Task
                </Button>
                <Button
                  type="button"
                  onClick={onAddSubTask}
                  disabled={
                    Object.keys(selected).length === 0 &&
                    selected.constructor === Object
                  }
                >
                  Add subtask
                </Button>
                <Button type="button" onClick={onDeleteSelected}>
                  Delete selected task
                </Button>
                <Button type="button" onClick={clearAllTasks}>
                  Clear Tasks
                </Button>
                <Button type="button" onClick={onAssignToSheet}>
                  Assign scheme to sheet
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
          <Grid item xs={8}>
            <Paper
              elevation={3}
              style={{ height: '570px', overflow: 'auto', padding: '15px' }}
            >
              <TaskSchemeList
                tasks={schema}
                setTasks={setTasks}
                selectedTask={selected}
                setSelected={setSelected}
              />
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper elevation={3} style={{ flex: '600px', overflow: 'auto' }}>
              <AceEditor
                mode="yaml"
                theme="github"
                width="100%"
                style={{ minHeight: '600px' }}
                maxLines={Infinity}
                className={styles.editor}
                value={YAML.stringify(schema)}
                onChange={onChange}
                name="editor"
                editorProps={{ $blockScrolling: true }}
              />
            </Paper>
          </Grid>
        </Grid>
      </Grid>
      <Dialog
        onClose={handleCloseDialog}
        aria-labelledby="simple-dialog-title"
        open={openDialog}
        fullWidth
      >
        <DialogTitle id="simple-dialog-title">Choose sheet</DialogTitle>
        <List>
          {sheets
            .filter((s) => s.sheet.grading.max === sumParam(schema, 'max'))
            .map((sheet) => (
              <ListItem
                button
                onClick={() => handleListItemClick(sheet)}
                key={
                  sheet.term + sheet.school + sheet.course + sheet.sheet.name
                }
              >
                <ListItemText
                  primary={sheet.sheet.name}
                  secondary={`${sheet.course} ${sheet.term}`}
                />
              </ListItem>
            ))}
        </List>
      </Dialog>
    </div>
  );
}
