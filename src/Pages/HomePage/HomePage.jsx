import React, { useEffect, useState, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Form } from "react-bootstrap";
import { AuthContext } from "Contexts/AuthContext";
import { loadTasks, saveTasks } from "Utils/tasksStorage";

import {
  Container,
  CenterContainer,
  Section,
  CurrentItem,
  HomeContainer,
} from "./HomePage.styled";

import LeftSideBar from "Components/LeftSideBar/LeftSideBar";
import RightSideBar from "Components/RightSideBar/RightSideBar";
import Header from "Layouts/Header/Header";
import ShowTasks from "Layouts/ShowTasks/ShowTasks";
import formatDate from "Utils/formatDate";
import MotivationalQuote from "Components/MotivationalQuote/MotivationalQuote";


/**
 * Главная страница, отображающая основное содержимое приложения
 *
 * @returns {React.Page}
 */
const HomePage = ({ handleToggleTheme, checkedSwitch }) => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState(() => loadTasks(user));
  const storedTasks = tasks;
  const [viewTask, setViewTask] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState("dueDate");
  const location = useLocation();
  const url = location.pathname;
  const navStateTasks = url.split("/")[1];

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleViewList = () => {
    setViewTask(false);
  };
  const handleViewGrid = () => {
    setViewTask(true);
  };

  const handleSortChange = (event) => {
    console.log(event.target.value);
    setSortCriteria(event.target.value);
  };

  const sortTasks = (tasks) => {
    switch (sortCriteria) {
      case "dueDate":
        return tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
      case "priority":
        return tasks.sort((a, b) => b.important - a.important);
      default:
        return tasks;
    }
  };
  const getFilteredTasks = () => {
    let filteredTasks = storedTasks;

    switch (navStateTasks) {
      case "today-tasks":
        filteredTasks = storedTasks.filter(
            (task) => formatDate(task.date) === formatDate(new Date())
        );
        break;
      case "important-tasks":
        filteredTasks = storedTasks.filter((task) => task.important);
        break;
      case "completed-tasks":
        filteredTasks = storedTasks.filter(
            (task) => task.completed === "completed"
        );
        break;
      case "uncompleted-tasks":
        filteredTasks = storedTasks.filter(
            (task) => task.completed === "uncompleted"
        );
        break;
      default:
        break;
    }
    return sortTasks(filteredTasks);
  };

  const checkUrl = (url) => {
    if (
        !(
            url === "today-tasks" ||
            url === "important-tasks" ||
            url === "completed-tasks" ||
            url === "uncompleted-tasks" ||
            url === "all-tasks"
        )
    ) {
      return "all-tasks";
    }
    return navStateTasks;
  };

  const currentTasksInPageView = getFilteredTasks();

  const filteredTasks = currentTasksInPageView.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const completedTasks = tasks.filter((task) => task.completed === "completed");
  const numberOfCompletedTasks = completedTasks.length;

  useEffect(() => {
      saveTasks(user, tasks);
    }, [user, tasks]);

  const taskWord = (n) => {
    const n10 = n % 10;
    const n100 = n % 100;
    if (n10 === 1 && n100 !== 11)       return "задача";  // 1, 21, 31 …
    if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14))
      return "задачи"; // 2-4, 22-24 …
    return "задач";
  };

  const count = currentTasksInPageView.length;

  return (
      <HomeContainer>
        <Container>
          <Section>
            <LeftSideBar setTasks={setTasks} tasks={tasks} />
          </Section>
          <CenterContainer>
            <Header
                setTasks={setTasks}
                tasks={tasks}
                handleInputChange={handleInputChange}
                searchTerm={searchTerm}
                storedTasks={storedTasks}
            />
            <CurrentItem>
              {checkUrl(navStateTasks) === "today-tasks"
                  ? "Сегодняшние задачи"
                  : checkUrl(navStateTasks) === "important-tasks"
                      ? "Важные задачи"
                      : checkUrl(navStateTasks) === "completed-tasks"
                          ? "Завершённые задачи"
                          : checkUrl(navStateTasks) === "uncompleted-tasks"
                              ? "Незавершённые задачи"
                              : "Все задачи"}{" "}
              ({count} {taskWord(count)})
            </CurrentItem>
            <div className="mb-5"> {}
              <Form.Label htmlFor="sort">Сортировать по:</Form.Label>
              <Form.Select
                  id="sort"
                  value={sortCriteria}
                  onChange={handleSortChange}
              >
                <option value="dueDate">Дате выполнения</option>
                <option value="priority">Приоритету</option>
              </Form.Select>
            </div>

            <Routes>
              <Route
                  path="all-tasks"
                  element={
                    <ShowTasks
                        filteredTasks={filteredTasks}
                        viewTask={viewTask}
                        setTasks={setTasks}
                    />
                  }
              />
              <Route
                  path="today-tasks"
                  element={
                    <ShowTasks
                        filteredTasks={filteredTasks}
                        viewTask={viewTask}
                        setTasks={setTasks}
                    />
                  }
              />
              <Route
                  path="important-tasks"
                  element={
                    <ShowTasks
                        filteredTasks={filteredTasks}
                        viewTask={viewTask}
                        setTasks={setTasks}
                    />
                  }
              />
              <Route
                  path="completed-tasks"
                  element={
                    <ShowTasks
                        filteredTasks={filteredTasks}
                        viewTask={viewTask}
                        setTasks={setTasks}
                    />
                  }
              />
              <Route
                  path="uncompleted-tasks"
                  element={
                    <ShowTasks
                        filteredTasks={filteredTasks}
                        viewTask={viewTask}
                        setTasks={setTasks}
                    />
                  }
              />
              <Route
                  path="/*"
                  element={
                    <ShowTasks
                        filteredTasks={filteredTasks}
                        viewTask={viewTask}
                        setTasks={setTasks}
                    />
                  }
              />
            </Routes>
          </CenterContainer>
          <Section>
            <RightSideBar
                handleToggleTheme={handleToggleTheme}
                setTasks={setTasks}
                checkedSwitch={checkedSwitch}
                numberOfCompletedTasks={numberOfCompletedTasks}
                allTasksLength={storedTasks.length}
            />
          </Section>
        </Container>
           {}
           <MotivationalQuote />
      </HomeContainer>
  );
};

export default HomePage;
