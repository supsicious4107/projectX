import React, { useState, useContext, useEffect } from "react";
import ToastContext from "Contexts/Toast-Context";      // 🟣 контекст тостов
import { AuthContext } from "Contexts/AuthContext";     // 🔵 контекст Firebase-auth
import { MdNotifications } from "react-icons/md";
import AuthModal from "Components/auth/AuthModal";

import {
    TaskBtn,
    Container,
    DateContainer,
    NotificationContainer,
    NotificationIcon,
    NotificationBadge,
    ButtonContainer,
} from "./Header.styled";

import SearchBar from "Components/SearchBar/SearchBar";
import TaskModal from "Components/TaskModal/TaskModal";
import ToastModal from "Components/ToastModal/ToastModal";
import formatDate from "Utils/formatDate";

const currentDate = new Date().toLocaleDateString();

const Header = ({
                    setTasks,
                    tasks,
                    handleInputChange,
                    searchTerm,
                    storedTasks,
                }) => {
    const toastCtx           = useContext(ToastContext);
    const { user, logout }   = useContext(AuthContext);

    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode]           = useState("Login");
    const [showAddNewTask, setShowAddNewTask] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);

    const getTodayAndUnCompletedTasks = () =>
        storedTasks.filter(
            (task) =>
                formatDate(task.date) === formatDate(new Date()) &&
                task.completed === "uncompleted"
        );

    useEffect(() => {
        setNotificationCount(getTodayAndUnCompletedTasks().length);
    }, [storedTasks]);

    const handleNewTaskClick = () => setShowAddNewTask(true);

    const handleAuthClick = (mode) => {
        setAuthMode(mode);
        setShowAuthModal(true);
    };

    return (
        <Container>
            <SearchBar
                tasks={tasks}
                handleInputChange={handleInputChange}
                searchTerm={searchTerm}
            />

            <DateContainer>{currentDate}</DateContainer>

            <NotificationContainer>
                <NotificationIcon onClick={toastCtx.setShowToast}>
                    <MdNotifications size={32} />
                    {notificationCount > 0 && (
                        <NotificationBadge>{notificationCount}</NotificationBadge>
                    )}
                </NotificationIcon>
                <TaskBtn onClick={handleNewTaskClick}>Добавить задачу</TaskBtn>
            </NotificationContainer>


            <TaskModal
                showAddNewTask={showAddNewTask}
                setShowAddNewTask={setShowAddNewTask}
                taskMode="Add"
                setTasks={setTasks}
                tasks={tasks}
            />
            <ToastModal TasksCount={notificationCount} />

            <AuthModal
                showAuthModal={showAuthModal}
                setShowAuthModal={setShowAuthModal}
                authMode={authMode}
            />
        </Container>
    );
};

export default Header;
