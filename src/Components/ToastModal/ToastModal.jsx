import React, { useContext } from "react";
import Toast from "react-bootstrap/Toast";
import AuthContext from "Contexts/Toast-Context";

import { ToastContainer } from "./ToastModal.styled";

/**
 * Функция для правильного склонения слова "незавершённая"
 * @param {number} count - Количество задач
 * @returns {string} - Слово в нужной форме
 */
const getTaskWord = (count) => {
  if (count % 10 === 1 && count % 100 !== 11) return "незавершённая задача";
  if (
      count % 10 >= 2 &&
      count % 10 <= 4 &&
      (count % 100 < 10 || count % 100 >= 20)
  )
    return "незавершённые задачи";
  return "незавершённых задач";
};

/**
 * Компонент всплывающего окна с уведомлением
 * @param {Object} props - Пропсы компонента
 * @param {number} props.TasksCount - Количество незавершённых задач
 * @returns {React.Component} - Визуальный компонент
 */
const ToastModal = ({ TasksCount }) => {
  const ctx = useContext(AuthContext);

  return (
      <div>
        <ToastContainer show={ctx.isShown} onClose={ctx.closeToast}>
          <Toast.Header>
            <strong className="me-auto text-info">Уведомления</strong>
            <small>сегодня</small>
          </Toast.Header>
          <Toast.Body>
            У вас <strong>{TasksCount} {getTaskWord(TasksCount)}</strong> на сегодня
          </Toast.Body>
        </ToastContainer>
      </div>
  );
};

export default ToastModal;
