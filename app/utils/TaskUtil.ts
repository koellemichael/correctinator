import ParentTask from '../model/ParentTask';
import ParentTaskEntity from '../model/ParentTaskEntity';
import RateableTask from '../model/RateableTask';
import SingleChoiceTask from '../model/SingleChoiceTask';
import Task from '../model/Task';
import TaskEntity from '../model/TaskEntity';

export function isParentTaskEntity(t: TaskEntity): t is ParentTaskEntity {
  return (t as ParentTaskEntity).tasks !== undefined;
}

export function isParentTask(t: Task): t is ParentTask {
  return (t as ParentTask).tasks !== undefined;
}

export function isRateableTask(t: Task | TaskEntity): t is RateableTask {
  return (t as RateableTask).max !== undefined;
}

export function isSingleChoiceTask(
  t: Task | TaskEntity
): t is SingleChoiceTask {
  return (t as SingleChoiceTask).answer !== undefined;
}

export function hasTasksWithZeroMax(ts: Task[] | TaskEntity[]): boolean {
  const test: Task | TaskEntity = (ts as any).find((t: Task | TaskEntity) => {
    if (isRateableTask(t)) {
      if (t.max === 0) {
        return true;
      }
    } else if (isSingleChoiceTask(t)) {
      if (t.answer.value === 0) {
        return true;
      }
    }
    return false;
  });
  return test !== undefined;
}

export function getTopLevelTasks(tasks: Task[]): Task[] {
  const top: Task[] = [];

  tasks.forEach((t1) => {
    let hit = false;
    tasks.forEach((t2) => {
      if (
        isParentTask(t2) &&
        t2.tasks.find((t) => t.id === t1.id) !== undefined
      ) {
        hit = true;
      }
    });
    if (!hit) {
      top.push(t1);
    }
  });

  return top;
}

export function removeTaskIds(tasks: Task[], res: any = []) {
  tasks.forEach((t) => {
    if (isParentTask(t)) {
      const { id, ...rest } = t;
      const temp: any = { ...rest };
      temp.tasks = removeTaskIds(t.tasks);
      res.push(temp);
    } else {
      const { id, ...rest } = t;
      const temp = { ...rest };
      res.push(temp);
    }
  });
  return res;
}

export function flatMapTask(pt: ParentTask, list: Task[] = []) {
  list.push(pt);
  pt.tasks.forEach((t) => {
    if (isParentTask(t)) {
      flatMapTask(t, list);
    } else {
      list.push(t);
    }
  });
  return list;
}
