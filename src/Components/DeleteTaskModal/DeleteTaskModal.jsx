// DeleteTaskModal.jsx
import React, { useContext } from "react";
import Modal         from "react-bootstrap/Modal";
import Button        from "react-bootstrap/Button";
import { ConfirmBtn, DialogLower } from "./DeleteTaskModal.styled";
import { AuthContext }  from "Contexts/AuthContext";
import { loadTasks, saveTasks } from "Utils/tasksStorage";

const DeleteTaskModal = ({
                             deleteTask,
                             setDeleteTask,
                             singleTask,
                             titleTask,
                             setTasks,
                         }) => {
    const { user } = useContext(AuthContext);

    const close = () => setDeleteTask(false);

    const remove = () => {
        const filtered = singleTask
            ? loadTasks(user).filter(t => t.title !== titleTask)
            : [];
        saveTasks(user, filtered);
        setTasks(filtered);
        close();
    };

    return (
        <Modal
            show={deleteTask}
            onHide={close}
            backdrop="static"
            keyboard
            /* <<< привяжем наш класс для .modal-dialog */
            dialogClassName="dialog-lower"
            centered={false}   /* важно: иначе bootstrap центрирует по-умолчанию */
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {singleTask
                        ? `Удалить «${titleTask}»?`
                        : "Удалить все задачи?"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {singleTask
                    ? "Эта задача будет удалена без возможности восстановления."
                    : "Все данные будут удалены без возможности восстановления."}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="transparent" onClick={close}>Отмена</Button>
                <ConfirmBtn onClick={remove}>Подтвердить</ConfirmBtn>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteTaskModal;
