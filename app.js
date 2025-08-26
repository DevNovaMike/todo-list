// Elements
const taskInput = document.getElementById("task-input");
const categoryInput = document.getElementById("category-input");
const dateInput = document.getElementById("date-input");
const priorityInput = document.getElementById("priority-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const clearCompletedBtn = document.getElementById("clear-completed");
const searchInput = document.getElementById("search-input");
const darkModeToggle = document.getElementById("dark-mode-toggle");

// Load tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
renderTasks();

// Add Task
addTaskBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  const category = categoryInput.value.trim();
  const dueDate = dateInput.value.trim();
  const priority = priorityInput.value;

  if (taskText === "") return;

  const task = {
    id: Date.now(),
    text: taskText,
    category,
    dueDate,
    priority,
    completed: false
  };

  tasks.push(task);
  saveTasks();
  renderTasks();

  taskInput.value = "";
  categoryInput.value = "";
  dateInput.value = "";
  priorityInput.value = "Medium";
});

// Render Tasks
function renderTasks() {
  taskList.innerHTML = "";
  const searchTerm = searchInput.value.toLowerCase();

  tasks
    .filter(t => t.text.toLowerCase().includes(searchTerm))
    .forEach(task => {
      const li = document.createElement("li");
      li.className = `task ${task.priority.toLowerCase()}`;
      if (task.completed) li.classList.add("completed");

      li.innerHTML = `
        <span>
          <strong>${task.text}</strong> 
          ${task.category ? ` - [${task.category}]` : ""}
          ${task.dueDate ? ` <em>(${task.dueDate})</em>` : ""}
        </span>
        <div>
          <button onclick="toggleComplete(${task.id})">✔</button>
          <button onclick="deleteTask(${task.id})">✖</button>
        </div>
      `;
      taskList.appendChild(li);
    });

  updateCount();
}

// Toggle complete
function toggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

// Delete task
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

// Update count
function updateCount() {
  const remaining = tasks.filter(t => !t.completed).length;
  taskCount.textContent = `${remaining} task${remaining !== 1 ? "s" : ""} left`;
}

// Clear completed
clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
});

// Search
searchInput.addEventListener("input", renderTasks);

// Save
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Dark mode
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
});

// Load dark mode setting
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
}
