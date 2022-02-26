import { Checkbox, Form } from "antd";
import React, { useEffect, useState } from "react";
import { StartupTaskType } from "../lib/types/task.type";

interface ITaskInput {
  taskList: StartupTaskType[];
}
const TaskInput: React.FC<ITaskInput> = (props) => {
  const [TaskForm] = Form.useForm();
  const { taskList } = props;
  useEffect(() => {}, []);

  return (
    <div>
      {taskList?.map((task) => {
        return (
          <div key={task.id}>
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
          </div>
        );
      })}
    </div>
  );
};

export default TaskInput;
