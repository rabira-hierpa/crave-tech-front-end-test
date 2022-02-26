import { Form, Checkbox, Input, Button } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useState } from "react";
import { StartupTaskType, SubTaskType } from "../lib/types/task.type";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { v4 as uuid } from "uuid";
interface ITaskList {
  taskList: StartupTaskType[];
  addSubTask: (taskId: string, subtasks: SubTaskType[]) => void;
}
const TaskList: React.FC<ITaskList> = (props) => {
  const [SubTaskForm] = useForm();
  const { taskList, addSubTask } = props;
  const [selectedTask, setSelectedTask] = useState<string>();
  const [toggleSubTaskForm, setToggleSubTaskForm] = useState<boolean>(false);

  const handleAddSubTask = (taskId: string) => {
    const { validateFields } = SubTaskForm;
    console.log({ taskId });
    setSelectedTask(taskId);
    setToggleSubTaskForm(true);

    try {
      validateFields().then((values) => {
        if (values?.subtask) {
          let updatedTask = taskList.find((task) => task.id === taskId);
          if (updatedTask) {
            const _newSubTask:SubTaskType = {
              id: uuid(),
              title: values?.subtask,
              isComplete: false,
            };
            updatedTask?.sub_tasks.push(_newSubTask);
            const updatedSubTask = updatedTask.sub_tasks;
            addSubTask(taskId, updatedSubTask);
            setToggleSubTaskForm(false);
            setSelectedTask("");
          }
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveInputField = (): void => {
    setToggleSubTaskForm(false);
  };

  return (
    <div>
      {taskList?.map((task) => {
        return (
          <div key={task.id}>
            <div className="">
              <div className="flex justify-between">
                <h1 className="text-xl font-semibold">{task.title}</h1>
                <Button
                  type="dashed"
                  onClick={() => handleAddSubTask(task.id)}
                  style={{ width: "10%" }}
                  icon={<PlusOutlined />}
                />
              </div>
              {task.id === selectedTask && toggleSubTaskForm ? (
                <Form
                  form={SubTaskForm}
                  onFinish={() => handleAddSubTask(task.id)}
                >
                  <Form.Item
                    name="subtask"
                    rules={[
                      { required: true, message: "Please enter a milestone" },
                    ]}
                  >
                    <div className="flex p-2 space-x-2">
                      <Input placeholder="E.g setup virtual office" />
                      <Button
                        type="dashed"
                        onClick={handleRemoveInputField}
                        style={{ width: "10%" }}
                        icon={<MinusCircleOutlined />}
                      />
                    </div>
                  </Form.Item>
                </Form>
              ) : null}
              <SubTaskList allSubTasks={task.sub_tasks} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface ISubTaskList {
  allSubTasks: SubTaskType[];
}

const SubTaskList: React.VFC<ISubTaskList> = ({ allSubTasks }) => {
  return (
    <div className="pl-5">
      {allSubTasks?.map((subTask) => (
        <div key={subTask.id} className="flex space-x-5">
          <Checkbox defaultChecked={subTask.isComplete} />
          <p className="text-md">{subTask.title}</p>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
