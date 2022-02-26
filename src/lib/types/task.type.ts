export type SubTaskType = {
  id: string;
  title: string;
  isComplete: boolean;
};

export enum TaskStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  LOCKED = "locked",
}

export type StartupTaskType = {
  id: string;
  title: string;
  sub_tasks: SubTaskType[];
  status: TaskStatus;
};
