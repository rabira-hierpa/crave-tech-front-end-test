import React, { useEffect, useState } from "react";
import { StartupTaskType } from "../lib/types/task.type";


const TaskInput:React.FC = () => {
  const [taskList, setTaskList] = useState<StartupTaskType[]>([]);

  useEffect(() => {
	//@ts-ignore
    const currentTaskList:StartupTaskType[] = JSON.parse(localStorage.getItem("taskList"))

    if (currentTaskList) {
      setTaskList(currentTaskList);
    }
  }, []);



  return <div>TaskInput</div>;
};

export default TaskInput;
