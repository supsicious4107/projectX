import React, { useState, useEffect, useContext } from "react";
import Offcanvas           from "react-bootstrap/Offcanvas";
import PomodoroTimer       from "Components/PomodoroTimer/PomodoroTimer";
import DeleteTaskModal     from "Components/DeleteTaskModal/DeleteTaskModal";
import { AuthContext }     from "Contexts/AuthContext";

import {
    AsideSidebar,
    OffcanvasMobile,
    ToolsButton,

    Header,
    ProfileBtn,
    Footer,
    DeleteBtn,
    ProgressContainer,
    ProgressBarContainer,
    UserLabel,
    UserBlock,
    Divider,
} from "./RightSideBar.styled";

const RightSideBar = ({ setTasks, numberOfCompletedTasks, allTasksLength }) => {
    /* ---------- прогресс ---------- */
    const [completed, setCompleted] = useState(0);
    useEffect(() => {
        if (!allTasksLength) return setCompleted(0);
        setCompleted(+((numberOfCompletedTasks / allTasksLength) * 100).toFixed(2));
    }, [allTasksLength, numberOfCompletedTasks]);

    /* ---------- удалить всё ---------- */
    const [confirmDelete, setConfirmDelete] = useState(false);
    const openDeleteModal  = () => setConfirmDelete(true);
    const closeDeleteModal = () => setConfirmDelete(false);

    /* ---------- auth ---------- */
    const { user, logout } = useContext(AuthContext);

    /* ---------- off-canvas (мобилка) ---------- */
    const [showMob, setShowMob] = useState(false);
    const openMob  = () => setShowMob(true);
    const closeMob = () => setShowMob(false);

    /* media-query «мобилка?» — для backdrop */
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
    useEffect(() => {
        const h = () => setIsMobile(window.innerWidth < 992);
        window.addEventListener("resize", h);
        return () => window.removeEventListener("resize", h);
    }, []);

    const [settingsOpen, setSettingsOpen] = useState(false);

    /* ---------- контент панели (используется 2 раза) ---------- */
    const PanelContent = (
        <>
            {/* Header со встроенным красным крестиком (скрыт на десктопе) */}
            <Header closeButton closeVariant="white">
                {!!user && (
                    <UserBlock>
                        <UserLabel>{user.displayName || user.email}</UserLabel>
                        <ProfileBtn onClick={logout}>Выйти</ProfileBtn>
                    </UserBlock>
                )}

                <ProgressContainer>
                    <span>Задач выполнено</span>
                    <ProgressBarContainer now={completed} label={`${completed}%`} />
                </ProgressContainer>
            </Header>

            <Divider />

            <PomodoroTimer onSettingsToggle={setSettingsOpen} />

            <Divider />

            <Footer $pushBottom={settingsOpen}>
                <DeleteBtn onClick={openDeleteModal}>Удалить все задачи</DeleteBtn>
            </Footer>

            <DeleteTaskModal
                deleteTask={confirmDelete}
                setDeleteTask={closeDeleteModal}
                singleTask={false}
                titleTask="-1"
                setTasks={setTasks}
            />
        </>
    );

    return (
        <>
            {/* мобильная кнопка «три линии» */}
            <ToolsButton onClick={openMob} aria-label="виджеты / статистика">
                <svg width="28" height="28" viewBox="0 0 16 16" fill="none">
                    <path d="M2 4h12M2 8h12M2 12h12"
                          strokeWidth="2" strokeLinecap="round" stroke="#ffffff" />
                </svg>
            </ToolsButton>

            {/* Off-canvas справа (мобилка) */}
            <OffcanvasMobile
                placement="end"
                show={showMob}
                onHide={closeMob}
                scroll
                backdrop={isMobile}
                unmountOnExit={false}
            >
                {PanelContent}
            </OffcanvasMobile>

            {/* статичная панель (десктоп) */}
            <AsideSidebar>{PanelContent}</AsideSidebar>
        </>
    );
};

export default RightSideBar;
