// Get references to the HTML elements
const addTodoButton = document.getElementById('add-todo'); // Add Todo button
const newTodoInput = document.getElementById('new-todo'); // New Todo input field
const newPrioritySelect = document.getElementById('new-priority'); // New Todo priority select field
const todoList = document.getElementById('todo-list'); // Todo list container
const headerGif = document.getElementById('header-gif'); // Header GIF image
const headerSelect = document.getElementById('header-select'); // Header select field

// Load header choice and todo list from chrome.storage
chrome.storage.local.get(['headerChoice', 'todos'], function(result) {
  // Set the header choice and update the header GIF and background color
  if (result.headerChoice) {
    headerSelect.value = result.headerChoice;
    headerGif.src = `icons/${result.headerChoice}`;
    updateBackgroundColor(result.headerChoice);
  }
  // Add todos to the DOM and sort the todo list
  if (result.todos) {
    result.todos.forEach(todo => addTodoToDOM(todo.text, todo.done, todo.priority));
    sortTodoList();
  }
});

// Event listener for header select field change
headerSelect.addEventListener('change', function() {
  // Update the header GIF and background color
  headerGif.src = `icons/${headerSelect.value}`;
  updateBackgroundColor(headerSelect.value);
  saveHeaderChoice();
});

// Event listener for add todo button click
addTodoButton.addEventListener('click', function() {
  addNewTodo();
});

// Event listener for new todo input field keydown (Enter key)
newTodoInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    addNewTodo();
  }
});

// Event listener for todo list click
todoList.addEventListener('click', function(e) {
  if (e.target.classList.contains('delete-todo')) {
    // Delete todo item
    e.target.parentElement.remove();
    saveTodoList();
  } else if (e.target.classList.contains('todo-text')) {
    // Toggle todo item done status
    e.target.classList.toggle('done');
    saveTodoList();
  }
});

function addNewTodo() {
  const todoText = newTodoInput.value.trim();
  const todoPriority = newPrioritySelect.value;

  if (todoText) {
      // Add todo to the DOM, save the todo list, and clear the input field
      addTodoToDOM(todoText, false, todoPriority);
      saveTodoList();
      newTodoInput.value = '';
      newPrioritySelect.selectedIndex = 0; // Reset the dropdown to the default option
  } else {
      alert('Please enter a task.');
  }
}

// Function to add a todo item to the DOM
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

// Function to save the todo list to chrome.storage
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

// Function to save the header choice to chrome.storage
function saveHeaderChoice() {
  chrome.storage.local.set({ headerChoice: headerSelect.value });
}

// Function to sort the todo list based on priority
function sortTodoList() {
  const items = Array.from(todoList.children);
  items.sort((a, b) => a.getAttribute('data-priority') - b.getAttribute('data-priority'));
  items.forEach(item => todoList.appendChild(item));
}

// Function to update the background color based on the header choice
function updateBackgroundColor(headerChoice) {
  const backgroundColors = {
    "header.gif": "#dcd8d0", // Default
    "header1.gif": "#333333", // Batman
    "header3.gif": "#0040FF", // Superman
    "header5.gif": "#FF4500", // Spider-Man
    "header4.gif": "#FFD700", // Shazam
    "header2.gif": "#00008B"  // UnderwearMan
  };

  const color = backgroundColors[headerChoice] || "#C9CDD0";
  document.body.style.backgroundColor = color;
}