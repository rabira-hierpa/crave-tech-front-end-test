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
  setInitialState: Dispatch<SetStateAction<StartupTaskType[]>>;
}

export const TaskContext = createContext<ITaskContext>({
  allTasks: [],
  unlockNextStage: (startupProgress: StartupTaskType[]) => {},
  addTask: (startupTask: StartupTaskType) => {},
  setInitialState: () => {},
});

const TaskContextProvider: React.FC = (props) => {
  const [taskListContext, setTaskListContext] =
    useState<StartupTaskType[]>(initialState);

  function addTask(task: StartupTaskType) {
    setTaskListContext((taskList: StartupTaskType[]) => {
      return taskList.concat(task);
    });
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

  const _taskContext = {
    addTask: addTask,
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
