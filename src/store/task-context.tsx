import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";
import {
  StartupTaskType,
  SubTaskType,
  TaskStatus,
} from "../lib/types/task.type";
import { v4 as uuidv4 } from "uuid";

const initialState: StartupTaskType[] = [
  {
    id: uuidv4(),
    title: "My Foundation",
    sub_tasks: [],
    status: TaskStatus.ACTIVE,
  },
  {
    id: uuidv4(),
    title: "Discovery",
    sub_tasks: [],
    status: TaskStatus.LOCKED,
  },
  {
    id: uuidv4(),
    title: "Delivery",
    sub_tasks: [],
    status: TaskStatus.LOCKED,
  },
];

interface ITaskContext {
  allTasks: StartupTaskType[];
  unlockNextStage: (param: StartupTaskType[]) => void;
  addTask: (param: StartupTaskType) => void;
  addSubTask: (taskId: string, subtasks: SubTaskType[]) => void,
  setInitialState: Dispatch<SetStateAction<StartupTaskType[]>>;
}

export const TaskContext = createContext<ITaskContext>({
  allTasks: [],
  unlockNextStage: (startupProgress: StartupTaskType[]) => {},
  addTask: (startupTask: StartupTaskType) => {},
  addSubTask: (taskId: string, subtasks: SubTaskType[]) => {} ,
  setInitialState: () => {},
});

const TaskContextProvider: React.FC = (props) => {
  const [taskListContext, setTaskListContext] =
    useState<StartupTaskType[]>(initialState);

  function addTask(task: StartupTaskType) {
    setTaskListContext((taskList: StartupTaskType[]) => {
      writeToLocalStorage(taskList.concat(task));
      return taskList.concat(task);
    });
  }

  function addSubTask(taskId: string, subtasks: SubTaskType[]) {
    const task = taskListContext.find(
      (_task: StartupTaskType) => _task.id === taskId
    );
    if (task) {
      task.sub_tasks = subtasks;
      const updatedTask = taskListContext.map((_task: StartupTaskType) => {
        return _task.id !== taskId ? _task : (_task = task);
      });
      writeToLocalStorage(updatedTask);
    }
  }

  const unlockNextStage = (_startupProgress: StartupTaskType[]): void => {
    for (let i = 0; i < _startupProgress.length; i++) {
      const progress: StartupTaskType = _startupProgress[i];
      if (progress.status === TaskStatus.ACTIVE) {
        const allTasksComplete: boolean = progress.sub_tasks.some(
          (item: SubTaskType) => item.isComplete === false
        );
        if (!allTasksComplete) {
          progress.status = TaskStatus.COMPLETED;
          _startupProgress[i + 1].status = TaskStatus.ACTIVE;
          break;
        }
      }
    }
  };

  const writeToLocalStorage = (data: StartupTaskType[]) => {
    window.localStorage.setItem("taskList", JSON.stringify(data));
  };

  const _taskContext = {
    addTask: addTask,
    addSubTask: addSubTask,
    allTasks: taskListContext,
    unlockNextStage: unlockNextStage,
    setInitialState: setTaskListContext,
  };

  return (
    <TaskContext.Provider value={_taskContext}>
      {props.children}
    </TaskContext.Provider>
  );
};

export default TaskContextProvider;
