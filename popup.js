const addTodoButton = document.getElementById('add-todo');
const newTodoInput = document.getElementById('new-todo');
const todoList = document.getElementById('todo-list');
const headerGif = document.getElementById('header-gif');
const headerSelect = document.getElementById('header-select');

// Load header choice and todo list from chrome.storage
chrome.storage.local.get(['headerChoice', 'todos'], function(result) {
  console.log('Loaded state from storage:', result); // Debug line
  if (result.headerChoice) {
    headerSelect.value = result.headerChoice;
    headerGif.src = `icons/${result.headerChoice}`;
  }
  if (result.todos) {
    result.todos.forEach(todo => addTodoToDOM(todo.text, todo.done));
  }
});

headerSelect.addEventListener('change', function() {
  headerGif.src = `icons/${headerSelect.value}`;
  saveHeaderChoice();
});

addTodoButton.addEventListener('click', function() {
  const todoText = newTodoInput.value.trim();
  if (todoText) {
    addTodoToDOM(todoText, false);
    saveTodoList();
    newTodoInput.value = '';
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

function addTodoToDOM(text, done) {
  const li = document.createElement('li');
  li.className = 'todo-item';

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
}

function saveTodoList() {
  const todos = [];
  document.querySelectorAll('.todo-item').forEach(item => {
    const text = item.querySelector('.todo-text').textContent;
    const done = item.querySelector('.todo-text').classList.contains('done');
    todos.push({ text, done });
  });
  chrome.storage.local.set({ todos: todos });
}

function saveHeaderChoice() {
  chrome.storage.local.set({ headerChoice: headerSelect.value });
}