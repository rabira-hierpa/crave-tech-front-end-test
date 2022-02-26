import { Button, Form, Input } from "antd";
import { v4 as uuid } from "uuid";
import React from "react";
import { StartupTaskType, TaskStatus } from "../lib/types/task.type";

interface ITaskInput {
  addTask: (startupTask: StartupTaskType) => void;
}
const TaskInput: React.FC<ITaskInput> = (props) => {
  const [TaskForm] = Form.useForm();
  const { addTask } = props;

  const handleFinish = (values: any) => {
    const _newMileStone: StartupTaskType = {
      id: uuid(),
      title: values.milestone,
      sub_tasks: [],
      status: TaskStatus.ACTIVE,
    };
    addTask(_newMileStone);
    TaskForm.resetFields();
  };

  return (
    <Form form={TaskForm} onFinish={handleFinish}>
      <div className="flex space-x-5">
        <Form.Item
          name="milestone"
          rules={[{ required: true, message: "Please enter a milestone" }]}
        >
          <Input  placeholder="E.x Startup Foundation" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};

export default TaskInput;
