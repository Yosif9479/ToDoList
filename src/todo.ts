import {getCookie} from './cookies.ts';
import {v4 as uuid} from 'uuid';

class Task {
    guid: string;
    name: string;
    completed: boolean = false;

    constructor(name: string) {
        this.guid = uuid();
        this.name = name;
    }
}

const elements = {
    taskInput: document.getElementById("task-input"),
    tasksCreated: document.getElementById("tasks-created"),
    tasksCompleted: document.getElementById("tasks-completed"),
    taskContainer: document.getElementById("task-container"),
    createButton: document.getElementById("create-button")
};

document.addEventListener("DOMContentLoaded", onLoad);

let tasks: Task[] = [];

function onLoad() {
    loadTasks();

    if (!elements.createButton) return;

    elements.createButton.addEventListener("click", createTask);
}

function createTask() {
    const input = elements.taskInput as HTMLInputElement;

    if (!input) return;

    if (input.value.trim().length <= 0) {
        alert("Please enter a value for task!");
        return;
    }

    const task: Task = new Task(input.value.trim());

    tasks.push(task);

    input.value = "";

    saveTasks();

    addTaskToContainer(task.guid);

    fetchCounters();
}

function loadTasks() {
    tasks = JSON.parse(getCookie("tasks") ?? "[]");

    if (!elements.taskContainer) return;

    elements.taskContainer.innerHTML = "";

    for (let task of tasks) {
        addTaskToContainer(task.guid);
    }

    fetchCounters();
}

function removeTask(guid: string) {
    const index: number = tasks.findIndex(task => task.guid == guid);

    tasks.splice(index, 1);
    saveTasks();

    const container = elements.taskContainer as HTMLUListElement;

    if (!container) return;

    container.children[index].remove();

    fetchCounters();
}

function saveTasks() {
    document.cookie = `tasks=${JSON.stringify(tasks)}; path=/`;
}

function addTaskToContainer(guid: string) {
    if (!elements.taskContainer) return;
    const index: number = tasks.findIndex(task => task.guid == guid);

    const li = document.createElement("li");
    li.classList = "task select-none";
    li.innerHTML = `<div class="${tasks[index].completed ? 'completed' : 'incomplete'}" data-check><img class="${tasks[index].completed ? "" : "hidden"}" src="https://img.icons8.com/?size=48&id=7690&format=png&color=ffffff" alt=""></div>\n<p class="${tasks[index].completed ? 'text-completed' : ''}">${tasks[index].name}</p>`;
    li.addEventListener("click", () => toggleTask(guid))


    const removeButton = document.createElement("button");
    removeButton.addEventListener("click", () => removeTask(guid));
    removeButton.classList = "size-5 shrink-0 ml-auto";
    removeButton.innerHTML = `<img src="https://img.icons8.com/?size=96&id=G01ACMKXfdpJ&format=png&color=ffffff" alt="">`

    li.appendChild(removeButton);

    elements.taskContainer.appendChild(li);
}

function fetchCounters() {
    if (!elements.tasksCreated || !elements.tasksCompleted) return;

    elements.tasksCreated.innerText = tasks.length.toString();
    elements.tasksCompleted.innerText = tasks.filter(task => task.completed).length.toString();
}

function toggleTask(guid: string) {
    const index: number = tasks.findIndex(task => task.guid == guid);

    tasks[index].completed = !tasks[index].completed;

    const container = elements.taskContainer as HTMLUListElement;

    if (!container) return;

    const taskElement = container.children[index];
    const taskName = taskElement.children[1] as HTMLLabelElement;
    const checkbox = taskElement.querySelector("[data-check]") as HTMLElement;
    const checkImg = checkbox.children[0] as HTMLImageElement;

    checkbox.classList = tasks[index].completed ? "completed" : "incomplete";
    checkImg.classList.toggle("hidden", !tasks[index].completed);
    taskName.classList.toggle("text-completed", tasks[index].completed);

    saveTasks();
    
    fetchCounters();
}
