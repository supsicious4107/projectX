import React, { useContext, useEffect, useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";        /* ① убрали named-import */
import PomodoroTimer   from "Components/PomodoroTimer/PomodoroTimer";
import DeleteTaskModal from "Components/DeleteTaskModal/DeleteTaskModal";
import { AuthContext } from "Contexts/AuthContext";
import { DesktopBody } from "./RightSideBar.styled";

import {
    AsideSidebar,
    OffcanvasMobile,
    ToolsButton,

    Header as HeaderStyled,
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
    /* ──────── прогресс задач ──────── */
    const [completed, setCompleted] = useState(0);
    useEffect(() => {
        if (!allTasksLength) return setCompleted(0);
        setCompleted(+((numberOfCompletedTasks / allTasksLength) * 100).toFixed(2));
    }, [allTasksLength, numberOfCompletedTasks]);

    /* ──────── удалить всё ─────────── */
    const [confirmDelete, setConfirmDelete] = useState(false);
    const openDeleteModal  = () => setConfirmDelete(true);
    const closeDeleteModal = () => setConfirmDelete(false);

    /* ──────── auth ────────────────── */
    const { user, logout } = useContext(AuthContext);

    /* ──────── off-canvas состояние ── */
    const [show, setShow] = useState(false);

    const open  = () => {
        window.dispatchEvent(new CustomEvent("open-sidebar", { detail: "right" }));
        setShow(true);
    };
    const close = () => setShow(false);

    /*  если открыли левый, закрываемся  */
    useEffect(() => {
        const cb = (e) => { if (e.detail !== "right") setShow(false); };
        window.addEventListener("open-sidebar", cb);
        return () => window.removeEventListener("open-sidebar", cb);
    }, []);

    /* ─────── backdrop только на мобилке ─────── */
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
    useEffect(() => {
        const h = () => setIsMobile(window.innerWidth < 992);
        window.addEventListener("resize", h);
        return () => window.removeEventListener("resize", h);
    }, []);

    const [settingsOpen, setSettingsOpen] = useState(false);

    /* ──────── HEADER (фиксировано) ─────── */
    const HeaderPart = (
        <>
            <HeaderStyled closeButton closeVariant="white">
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
            </HeaderStyled>
            <Divider />
        </>
    );

    /* ──────── прокручиваемое тело ─────── */
    const BodyPart = (
        <>
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

    /* ─────── render ─────── */
    return (
        <>
            {/* кнопка-бургер */}
            <ToolsButton onClick={open} aria-label="виджеты / статистика">
                <svg width="28" height="28" viewBox="0 0 16 16" fill="none">
                    <path d="M2 4h12M2 8h12M2 12h12" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </ToolsButton>

            {/* ───── mobile off-canvas ───── */}
            <OffcanvasMobile
                placement="end"
                show={show}
                onHide={close}
                scroll
                backdrop={isMobile}
            >
                {HeaderPart}

                {/* ② используем внутренний Body компонента Offcanvas */}
                <Offcanvas.Body className="p-0 d-flex flex-column">
                    {BodyPart}
                </Offcanvas.Body>
            </OffcanvasMobile>

            {/* ───── desktop панель ───── */}
            <AsideSidebar>
                {HeaderPart}
                {/* используем стилизованный контейнер с внутренним паддингом */}
                <DesktopBody>
                    {BodyPart}
                </DesktopBody>
            </AsideSidebar>
        </>
    );
};

export default RightSideBar;
