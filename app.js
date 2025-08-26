// Selectors
const taskInput = document.getElementById("taskInput");
const taskCategory = document.getElementById("taskCategory");
const taskDueDate = document.getElementById("taskDueDate");
const taskPriority = document.getElementById("taskPriority");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const searchInput = document.getElementById("searchInput");
const darkModeToggle = document.getElementById("darkModeToggle");

// Load tasks & dark mode
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let darkMode = localStorage.getItem("darkMode") === "enabled";

if (darkMode) document.body.classList.add("dark-mode");
renderTasks();

// Add task
addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  const category = taskCategory.value.trim();
  const dueDate = taskDueDate.value.trim();
  const priority = taskPriority.value;

  if (text === "") return;

  const task = {
    id: Date.now(),
    text,
    category,
    dueDate,
    priority,
    completed: false,
    subtasks: []
  };

  tasks.push(task);
  saveTasks();
  renderTasks();

  taskInput.value = "";
  taskCategory.value = "";
  taskDueDate.value = "";
  taskPriority.value = "medium";
});

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";

  const searchTerm = searchInput.value.toLowerCase();
  let activeCount = 0;

  tasks.forEach(task => {
    if (!task.text.toLowerCase().includes(searchTerm)) return;

    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""}`;

    const mainDiv = document.createElement("div");
    mainDiv.className = "task-main";

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    // Task text
    const span = document.createElement("span");
    span.textContent = task.text;

    // Badges
    if (task.category) {
      const catBadge = document.createElement("span");
      catBadge.className = "badge category";
      catBadge.textContent = task.category;
      span.appendChild(catBadge);
    }
    if (task.priority) {
      const priBadge = document.createElement("span");
      priBadge.className = `badge ${task.priority}`;
      priBadge.textContent = task.priority;
      span.appendChild(priBadge);
    }

    if (task.dueDate) {
      const dueSpan = document.createElement("small");
      dueSpan.textContent = `Due: ${task.dueDate}`;
      span.appendChild(dueSpan);

      // Highlight if due today
      const today = new Date().toISOString().split("T")[0];
      if (task.dueDate === today && !task.completed) {
        li.style.border = "2px solid red";
      }
    }

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    mainDiv.appendChild(checkbox);
    mainDiv.appendChild(span);
    mainDiv.appendChild(delBtn);

    li.appendChild(mainDiv);

    taskList.appendChild(li);

    if (!task.completed) activeCount++;
  });

  taskCounter.textContent = `${activeCount} tasks left`;
}

// Clear completed
clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
});

// Search
searchInput.addEventListener("input", renderTasks);

// Dark mode toggle
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  darkMode = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", darkMode ? "enabled" : "disabled");
});

// Save tasks
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
