import { auth } from "../firebase";

/** возвращает строку-ключ вида tasks_abc123 или tasks_guest */
export const getTasksKey = (user) =>
    user && user.uid ? `tasks_${user.uid}` : "tasks_guest";

/** загрузить задачи для конкретного юзера */
export const loadTasks = (user) => {
    const raw = localStorage.getItem(getTasksKey(user));
    return raw ? JSON.parse(raw) : [];
};

/** сохранить задачи */
export const saveTasks = (user, tasks) =>
    localStorage.setItem(getTasksKey(user), JSON.stringify(tasks));
