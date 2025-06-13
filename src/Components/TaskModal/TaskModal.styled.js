// src/Components/TaskModal/TaskModal.styled.js
import styled        from "styled-components";
import Modal         from "react-bootstrap/Modal";
import { ModalFooter } from "react-bootstrap";
import Button        from "react-bootstrap/Button";
import DatePicker    from "react-date-picker";
import Dropdown      from "react-bootstrap/Dropdown";

/* ───────── DatePicker ───────── */
export const DateStyled = styled(DatePicker)`
    width: 100%;
    height: 40px;
    border: 1px solid #86b7fe;

    &:focus  { border: none !important; }
    &:hover  { border: 2px solid ${({ theme }) => theme.canvas} !important; }
`;

/* ───────── Модалка ───────── */
export const ModalContainer = styled(Modal).attrs({ centered: true })`
    z-index: 1900;

    .modal-dialog {
        /* было 56px, стало 44px → модалка расположена чуть выше */
        margin: 1px auto 0 auto;
        max-width: 620px;
    }

    .modal-header {
        border-top-right-radius: 4px;
        border-top-left-radius: 4px;
        padding: 16px;

        .modal-title { font-size: 20px; font-weight: 600; }
        .btn-close:focus { box-shadow: none !important; }
    }

    .modal-body .form-control {
        :focus  { box-shadow: none; }
        &:hover { border: 2px solid ${({ theme }) => theme.canvas} !important; }
    }
`;

/* ───────── helpers / footer / др. ───────── */
/* --- остальной код без изменений --- */

export const FormCheck  = styled.div`
    display: block;
    margin-bottom: 16px;

    p {
        font-size: 15px;
        line-height: 18px;
        padding-top: 8px;
    }
`;

export const FormLabel = styled.div`
    display: flex;
    margin-bottom: 16px;

    .form-check-input {
        width: 1em;
        height: 1em;

        &:checked { background-color: #0079d3; }
        &:focus   { box-shadow: none; }
    }
`;

export const Label = styled.p`
    font-size: 15px;
    line-height: 18px;
    padding-top: 8px;
`;

export const Footer = styled(ModalFooter)`
    display: flex;
`;

export const AddTaskBtn = styled(Button)`
    margin: auto;
    width: 80%;
    height: 40px;
    font-size: 14px;
    font-weight: 700;
    background: ${({ theme }) => theme.canvas}!important;
    border: none;

    &:hover { background: ${({ theme }) => theme.background.hover}!important; }
`;

export const ProgressCheck = styled.label`
    display: flex;
    align-items: center;

    .form-check-input {
        width: 1.3em;
        height: 1.3em;

        &:focus   { box-shadow: none; }
        &:checked { background: ${({ theme }) => theme.canvas}; border: none; }
    }
`;

export const TaskStatus = styled.span`
    margin-left: 8px;
    font-size: 15px;
    font-weight: 500;
    color: ${({ theme }) => theme.color.primary}!important;
`;

export const CheckBoxInput = styled.input`
    width: 1.5em;
    height: 1.1em;

    &:focus   { box-shadow: none; }
    &:checked { background: ${({ theme }) => theme.canvas}; border: none; }
`;

export const DropdownContainer = styled(Dropdown)`
    margin: 20px 0;

    .dropdown-toggle {
        width: 100%!important;
        background: #fff!important;
        color: ${({ theme }) => theme.color.primary}!important;
        text-align: start;
    }
`;

export const AlertTitle = styled.p`
    color: red;
    font-weight: 300;
    padding: 3px 0 0;
`;
