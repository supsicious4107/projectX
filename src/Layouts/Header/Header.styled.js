// src/Layouts/Header/Header.styled.js
import styled from "styled-components";
import Button from "react-bootstrap/Button";

/* ───────── обёртка шапки ───────── */
export const Container = styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;          /* элементы могут переноситься */
    column-gap: 12px;
    row-gap: 8px;
    position: relative;
`;

/* ───────── кнопка «Добавить задачу» ───────── */
export const TaskBtn = styled(Button)`
    background: ${({ theme }) => theme.canvas}!important;
    border: none;
    padding: 0.45rem 1.1rem;

    :hover {
        background: ${({ theme }) => theme.background.hover}!important;
    }
`;

/* ───────── текущая дата (видна ≥768 px) ───────── */
export const DateContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.color.primary};

    @media (min-width: 768px) {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    @media (max-width: 767.98px) {
        display: none;
    }
`;

/* ───────── блок уведомлений + кнопка ───────── */
export const NotificationContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;

    /* на десктопе — прижимаем вправо */
    @media (min-width: 768px) {
        position: absolute;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
    }
`;

/* ───────── иконка колокольчика ───────── */
export const NotificationIcon = styled.span`
    position: relative;
    display: flex;
    cursor: pointer;

    svg {
        width: 32px;
        height: 32px;
        color: ${({ theme }) => theme.canvas};
    }
`;

/* ───────── счётчик над колокольчиком ───────── */
export const NotificationBadge = styled.div`
    position: absolute;
    top: 2px;
    right: 2px;
    background: red;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    padding: 2px;
    border-radius: 50%;
`;

/* ───────── резерв (если понадобится обёртка для кнопок) ───────── */
export const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
`;
