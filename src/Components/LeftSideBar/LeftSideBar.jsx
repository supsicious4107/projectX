import React, { useState, useEffect } from "react";
import { useLocation }     from "react-router-dom";
import styled              from "styled-components";

import Stopwatch      from "Components/Stopwatch/Stopwatch";
import CountdownTimer from "Components/CountdownTimer/CountdownTimer";

import {
    AsideSidebar,
    OffcanvasContainer,
    Header,
    NavBtn,
} from "./LeftSideBar.styled";

/* ───── бургер ───── */
const BurgerButton = styled.button`
    position: fixed;
    top: 12px;
    left: 12px;
    width: 40px;
    height: 40px;
    border: none;
    background: transparent;
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;

    svg path { stroke: #9a9a9a; }

    @media (min-width: 992px) { display: none; }
`;

const WidgetTitle = styled.h6`
    margin: 1rem 0 .5rem;
    text-align: center;
    font-weight: 600;
`;

const LeftSideBar = () => {
    /* ╭───────────────── mobile? ─────────────────╮ */
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
    useEffect(() => {
        const h = () => setIsMobile(window.innerWidth < 992);
        window.addEventListener("resize", h);
        return () => window.removeEventListener("resize", h);
    }, []);

    /* ╭───────────────── off-canvas ───────────────╮ */
    const [show, setShow] = useState(false);
    const open  = () => {
        /* ► сообщаем миру, что «левый» открыт            */
        window.dispatchEvent(new CustomEvent("open-sidebar", { detail: "left" }));
        setShow(true);
    };
    const close = () => setShow(false);

    /* ► если открыт правый — закрываемся            */
    useEffect(() => {
        const cb = (e) => { if (e.detail !== "left") setShow(false); };
        window.addEventListener("open-sidebar", cb);
        return () => window.removeEventListener("open-sidebar", cb);
    }, []);

    /* ╭───────────────── активная ссылка ───────────╮ */
    const { pathname } = useLocation();
    const allTasks     = pathname.split("/")[1];

    /* ╭───────────────── меню + виджеты ────────────╮ */
    const Menu = (
        <>
            <NavBtn to="/today-tasks" end onClick={close}>Сегодняшние задачи</NavBtn>

            <NavBtn
                to="/all-tasks"
                end
                className={
                    ["important-tasks","completed-tasks","uncompleted-tasks","today-tasks"].includes(allTasks)
                        ? "" : "active"
                }
                onClick={close}
            >Все задачи</NavBtn>

            <NavBtn to="/important-tasks"  end onClick={close}>Важные задачи</NavBtn>
            <NavBtn to="/completed-tasks"  end onClick={close}>Завершённые задачи</NavBtn>
            <NavBtn to="/uncompleted-tasks" end onClick={close}>Незавершённые задачи</NavBtn>

            <hr className="opacity-25"/>

            <WidgetTitle>Секундомер</WidgetTitle>
            <Stopwatch/>

            <hr className="opacity-25"/>

            <WidgetTitle>Таймер</WidgetTitle>
            <CountdownTimer/>
        </>
    );

    /* ╭───────────────── render ─────────────────────╮ */
    return (
        <>
            <BurgerButton onClick={open} aria-label="меню">
                <svg width="28" height="28" viewBox="0 0 16 16" fill="none">
                    <path d="M1 3h14M1 8h14M1 13h14" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            </BurgerButton>

            <OffcanvasContainer
                placement="start"
                show={show}
                onHide={close}
                backdrop={isMobile}
                scroll
                unmountOnExit={false}
            >
                <Header closeButton closeVariant="white">
                    <h5 className="title">Планировщик</h5>
                </Header>

                <div className="p-2 d-flex flex-column overflow-auto" style={{ flex: 1 }}>
                    {Menu}
                </div>
            </OffcanvasContainer>

            {/* десктоп-версия */}
            <AsideSidebar data-left-sidebar>
                <Header><h5 className="title">Планировщик</h5></Header>
                <div className="p-2 d-flex flex-column overflow-auto" style={{ flex: 1 }}>
                    {Menu}
                </div>
            </AsideSidebar>
        </>
    );
};

export default LeftSideBar;
