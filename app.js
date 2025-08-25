const taskInput = document.getElementById("taskInput");
const taskCategory = document.getElementById("taskCategory");
const taskDueDate = document.getElementById("taskDueDate");
const taskPriority = document.getElementById("taskPriority");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const taskCounter = document.getElementById("taskCounter");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

let tasks = [];

// Add Task
addTaskBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  const task = {
    id: Date.now(),
    text: taskText,
    category: taskCategory.value || "General",
    dueDate: taskDueDate.value || "No date",
    priority: taskPriority.value,
    completed: false,
    subtasks: []
  };

  tasks.push(task);
  renderTasks();
  clearInputs();
});

// Render Tasks
function renderTasks() {
  taskList.innerHTML = "";
  let filteredTasks = filterAndSortTasks();

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.classList.add("task");
    if (task.completed) li.classList.add("completed");

    // Highlight if due today
    const today = new Date().toISOString().split("T")[0];
    if (task.dueDate === today) {
      li.style.border = "2px solid #ff4444";
    }

    li.innerHTML = `
      <span>
        ${task.text} 
        <span class="badge category-badge">${task.category}</span>
        <span class="badge priority-${task.priority}">${task.priority}</span>
        <span class="badge">${task.dueDate}</span>
      </span>
      <div>
        <button onclick="toggleComplete(${task.id})">✔</button>
        <button onclick="deleteTask(${task.id})">❌</button>
      </div>
    `;

    taskList.appendChild(li);

    // Swipe gestures (mobile)
    let touchstartX = 0;
    li.addEventListener("touchstart", e => touchstartX = e.changedTouches[0].screenX);
    li.addEventListener("touchend", e => {
      let touchendX = e.changedTouches[0].screenX;
      if (touchendX < touchstartX - 50) deleteTask(task.id);
      if (touchendX > touchstartX + 50) toggleComplete(task.id);
    });
  });

  updateCounter();
}

// Filter & Sort
function filterAndSortTasks() {
  let result = tasks.filter(t =>
    t.text.toLowerCase().includes(searchInput.value.toLowerCase())
  );

  if (sortSelect.value === "date") {
    result.sort((a, b) => (a.dueDate > b.dueDate ? 1 : -1));
  } else if (sortSelect.value === "priority") {
    const order = { high: 1, medium: 2, low: 3 };
    result.sort((a, b) => order[a.priority] - order[b.priority]);
  } else if (sortSelect.value === "category") {
    result.sort((a, b) => a.category.localeCompare(b.category));
  }

  return result;
}

// Toggle Complete
function toggleComplete(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  renderTasks();
}

// Delete Task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  renderTasks();
}

// Clear Completed
clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed);
  renderTasks();
});

// Update Counter
function updateCounter() {
  const remaining = tasks.filter(t => !t.completed).length;
  taskCounter.textContent = `${remaining} tasks remaining`;
}

// Helpers
function clearInputs() {
  taskInput.value = "";
  taskCategory.value = "";
  taskDueDate.value = "";
  taskPriority.value = "low";
}

// Search & Sort Events
searchInput.addEventListener("input", renderTasks);
sortSelect.addEventListener("change", renderTasks);
