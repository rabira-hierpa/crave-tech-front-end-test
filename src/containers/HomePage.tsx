import React, { useContext, useEffect, useState } from "react";
import TaskInput from "../components/TaskInput";
import TaskList from "../components/TaskList";
import { TaskContext } from "../store/task-context";

const AlertMessage:React.FC = () => {
  const { allTasksCompleted } = useContext(TaskContext);
  const [alertMessage, setAlertMessage] = useState<any>({});

  const getFact = async () => {
    const response = await fetch("https://uselessfacts.jsph.pl/random.json")
      .then((res: any) => {
        return res.json();
      })
      .then((data: any) => {
        return data;
      });
    setAlertMessage(response);
  };
  useEffect(() => {
    if (allTasksCompleted) {
      getFact();
    }
  }, [allTasksCompleted]);

  return (
    <div className="flex text-xl font-semibold ">
      {allTasksCompleted ? (
        <div className="bg-slate-50 p-10 w-full">
          <div className="flex flex-col text-center ">
            <div className="text-yellow-400">{alertMessage?.text}</div>
            <div className="items-end italic">{alertMessage?.source}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

const HomePage = () => {
  const { allTasks, addTask, setInitialState } = useContext(TaskContext);

  //TODO: add a loading state until the initial state is written to localStorage
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
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <Header />
      <AlertMessage />
      <div className="grid justify-items-center">
        <div className="w-1/2 mx-96 px-10 mt-10 bg-slate-100 rounded-2xl shadow-sm">
          <div className="flex flex-col p-10">
            <TaskInput addTask={addTask} />
            <TaskList />
          </div>
        </div>
      </div>
    </div>
  );
};

const Header: React.VFC = () => {
  return (
    <nav id="navHeader" className="bg-yellow-400 py-2 shadow-md">
      <h1 className="text-center text-3xl font-bold">
        Startup Progress Tracker
      </h1>
    </nav>
  );
};

export default HomePage;
