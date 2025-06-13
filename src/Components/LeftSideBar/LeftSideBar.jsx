import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

import Stopwatch      from "Components/Stopwatch/Stopwatch";
import CountdownTimer from "Components/CountdownTimer/CountdownTimer";

import {
    AsideSidebar,
    OffcanvasContainer,
    Header,
    /* TaskBtn - больше не нужен */
    NavBtn,
} from "./LeftSideBar.styled";

/* бургер-кнопка */
const BurgerButton = styled.button`
    position: fixed;
    top: 12px;
    left: 12px;
    width: 40px;
    height: 40px;
    border: none;
    padding: 0;
    background: transparent;
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (min-width: 992px) { display: none; }

    svg path { stroke:#fff; }
`;

const WidgetTitle = styled.h6`
    margin: 1rem 0 0.5rem;
    text-align: center;
    font-weight: 600;
`;

const LeftSideBar = () => {
    /* === мобилка? === */
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
    useEffect(() => {
        const handler = () => setIsMobile(window.innerWidth < 992);
        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
    }, []);

    /* Off-canvas */
    const [showCanvas, setShowCanvas] = useState(false);
    const openCanvas  = () => setShowCanvas(true);
    const closeCanvas = () => setShowCanvas(false);

    /* активный пункт меню */
    const { pathname } = useLocation();
    const allTasks = pathname.split("/")[1];

    /* меню + виджеты */
    const MenuContent = (
        <>
            <NavBtn to="/today-tasks" end onClick={closeCanvas}>
                Сегодняшние задачи
            </NavBtn>

            <NavBtn
                to="/all-tasks"
                end
                className={
                    ["important-tasks","completed-tasks","uncompleted-tasks","today-tasks"].includes(allTasks)
                        ? "" : "active"
                }
                onClick={closeCanvas}
            >
                Все задачи
            </NavBtn>

            <NavBtn to="/important-tasks"  end onClick={closeCanvas}>Важные задачи</NavBtn>
            <NavBtn to="/completed-tasks"  end onClick={closeCanvas}>Завершённые задачи</NavBtn>
            <NavBtn to="/uncompleted-tasks" end onClick={closeCanvas}>Незавершённые задачи</NavBtn>

            <hr className="opacity-25" />

            <WidgetTitle>Секундомер</WidgetTitle>
            <Stopwatch />

            <hr className="opacity-25" />

            <WidgetTitle>Таймер</WidgetTitle>
            <CountdownTimer />
        </>
    );

    return (
        <>
            {/* бургер (мобилка) */}
            <BurgerButton onClick={openCanvas} aria-label="меню">
                <svg width="28" height="28" viewBox="0 0 16 16" fill="none">
                    <path d="M1 3h14M1 8h14M1 13h14" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </BurgerButton>

            {/* Off-canvas (мобилка) */}
            <OffcanvasContainer
                placement="start"
                show={showCanvas}
                onHide={closeCanvas}
                backdrop={isMobile}
                scroll
                unmountOnExit={false}
            >
                <Header closeButton closeVariant="white">
                    <h5 className="title">Планировщик</h5>
                </Header>

                <div className="p-2 d-flex flex-column overflow-auto" style={{ flex: 1 }}>
                    {MenuContent}
                </div>
            </OffcanvasContainer>

            {/* десктоп-сайдбар */}
            <AsideSidebar>
                <Header>
                    <h5 className="title">Планировщик</h5>
                </Header>
                <div className="p-2 d-flex flex-column overflow-auto" style={{ flex: 1 }}>
                    {MenuContent}
                </div>
            </AsideSidebar>
        </>
    );
};

export default LeftSideBar;
