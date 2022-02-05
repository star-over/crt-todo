/* eslint-disable comma-dangle */
/* eslint-disable function-paren-newline */
import { observer } from 'mobx-react';
import React, {
  ChangeEvent, KeyboardEvent, MouseEvent, useEffect, useState
} from 'react';
import * as yup from 'yup';
import { ValidationError } from 'yup';
import Filter from '../../components/Filter/Filter';
import { IMessage, Message, MessageMode } from '../../components/Message/Message';
import NewTask from '../../components/NewTask/NewTask';
import { TaskList } from '../../components/TaskList/TaskList';
import StoreContext, { stores } from '../../store/StoreContext';
import { IStatistic } from '../../store/TasksStore';
import './Main.css';

export const MainPage = ():JSX.Element => {
  const [pendingTask, setPendingTask] = useState<string>('');
  const [message, setMessage] = useState<IMessage>({ text: 'Hello there!', mode: MessageMode.info });

  useEffect(() => {
    const timer = setTimeout(() => {
      stores.tasksStore.loadTasks();
    },
    1000);

    return () => clearTimeout(timer);
  }, []);

  const makeInfo = (): void => {
    const { completedTaskCount, taskCount }:IStatistic = stores.tasksStore.statistic;
    const text = `${completedTaskCount} out of ${taskCount} tasks left`;
    const mode = MessageMode.info;

    setMessage({ text, mode });
  };

  const handleToggle = (e: ChangeEvent<HTMLInputElement>): void => {
    const id: number = parseInt(e.target.id, 10);
    const { checked } = e.target;
    stores.tasksStore.setIsDone(id, checked);
    makeInfo();
  };

  const handleDeleteById = (e: MouseEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const id: number = parseInt((e.target as HTMLInputElement).id, 10);

    stores.tasksStore.deleteById(id);
    setPendingTask('');
    makeInfo();
  };

  const handleGetFocus = (e: ChangeEvent<HTMLInputElement>): boolean => validate(e.target.value);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { value: newTask } = e.target;
    setPendingTask(newTask);

    validate(newTask);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    const { value: newTaskText } = e.target as HTMLInputElement;

    if ((e.code === 'Enter') && validate(newTaskText)) {
      const id = Math.max(...stores.tasksStore.tasks.map((task) => task.id)) + 1;
      const isDone = false;
      const newTask = { id, text: newTaskText, isDone };
      const newMessage = { text: 'Task successfully added', mode: MessageMode.info };

      stores.tasksStore.addTasks([newTask]);
      setMessage(newMessage);
      setPendingTask('');
      makeInfo();
    }
  };

  const validate = (taskText: string): boolean => {
    const loweredTasks = stores.tasksStore.tasks.map(({ text }) => text.toLowerCase());
    const addingInfo = 'To add task press ENTER at the end';

    try {
      yup.string()
        .required('Task is required')
        .min(5, 'Task must be minimum 5 letters')
        .notOneOf(loweredTasks, 'Task already exist')
        .validateSync(taskText.toLowerCase());
      setMessage({ text: addingInfo, mode: MessageMode.info });

      return true;
    } catch (err) {
      setMessage({ text: (err as ValidationError).message, mode: MessageMode.error });

      return false;
    }
  };

  const MobxTasks = observer(() => (
      <TaskList
        isLoading={stores.tasksStore.isLoading}
        tasks={stores.tasksStore.getFilteredTasks}
        handleDeleteById={handleDeleteById}
        handleToggle={handleToggle}
      />
  ));
  return (
    <StoreContext.Provider value={stores}>

      <NewTask
        handleKeyPress={handleKeyPress}
        handleGetFocus={handleGetFocus}
        handleLostFocus={makeInfo}
        handleChange={handleChange}
        pendingTask={pendingTask}
      />

      <Message
        message={message}
      />

      <Filter />

      <MobxTasks />
    </StoreContext.Provider>
  );
};
