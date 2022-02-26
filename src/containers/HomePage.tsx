import { Form } from "antd";
import React, { useContext, useEffect } from "react";
import TaskInput from "../components/TaskInput";
import { TaskContext } from "../store/task-context";

const HomePage = () => {
  const [TaskForm] = Form.useForm();
  const { allTasks, setInitialState } = useContext(TaskContext);

  useEffect(() => {
    const savedList = window.localStorage.getItem("taskList");
    if (!savedList) {
      const currentTaskList = JSON.parse(savedList || "{}");
      if (!currentTaskList.length) {
        window.localStorage.setItem("taskList", JSON.stringify(allTasks));
      }
      setInitialState(currentTaskList);
    } else {
      const parsedTasks = JSON.parse(savedList || "{}");
      setInitialState(parsedTasks);
    }
  }, []);

  return (
    <div className="bg-slate-200 w-1/2">
      <div className="h-screen">
        <nav className="bg-yellow-400 py-4">
          <h1 className="text-center text-2xl font-bold">
            Startup Progress Tracker
          </h1>
        </nav>
        <div className="flex flex-col pt-28 ">
          <TaskInput taskList={allTasks} />
          {/* <TaskList> */}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
