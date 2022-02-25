export type SubTaskType = {
  title: string;
  isComplete: boolean;
};

export enum TaskStatus {
  ACTIVE = "active",
  COMPELTED = "completed",
  LOCKED = "locked",
}

export type StartupTaskType = {
  title: string;
  sub_tasks: SubTaskType[];
  status: TaskStatus;
};
