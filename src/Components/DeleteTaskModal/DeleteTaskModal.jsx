// Imports
import React from "react";
import Modal   from "react-bootstrap/Modal";
import Button  from "react-bootstrap/Button";

import { ConfirmBtn }   from "./DeleteTaskModal.styled";
import { useContext }   from "react";
import { AuthContext }  from "Contexts/AuthContext";
import { loadTasks, saveTasks } from "Utils/tasksStorage";

/**
 * Модалка-подтверждение удаления задачи / всех задач
 */
const DeleteTaskModal = ({
                           deleteTask,
                           setDeleteTask,
                           singleTask,
                           titleTask,
                           setTasks,
                         }) => {
  const { user } = useContext(AuthContext);

  /** закрыть окно */
  const closeDeleteTaskModal = () => setDeleteTask(false);

  /** удалить */
  const handleTaskDelete = () => {
    let storedTasks = loadTasks(user);

    if (singleTask) {
      storedTasks = storedTasks.filter((t) => t.title !== titleTask);
    } else {
      storedTasks = [];
    }

    saveTasks(user, storedTasks);
    setTasks(storedTasks);
    closeDeleteTaskModal();
  };

  return (
      <Modal
          show={deleteTask}
          onHide={closeDeleteTaskModal}
          backdrop="static"
          keyboard
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {singleTask
                ? `Вы уверены, что хотите удалить ${titleTask}?`
                : "Вы уверены, что хотите удалить все задачи?"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {singleTask
              ? "Эта задача будет удалена без возможности восстановления."
              : "Все данные будут удалены без возможности восстановления."}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="transparent" onClick={closeDeleteTaskModal}>
            Отмена
          </Button>
          <ConfirmBtn onClick={handleTaskDelete}>Подтвердить</ConfirmBtn>
        </Modal.Footer>
      </Modal>
  );
};

export default DeleteTaskModal;
