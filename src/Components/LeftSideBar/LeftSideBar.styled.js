import styled from "styled-components";
import Offcanvas from "react-bootstrap/Offcanvas";
import Button from "react-bootstrap/Button";
import { NavLink } from "react-router-dom";

const SIDEBAR_WIDTH = "270px";

/* ─── десктоп-сайдбар ─── */
export const AsideSidebar = styled.aside.attrs({ 'data-left-sidebar': '' })`
    width: ${SIDEBAR_WIDTH};
    flex: 0 0 ${SIDEBAR_WIDTH};

    min-height: 100vh;
    align-self: stretch;
    position: sticky;
    top: 0;

    display: none;
    background: ${({ theme }) => theme.background.primary};

    /* ❶  убрали прежний border-right */
    /* border-right: 1px solid ... */

    /* ❷  псевдо-элемент рисует тонкую (1 px) границу на всю высоту */
    &::after {
        content: "";
        position: fixed;
        top: 0;
        bottom: 0;
        left: calc(${SIDEBAR_WIDTH} - 1px);   /* внутренний край панели */
        width: 1px;
        background: ${({ theme }) => theme.linecolor.sideBorder};
        pointer-events: none;
        z-index: 50;
    }

    @media (min-width: 992px) {
        display: flex;
        flex-direction: column;
    }
`;

/* ─── Off-canvas (мобилка) ─── */
export const OffcanvasContainer = styled(Offcanvas)`
    background: ${({ theme }) => theme.background.primary};
    color:      ${({ theme }) => theme.color.primary};
    width: ${SIDEBAR_WIDTH}!important;
    top: 0!important;
    height: 100vh;
    padding-top: 56px;

    @media (min-width: 992px) { display: none; }

    .offcanvas-body { overflow-y: auto; }
`;

/* ─── заголовок + красный крестик ─── */
export const Header = styled(Offcanvas.Header)`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.25rem 1rem;

    @media (min-width: 992px) { padding: 24px 1.25rem 1rem; }

    .title {
        margin: 0;
        text-transform: uppercase;
        font-family: cursive;
        color: ${({ theme }) => theme.color.primary};
    }

    .btn-close {
        opacity: 1;
        filter: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath stroke='%23ff3b30' stroke-width='2' stroke-linecap='round' d='M2 2l12 12M14 2L2 14'/%3E%3C/svg%3E");
    }
`;

/* ─── кнопка «Добавить задачу» ─── */
export const TaskBtn = styled(Button)`
    margin: 1rem 0;
    width: 100%;
    border: none;
    background: ${({ theme }) => theme.canvas}!important;

    :hover { background: ${({ theme }) => theme.background.hover}!important; }
`;

/* ─── пункт меню ─── */
export const NavBtn = styled(NavLink)`
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 14px;
    font-size: 15px;
    position: relative;
    text-decoration: none;
    color: ${({ theme }) => theme.color.primary}!important;

    :hover {
        background: ${({ theme }) => theme.background.viewBtnColor}!important;
        color: ${({ theme }) => theme.color.hover}!important;
    }

    &.active,
    &.active:hover {
        background: ${({ theme }) => theme.background.viewBtnColor}!important;
        color: ${({ theme }) => theme.color.hover}!important;
    }

    &.active::before {
        content: "";
        position: absolute;
        left: 0; top: 0; bottom: 0; width: 4px;
        background: #ff3b30;
    }
`;
