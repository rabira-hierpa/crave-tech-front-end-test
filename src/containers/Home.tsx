import { Checkbox, Form } from "antd";
import React, { useEffect, useState } from "react";
import { StartupTaskType, TaskStatus } from "../lib/types/task.type";

const initialState:StartupTaskType[] = [
  {
    title: "My Foundation",
    sub_tasks: [],
    status: TaskStatus.ACTIVE,
  },
  {
    title: "Discovery",
    sub_tasks: [],
    status: TaskStatus.LOCKED,
  },
  {
    title: "Delivery",
    sub_tasks: [],
    status: TaskStatus.LOCKED,
  },
];

const Home = () => {
  const [TaskForm] = Form.useForm();
  const [taskList, setTaskList] = useState<StartupTaskType[]>([]);

  useEffect(() => {
    const savedList = localStorage.getItem("taskList");
    if (typeof savedList === "string") {
      const currentTaskList = JSON.parse(savedList);
      if (!currentTaskList.length) {
        localStorage.setItem("taskList", JSON.stringify(initialState));
      }
      setTaskList(currentTaskList);
    } else {
      setTaskList(initialState);
    }
  }, []);

  return (
    <div>
      {taskList?.map((task) => {
        return (
          <>
            <h1>{task.title}</h1>
            <Form.List name="sub_tasks" initialValue={task.sub_tasks}>
              {(fields) => {
                return (
                  <div>
                    {fields.map((field) => (
                      <Form.Item {...field}>
                        <Checkbox />
                      </Form.Item>
                    ))}
                  </div>
                );
              }}
            </Form.List>
          </>
        );
      })}
    </div>
  );
};

export default Home;
