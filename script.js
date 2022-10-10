// ** DOM Elements Selector
const $ = (selector) => {
  return document.querySelector(selector);
};

// ** DOM Elements
const $todoForm = $("#createTaskForm");
const $todoInput = $("#todoTitle");
const $completedTodosList = $("#completedTodos");
const $uncompletedTodosList = $("#uncompletedTodos");

// ** Utils
function persistTodos(completedTodos, uncompletedTodos) {
  localStorage.setItem("completedTodos", JSON.stringify(completedTodos));
  localStorage.setItem("uncompletedTodos", JSON.stringify(uncompletedTodos));
}

// ** State Handlers
function handleAddTodo(todo) {
  // ** Add Todo Handler
  if (!todo.title) return;
  uncompletedTodos.push(todo);
  renderTodos(completedTodos, uncompletedTodos);

  // ** Clean the input value
  $todoInput.value = "";
}

function handleRemoveTodo(todo, completed) {
  if (completed) {
    completedTodos = completedTodos.filter((td) => td.id !== todo.id);
  }

  if (!completed) {
    uncompletedTodos = uncompletedTodos.filter((td) => td.id !== todo.id);
  }

  renderTodos(completedTodos, uncompletedTodos);
}

function handleCompleteTodo(todo) {
  uncompletedTodos = uncompletedTodos.filter((td) => td.id !== todo.id);

  completedTodos.push(todo);
  renderTodos(completedTodos, uncompletedTodos);
}

// ** HTML Components
const todoElement = (todo, completed) => {
  const stringifiedTodo = JSON.stringify({
    ...todo,
    title: todo.title.replace(/'/g, "&apos;"),
  });

  // ** Todo Item Component
  if (completed) {
    return `
    <li class="list-group-item d-flex align-items-center justify-content-between bg-completed text-white">
      <p class="my-auto">${todo.title}</p>
      <div>
        <i 
          onclick='handleRemoveTodo(${stringifiedTodo}, true)' 
          class="bi bi-x-lg text-danger bootstrap-icon fs-3"
        ></i>
      </div>
    </li>
    `;
  }

  return `
  <li class="list-group-item d-flex align-items-center justify-content-between">
    <p class="my-auto">${todo.title}</p>
    <div>
      <i 
        onclick='handleRemoveTodo(${stringifiedTodo}, false)' 
        class="bi bi-x-lg text-danger bootstrap-icon fs-3"
      ></i>
      <i 
        onclick='handleCompleteTodo(${stringifiedTodo})' 
        class="bi bi-check-lg text-success bootstrap-icon fs-2"
      ></i>
    </div>
  </li>
  `;
};

function getTodosHTMLFromArray(array, completed) {
  // ** Todo List Component
  return array?.length
    ? array.map((todo) => todoElement(todo, completed)).join("") // ** It's using the todoElement component
    : `No tienes tareas ${completed ? "completadas" : "pendientes"}`;
}

// ** Todos States
let uncompletedTodos = localStorage.getItem("uncompletedTodos")
  ? JSON.parse(localStorage.getItem("uncompletedTodos"))
  : [];
let completedTodos = localStorage.getItem("completedTodos")
  ? JSON.parse(localStorage.getItem("completedTodos"))
  : [];

// ** DOM Modifiers
function renderTodos(completedTodos, uncompletedTodos) {
  persistTodos(completedTodos, uncompletedTodos);
  $uncompletedTodosList.innerHTML = getTodosHTMLFromArray(uncompletedTodos);
  $completedTodosList.innerHTML = getTodosHTMLFromArray(completedTodos, true);
}

// ** Event Listeners
$todoForm.addEventListener("submit", (event) => {
  // ** Create Todo Listener
  event.preventDefault();
  handleAddTodo({
    title: $todoInput.value.replace(/'/g, "&apos;"),
    id: new Date().getTime(), // ** It can be generated using other methods, it's only for local enviroment
  });
});

window.addEventListener("DOMContentLoaded", () => {
  // ** DOM Loaded Event
  renderTodos(completedTodos, uncompletedTodos);
});
