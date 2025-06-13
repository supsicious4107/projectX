// Imports
import React, { useState, useEffect, useContext } from "react";
import Form      from "react-bootstrap/Form";
import Modal     from "react-bootstrap/Modal";
import Dropdown  from "react-bootstrap/Dropdown";

import {
  ModalContainer,
  Label,
  Footer,
  AddTaskBtn,
  ProgressCheck,
  TaskStatus,
  DateStyled,
  DropdownContainer,
  AlertTitle,
} from "./TaskModal.styled";

import { AuthContext }           from "Contexts/AuthContext";
import { loadTasks, saveTasks }  from "Utils/tasksStorage";

// стартовые демо-задачи
const demoTasks = [
  {
    title: "Задача 1",
    description: "Разобраться с налоговой декларацией",
    date: "2025-03-01",
    important: true,
    completed: "uncompleted",
  },
  {
    title: "Задача 2",
    description: "Выучить всю документацию по React",
    date: "2025-03-03",
    important: false,
    completed: "uncompleted",
  },
  {
    title: "Задача 3",
    description: "Написать TODO-приложение",
    date: "2025-04-24",
    important: true,
    completed: "completed",
  },
];

const TaskModal = ({
                     showAddNewTask,
                     setShowAddNewTask,
                     taskMode,
                     titleTask,
                     setTasks,
                     tasks,
                   }) => {
  const { user } = useContext(AuthContext);

  const getTaskInfo = (title) => {
    const storedTasks = loadTasks(user);
    return storedTasks.find((t) => t.title === title) || null;
  };

  const [title, setTitle] =
      useState(taskMode === "Edit" ? getTaskInfo(titleTask)?.title : "");
  const [date, setDate] =
      useState(taskMode === "Edit" ? getTaskInfo(titleTask)?.date : new Date());
  const [description, setDescription] =
      useState(taskMode === "Edit" ? getTaskInfo(titleTask)?.description : "");
  const [important, setImportant] =
      useState(taskMode === "Edit" ? getTaskInfo(titleTask)?.important : false);
  const [completed, setCompleted] =
      useState(taskMode === "Edit" ? getTaskInfo(titleTask)?.completed : false);
  const [titleIsUsed, setTitleIsUsed] =
      useState(false);

  const handleTitle       = (e) => setTitle(e.target.value);
  const handleDescription = (e) => setDescription(e.target.value);
  const handleDate        = (value) => setDate(value);

  const handleSubmitTask = (e) => {
    e.preventDefault();
    const storedTasks = loadTasks(user);
    const found       = storedTasks.find((t) => t.title === title);

    if (found || !title) return setTitleIsUsed(true);

    const newItem = {
      title,
      description,
      date,
      important,
      completed: completed ? "completed" : "uncompleted",
    };

    const newTasks = [...tasks, newItem];
    setTasks(newTasks);
    saveTasks(user, newTasks);

    clearAllData();
    setShowAddNewTask(false);
  };

  const handleEditTask = (e) => {
    e.preventDefault();

    const editedTask = {
      title,
      description,
      date,
      important,
      completed,
    };

    const updated = loadTasks(user).map((t) =>
        t.title === titleTask ? editedTask : t
    );

    setTasks(updated);
    saveTasks(user, updated);
    setShowAddNewTask(false);
  };

  const clearAllData = () => {
    setTitle("");
    setDescription("");
    setImportant(false);
    setCompleted(false);
    setTitleIsUsed(false);
  };

  useEffect(() => {
    const stored = loadTasks(user);
    if (stored.length === 0) {
      saveTasks(user, demoTasks);
      setTasks(demoTasks);
    } else {
      setTasks(stored);
    }
  }, [user, setTasks]);

  return (
      <ModalContainer show={showAddNewTask} onHide={() => setShowAddNewTask(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {taskMode === "Add" ? "Добавить задачу" : "Редактировать задачу"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Название</Form.Label>
              <Form.Control
                  placeholder="Например: подготовиться к тесту"
                  autoFocus
                  value={title}
                  onChange={handleTitle}
                  maxLength={100}
                  required
              />
              {titleIsUsed && <AlertTitle>Название задачи уже используется</AlertTitle>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Label>Дата</Label>
              <DateStyled onChange={handleDate} value={date} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Label>Описание (необязательно)</Label>
              <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Описание"
                  onChange={handleDescription}
                  maxLength={500}
                  value={description}
              />
            </Form.Group>
          </Form>

          <div>
            <ProgressCheck>
              <input
                  className="form-check-input w-5vm"
                  type="checkbox"
                  id="state-one"
                  checked={important}
                  onChange={(e) => setImportant(e.target.checked)}
              />
              <TaskStatus>Пометить как важное</TaskStatus>
            </ProgressCheck>

            <ProgressCheck>
              <input
                  className="form-check-input w-5vm"
                  type="checkbox"
                  id="state-two"
                  checked={completed}
                  onChange={(e) => setCompleted(e.target.checked)}
              />
              <TaskStatus>Пометить как выполненное</TaskStatus>
            </ProgressCheck>
          </div>
        </Modal.Body>

        <Footer>
          {taskMode === "Add" ? (
              <AddTaskBtn onClick={handleSubmitTask}>Добавить задачу</AddTaskBtn>
          ) : (
              <AddTaskBtn onClick={handleEditTask}>Сохранить изменения</AddTaskBtn>
          )}
        </Footer>
      </ModalContainer>
  );
};

export default TaskModal;
