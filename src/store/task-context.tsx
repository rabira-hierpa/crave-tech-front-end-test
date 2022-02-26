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
import { v4 as UUID } from "uuid";

const initialState: StartupTaskType[] = [
  {
    id: UUID(),
    title: "Foundation",
    sub_tasks: [],
    status: TaskStatus.ACTIVE,
  },
  {
    id: UUID(),
    title: "Discovery",
    sub_tasks: [],
    status: TaskStatus.LOCKED,
  },
  {
    id: UUID(),
    title: "Delivery",
    sub_tasks: [],
    status: TaskStatus.LOCKED,
  },
];

interface ITaskContext {
  allTasks: StartupTaskType[];
  allTasksCompleted: boolean;
  unlockNextStage: (param: StartupTaskType[]) => void;
  addTask: (param: StartupTaskType) => void;
  addSubTask: (taskId: string, subtasks: SubTaskType[]) => void;
  findTaskById: (taskId: string) => StartupTaskType | undefined;
  setInitialState: Dispatch<SetStateAction<StartupTaskType[]>>;
}

export const TaskContext = createContext<ITaskContext>({
  allTasks: [],
  allTasksCompleted: undefined,
  unlockNextStage: (startupProgress: StartupTaskType[]) => {},
  addTask: (startupTask: StartupTaskType) => {},
  addSubTask: (taskId: string, subtasks: SubTaskType[]) => {},
  findTaskById: (taskId: string) => undefined,
  setInitialState: () => {},
});

const TaskContextProvider: React.FC = (props) => {
  const [taskListContext, setTaskListContext] =
    useState<StartupTaskType[]>(initialState);
  const [allTasksCompleted, setAllTasksCompleted] = useState<boolean>(false);

  function checkActiveTask(): boolean {
    return taskListContext.some((task) => task.status === TaskStatus.ACTIVE);
  }

  function findTaskById(taskId: string): StartupTaskType | undefined {
    return taskListContext.find((task) => task.id === taskId);
  }

  function addTask(task: StartupTaskType) {
    if (!checkActiveTask()) {
      setTaskListContext((taskList: StartupTaskType[]) => {
        writeToLocalStorage(taskList.concat(task));
        return taskList.concat(task);
      });
    } else {
      task.status = TaskStatus.LOCKED;
      setTaskListContext((taskList: StartupTaskType[]) => {
        writeToLocalStorage(taskList.concat(task));
        return taskList.concat(task);
      });
    }
    setAllTasksCompleted(false)
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
      unlockNextStage(updatedTask);
    }
  }

  const unlockNextStage = (_startupProgress: StartupTaskType[]): void => {
    let nextStep = 0;
    for (const progress of _startupProgress) {
      if (progress.status === TaskStatus.ACTIVE && progress.sub_tasks.length) {
        const allTasksComplete: boolean = progress.sub_tasks.some(
          (item: SubTaskType) => item.isComplete === false
        );
        if (
          !allTasksComplete &&
          _startupProgress.indexOf(progress) + 1 < _startupProgress.length
        ) {
          progress.status = TaskStatus.COMPLETED;
          nextStep = _startupProgress.indexOf(progress) + 1;
          _startupProgress[nextStep].status = TaskStatus.ACTIVE;
          setTaskListContext(_startupProgress);
          writeToLocalStorage(_startupProgress);
          break;
        } else if (
          !allTasksComplete &&
          _startupProgress.indexOf(progress) === _startupProgress.length - 1
        ) {
          progress.status = TaskStatus.COMPLETED;
          setTaskListContext(_startupProgress);
          writeToLocalStorage(_startupProgress);
          setAllTasksCompleted(true)
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
    allTasksCompleted: allTasksCompleted,
    allTasks: taskListContext,
    findTaskById: findTaskById,
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
