// ===== Selectors =====
const taskInput = document.getElementById("taskInput");
const dueDate = document.getElementById("dueDate");
const priority = document.getElementById("priority");
const categoryInput = document.getElementById("categoryInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const clearCompleted = document.getElementById("clearCompleted");
const searchBar = document.getElementById("searchBar");
const sortOptions = document.getElementById("sortOptions");

// ===== Local Storage =====
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// ===== Event Listeners =====
addTaskBtn.addEventListener("click", addTask);
clearCompleted.addEventListener("click", clearCompletedTasks);
searchBar.addEventListener("input", renderTasks);
sortOptions.addEventListener("change", renderTasks);

// ===== Functions =====
function addTask() {
  const taskText = taskInput.value.trim();
  const taskDate = dueDate.value.trim();
  const taskPriority = priority.value;
  const taskCategory = categoryInput.value.trim();

  if (taskText === "") return;

  const newTask = {
    id: Date.now(),
    text: taskText,
    date: taskDate,
    priority: taskPriority,
    category: taskCategory,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  // Clear form
  taskInput.value = "";
  dueDate.value = "";
  categoryInput.value = "";
}

function renderTasks() {
  taskList.innerHTML = "";

  // Filter by search
  const searchQuery = searchBar.value.toLowerCase();

  // Sort
  let sortedTasks = [...tasks];
  if (sortOptions.value === "date") {
    sortedTasks.sort((a, b) => (a.date > b.date ? 1 : -1));
  } else if (sortOptions.value === "priority") {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    sortedTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  } else if (sortOptions.value === "category") {
    sortedTasks.sort((a, b) => a.category.localeCompare(b.category));
  }

  sortedTasks
    .filter(task => task.text.toLowerCase().includes(searchQuery))
    .forEach(task => {
      const li = document.createElement("li");
      li.classList.add("task-item");

      // Highlight overdue
      if (task.date && new Date(task.date) < new Date() && !task.completed) {
        li.style.border = "2px solid red";
      }

      // Task main content
      const mainDiv = document.createElement("div");
      mainDiv.classList.add("task-main");

      const title = document.createElement("span");
      title.classList.add("task-title");
      title.textContent = task.text;

      if (task.completed) {
        title.style.textDecoration = "line-through";
        title.style.color = "#888";
      }

      // Due date
      const dateSpan = document.createElement("span");
      dateSpan.classList.add("task-date");
      dateSpan.textContent = task.date ? `Due: ${task.date}` : "";

      // Priority badge
      const priorityBadge = document.createElement("span");
      priorityBadge.classList.add("priority-badge", `priority-${task.priority}`);
      priorityBadge.textContent = task.priority;

      // Category badge
      const categoryBadge = document.createElement("span");
      categoryBadge.classList.add("category-badge");
      categoryBadge.textContent = task.category || "General";

      // Buttons
      const completeBtn = document.createElement("button");
      completeBtn.classList.add("complete-btn");
      completeBtn.textContent = "✓";
      completeBtn.addEventListener("click", () => toggleComplete(task.id));

      const deleteBtn = document.createElement("button");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.textContent = "✗";
      deleteBtn.addEventListener("click", () => deleteTask(task.id));

      // Append
      mainDiv.appendChild(title);
      mainDiv.appendChild(dateSpan);
      mainDiv.appendChild(priorityBadge);
      mainDiv.appendChild(categoryBadge);
      mainDiv.appendChild(completeBtn);
      mainDiv.appendChild(deleteBtn);

      li.appendChild(mainDiv);
      taskList.appendChild(li);
    });
}

function toggleComplete(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function clearCompletedTasks() {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Initial render
renderTasks();
