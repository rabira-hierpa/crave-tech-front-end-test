import { Form, Checkbox, Input, Button } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useContext, useState } from "react";
import { SubTaskType, TaskStatus } from "../lib/types/task.type";
import {
  CheckCircleFilled,
  LockOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { v4 as uuid } from "uuid";
import { TaskContext } from "../store/task-context";

interface ITaskList {}

const TaskList: React.FC<ITaskList> = (props) => {
  const [SubTaskForm] = useForm();
  const { allTasks, addSubTask, findTaskById } = useContext(TaskContext);
  const [selectedTask, setSelectedTask] = useState<string>();
  const [toggleSubTaskForm, setToggleSubTaskForm] = useState<boolean>(false);

  const handleAddSubTask = (taskId: string) => {
    const { validateFields } = SubTaskForm;
    setSelectedTask(taskId);
    setToggleSubTaskForm(true);

    try {
      validateFields().then((values) => {
        if (values?.subtask) {
          let updatedTask = allTasks.find((task) => task.id === taskId);
          if (updatedTask) {
            const _newSubTask: SubTaskType = {
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

  const handleSubTaskComplete = (taskId: string, subTaskId: string) => {
    const _task = findTaskById(taskId);
    if (_task) {
      const _subTask = _task.sub_tasks.find(
        (_subTask) => _subTask.id === subTaskId
      );
      if (_subTask) {
        _subTask.isComplete = !_subTask.isComplete;
        addSubTask(taskId, _task.sub_tasks);
      }
    }
  };

  const getTaskStatus = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.LOCKED:
        return <LockOutlined />;
      case TaskStatus.COMPLETED:
        return <CheckCircleFilled />;
      default:
        return null;
    }
  };

  return (
    <div>
      {allTasks?.map((task) => {
        return (
          <div key={task.id}>
            <div className="">
              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <div className="flex self-center items-center">
                    {getTaskStatus(task.status)}
                  </div>
                  <h1 className="text-xl font-semibold ">{task.title}</h1>
                </div>
                {task.status === TaskStatus.ACTIVE ? (
                  <Button
                    type="dashed"
                    onClick={() => handleAddSubTask(task.id)}
                    style={{ width: "10%" }}
                    icon={<PlusOutlined />}
                  />
                ) : null}
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
              <SubTaskList
                taskId={task.id}
                taskStatus={task.status}
                allSubTasks={task.sub_tasks}
                handleSubTaskComplete={handleSubTaskComplete}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface ISubTaskList {
  taskId: string;
  taskStatus: TaskStatus;
  allSubTasks: SubTaskType[];
  handleSubTaskComplete: (taskId: string, subTaskId: string) => void;
}

const SubTaskList: React.VFC<ISubTaskList> = ({
  taskId,
  taskStatus,
  allSubTasks,
  handleSubTaskComplete,
}) => {
  return (
    <div className="pl-5">
      {allSubTasks?.map((subTask) => (
        <div key={subTask.id} className="flex space-x-5">
          <Checkbox
            disabled={taskStatus === TaskStatus.COMPLETED ? true : false}
            defaultChecked={subTask.isComplete}
            onClick={() => handleSubTaskComplete(taskId, subTask.id)}
          />
          <p className="text-md">{subTask.title}</p>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
