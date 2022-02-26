import { Form, Checkbox } from "antd";
import React from "react";
import { StartupTaskType } from "../lib/types/task.type";
interface ITaskList {
  taskList: StartupTaskType[];
}
const TaskList: React.FC<ITaskList> = (props) => {
  const { taskList } = props;
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

export default TaskList;
