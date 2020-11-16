/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { ChangeEvent } from 'react';
import TextField from '@material-ui/core/TextField';
import {
  Button,
  ButtonGroup,
  Card,
  CardActions,
  Collapse,
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import styles from './TaskScheme.css';
import { hasTasksWithZeroMax, sumParam } from '../../utils/FileAccess';
import { schemaSetSelectedTask, selectSchema } from '../../model/SchemaSlice';
import Schema from '../../model/Schema';
import { tasksUpdateOne } from '../../model/TaskSlice';

export default function TaskScheme(props: any) {
  const { task, depth } = props;
  const dispatch = useDispatch();
  const schema: Schema = useSelector(selectSchema);
  const selected = schema.selectedTask === task.id;

  const type = 'test type';
  const [expanded, setExpanded] = React.useState(false);
  const INDENT_SIZE = 25;

  function handleChange(e: any) {
    const { value } = e.target;
    const { name } = e.target;

    // Make sure that value <= max
    if (name === 'max') {
      dispatch(
        tasksUpdateOne({
          id: task.id,
          changes: { [name]: value, value: Math.min(task.value, value) },
        })
      );
    } else if (name === 'value') {
      dispatch(
        tasksUpdateOne({
          id: task.id,
          changes: { value: Math.min(value, task.max) },
        })
      );
    } else {
      dispatch(tasksUpdateOne({ id: task.id, changes: { [name]: value } }));
    }
  }

  function onSelection() {
    if (!selected) {
      dispatch(schemaSetSelectedTask(task.id));
    }
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const marginLeft = `${depth * INDENT_SIZE}pt`;

  if (task?.tasks?.length > 0) {
    const sumMax = sumParam(task.tasks, 'max');
    const sumValue = sumParam(task.tasks, 'value');

    return (
      <Card
        style={{ marginLeft }}
        raised={selected}
        className={styles.card}
        onClick={onSelection}
        onKeyDown={onSelection}
      >
        <TextField
          id="outlined-number"
          label="Task name"
          multiline
          name="name"
          value={task.name}
          onChange={handleChange}
          className={styles.fields}
          variant="outlined"
          size="small"
        />
        <TextField
          label="Inital"
          id="value"
          name="value"
          style={{ width: `${type.length * 0.6 + 6}em` }}
          type="number"
          value={sumValue}
          className={styles.fields}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">{type}</InputAdornment>
            ),
          }}
          inputProps={{
            min: 0,
            max: task.max,
            step: task.step,
          }}
          onChange={handleChange}
          size="small"
          variant="outlined"
        />
        <TextField
          label="Max"
          id="max"
          name="max"
          style={{ width: `${type.length * 0.6 + 6}em` }}
          type="number"
          className={styles.fields}
          value={sumMax}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">{type}</InputAdornment>
            ),
          }}
          inputProps={{ min: 0, step: task.step }}
          onChange={handleChange}
          size="small"
          variant="outlined"
          error={hasTasksWithZeroMax([task])}
        />
      </Card>
    );
  }

  return (
    <Card
      raised={selected}
      variant="outlined"
      // variant={selected ? 'elevation' : undefined}
      style={{ marginLeft }}
      onClick={onSelection}
      onKeyDown={onSelection}
      // className={styles.card}
      className={[styles.card, selected ? styles.selected : ''].join(' ')}
    >
      <TextField
        id="outlined-number"
        label="Task name"
        multiline
        name="name"
        value={task.name}
        onChange={handleChange}
        className={styles.fields}
        variant="outlined"
        size="small"
      />
      <TextField
        label="Inital"
        id="value"
        name="value"
        style={{ width: `${type.length * 0.6 + 6}em` }}
        type="number"
        value={task.value}
        className={styles.fields}
        InputProps={{
          endAdornment: <InputAdornment position="end">{type}</InputAdornment>,
        }}
        inputProps={{ min: 0, max: task.max, step: task.step }}
        onChange={handleChange}
        size="small"
        variant="outlined"
      />
      <TextField
        label="Max"
        id="max"
        name="max"
        style={{ width: `${type.length * 0.6 + 6}em` }}
        type="number"
        value={task.max}
        className={styles.fields}
        InputProps={{
          endAdornment: <InputAdornment position="end">{type}</InputAdornment>,
        }}
        inputProps={{ min: 0, step: task.step }}
        onChange={handleChange}
        size="small"
        variant="outlined"
        error={task.max <= 0}
      />
      <IconButton
        onClick={handleExpandClick}
        aria-expanded={expanded}
        aria-label="show more"
        className={styles.expand}
        size="medium"
      >
        {expanded ? (
          <ExpandLess className={styles.expandIcon} />
        ) : (
          <ExpandMore className={styles.expandIcon} />
        )}
      </IconButton>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <TextField
          id="outlined-number"
          label="Step"
          type="number"
          name="step"
          style={{ width: '5em' }}
          className={styles.fields}
          value={task.step}
          inputProps={{ min: '0.5', step: '0.5' }}
          onChange={handleChange}
          variant="outlined"
          size="small"
        />
        <TextField
          id="tasktype"
          label="Type"
          type="text"
          name="type"
          className={styles.fields}
          // style={{ width: '5em' }}
          value={type}
          variant="outlined"
          size="small"
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          id="comment"
          label="Comment"
          multiline
          className={styles.comment}
          name="comment"
          value={task.comment}
          onChange={handleChange}
          variant="outlined"
          size="small"
        />
      </Collapse>
    </Card>
  );
}
