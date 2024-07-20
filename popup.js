const addTodoButton = document.getElementById('add-todo');
const newTodoInput = document.getElementById('new-todo');
const newPrioritySelect = document.getElementById('new-priority');
const todoList = document.getElementById('todo-list');
const headerGif = document.getElementById('header-gif');
const headerSelect = document.getElementById('header-select');

// Load header choice and todo list from chrome.storage
chrome.storage.local.get(['headerChoice', 'todos'], function(result) {
  if (result.headerChoice) {
    headerSelect.value = result.headerChoice;
    headerGif.src = `icons/${result.headerChoice}`;
    updateBackgroundColor(result.headerChoice);
  }
  if (result.todos) {
    result.todos.forEach(todo => addTodoToDOM(todo.text, todo.done, todo.priority));
    sortTodoList();
  }
});

headerSelect.addEventListener('change', function() {
  headerGif.src = `icons/${headerSelect.value}`;
  updateBackgroundColor(headerSelect.value);
  saveHeaderChoice();
});

addTodoButton.addEventListener('click', function() {
  addNewTodo();
});

newTodoInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    addNewTodo();
  }
});

todoList.addEventListener('click', function(e) {
  if (e.target.classList.contains('delete-todo')) {
    e.target.parentElement.remove();
    saveTodoList();
  } else if (e.target.classList.contains('todo-text')) {
    e.target.classList.toggle('done');
    saveTodoList();
  }
});

function addNewTodo() {
  const todoText = newTodoInput.value.trim();
  const todoPriority = newPrioritySelect.value;
  if (todoText) {
    addTodoToDOM(todoText, false, todoPriority);
    saveTodoList();
    newTodoInput.value = '';
  }
}

function addTodoToDOM(text, done, priority) {
  const li = document.createElement('li');
  li.className = 'todo-item';
  li.classList.add(`priority-${priority}`);
  li.setAttribute('data-priority', priority);

  const span = document.createElement('span');
  span.className = 'todo-text';
  if (done) {
    span.classList.add('done');
  }
  span.textContent = text;

  const button = document.createElement('button');
  button.className = 'delete-todo';
  button.textContent = 'X';

  li.appendChild(span);
  li.appendChild(button);
  todoList.appendChild(li);

  sortTodoList();
}

function saveTodoList() {
  const todos = [];
  document.querySelectorAll('.todo-item').forEach(item => {
    const text = item.querySelector('.todo-text').textContent;
    const done = item.querySelector('.todo-text').classList.contains('done');
    const priority = item.getAttribute('data-priority');
    todos.push({ text, done, priority });
  });
  chrome.storage.local.set({ todos: todos });
}

function saveHeaderChoice() {
  chrome.storage.local.set({ headerChoice: headerSelect.value });
}

function sortTodoList() {
  const items = Array.from(todoList.children);
  items.sort((a, b) => a.getAttribute('data-priority') - b.getAttribute('data-priority'));
  items.forEach(item => todoList.appendChild(item));
}

function updateBackgroundColor(headerChoice) {
  const backgroundColors = {
    "header.gif": "#C9CDD0",
    "header1.gif": "#333333", // Batman
    "header3.gif": "#0040FF", // Superman
    "header5.gif": "#FF4500", // Spider-Man
    "header4.gif": "#FFD700", // Shazam
    "header2.gif": "#00008B"  // UnderwearMan
  };

  const color = backgroundColors[headerChoice] || "#C9CDD0";
  document.body.style.backgroundColor = color;
}