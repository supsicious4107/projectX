// Imports
import React, { useState, useEffect, useContext } from "react";
import Card from "react-bootstrap/Card";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { RiDeleteBinLine }          from "react-icons/ri";
import { BiDotsVerticalRounded }    from "react-icons/bi";
import { BsFillCalendarDateFill }   from "react-icons/bs";

import {
  CardContainer,
  StatusBtn,
  Footer,
  Settings,
  IconContainer,
  DateContainer,
} from "./CardTask.styled";

import DeleteTaskModal from "Components/DeleteTaskModal/DeleteTaskModal";
import TaskModal       from "Components/TaskModal/TaskModal";
import formatDate      from "Utils/formatDate";

import { AuthContext }           from "Contexts/AuthContext";
import { loadTasks, saveTasks }  from "Utils/tasksStorage";

/**
 * Карточка одной задачи
 */
const CardTask = ({ taskData, setTasks, tasks, viewTask }) => {
  const { user } = useContext(AuthContext);

  const [state, setState]       = useState(taskData.completed);  // completed / uncompleted
  const [starTask, setStar]     = useState(taskData.important);  // bool
  const [deleteTask, setDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  /* переключить статус */
  const handleToggleState = () => {
    const newTasks = loadTasks(user).map((t) =>
        t.title === taskData.title
            ? { ...t, completed: t.completed === "completed" ? "uncompleted" : "completed" }
            : t
    );

    saveTasks(user, newTasks);
    setTasks(newTasks);
    setState((s) => (s === "completed" ? "uncompleted" : "completed"));
  };

  /* избранное */
  const handleFavoriteTasks = () => {
    const newTasks = loadTasks(user).map((t) =>
        t.title === taskData.title ? { ...t, important: !t.important } : t
    );

    saveTasks(user, newTasks);
    setTasks(newTasks);
    setStar(!starTask);
  };

  useEffect(() => {
    setState(taskData.completed);
    setStar(taskData.important);
  }, [taskData]);

  return (
      <CardContainer viewTask={viewTask}>
        <Card.Body>
          <Card.Title>{taskData.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-dark">
            {taskData.description}
          </Card.Subtitle>
          <Card.Text>
            <DateContainer>
            <span>
              <BsFillCalendarDateFill />
            </span>
              <span>{formatDate(taskData.date)}</span>
            </DateContainer>
          </Card.Text>
        </Card.Body>

        <hr />
        <Footer viewTask={viewTask}>
          <StatusBtn
              viewTask={viewTask}
              colorState={state}
              onClick={handleToggleState}
          >
            {state === "completed" ? "Завершена" : "Не завершена"}
          </StatusBtn>

          <Settings viewTask={viewTask}>
            <IconContainer>
              {starTask ? (
                  <AiFillStar onClick={handleFavoriteTasks} size={25} />
              ) : (
                  <AiOutlineStar onClick={handleFavoriteTasks} size={25} />
              )}
            </IconContainer>

            <IconContainer>
              <RiDeleteBinLine onClick={() => setDelete(true)} size={25} />
            </IconContainer>

            <IconContainer>
              <BiDotsVerticalRounded onClick={() => setShowEdit(true)} size={25} />
            </IconContainer>
          </Settings>
        </Footer>

        {/* модалки */}
        <DeleteTaskModal
            deleteTask={deleteTask}
            setDeleteTask={setDelete}
            singleTask
            titleTask={taskData.title}
            setTasks={setTasks}
        />
        <TaskModal
            showAddNewTask={showEdit}
            setShowAddNewTask={setShowEdit}
            taskMode="Edit"
            titleTask={taskData.title}
            tasks={tasks}
            setTasks={setTasks}
        />
      </CardContainer>
  );
};

export default CardTask;
