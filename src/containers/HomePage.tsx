import React, { useContext, useEffect } from "react";
import TaskInput from "../components/TaskInput";
import TaskList from "../components/TaskList";
import { TaskContext } from "../store/task-context";

const HomePage = () => {
  const { allTasks, addTask, addSubTask, setInitialState } =
    useContext(TaskContext);

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
    <div className="">
      <Header />
      <div className="grid justify-items-center">
        <div className="w-1/2 mx-96 px-10 mt-10 bg-slate-100">
          <div className="flex flex-col p-10">
            <TaskInput addTask={addTask} />
            <TaskList taskList={allTasks} addSubTask={addSubTask} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Header: React.VFC = () => {
  return (
    <nav className="bg-yellow-400 py-5 shadow-md">
      <h1 className="text-center text-3xl font-bold">
        Startup Progress Tracker
      </h1>
    </nav>
  );
};

export default HomePage;
