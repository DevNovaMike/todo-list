// Select Elements
const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDate");
const priorityInput = document.getElementById("priority");
const categoryInput = document.getElementById("category");
const tagsInput = document.getElementById("tags");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const taskCounter = document.getElementById("taskCounter");
const searchInput = document.getElementById("searchInput");
const sortTasks = document.getElementById("sortTasks");

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
renderTasks();

// Save to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add Task
addTaskBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  if (!taskText) return;

  const task = {
    id: Date.now(),
    text: taskText,
    dueDate: dueDateInput.value || null,
    priority: priorityInput.value,
    category: categoryInput.value || "General",
    tags: tagsInput.value.split(",").map(t => t.trim()).filter(t => t),
    completed: false,
    subtasks: []
  };

  tasks.push(task);
  saveTasks();
  renderTasks();

  // Clear inputs
  taskInput.value = "";
  dueDateInput.value = "";
  categoryInput.value = "";
  tagsInput.value = "";
});

// Render Tasks
function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks.filter(task =>
    task.text.toLowerCase().includes(searchInput.value.toLowerCase())
  );

  // Sorting
  if (sortTasks.value === "date") {
    filteredTasks.sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || ""));
  } else if (sortTasks.value === "priority") {
    const order = { high: 1, medium: 2, low: 3 };
    filteredTasks.sort((a, b) => order[a.priority] - order[b.priority]);
  } else if (sortTasks.value === "category") {
    filteredTasks.sort((a, b) => a.category.localeCompare(b.category));
  }

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "task";

    // Task header
    const header = document.createElement("div");
    header.className = "task-header";

    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.text;

    // Badges
    const badges = document.createElement("div");
    const priorityBadge = document.createElement("span");
    priorityBadge.className = `badge priority-${task.priority}`;
    priorityBadge.textContent = task.priority;

    const categoryBadge = document.createElement("span");
    categoryBadge.className = "badge category-badge";
    categoryBadge.textContent = task.category;

    badges.appendChild(priorityBadge);
    badges.appendChild(categoryBadge);

    header.appendChild(title);
    header.appendChild(badges);

    // Due Date
    if (task.dueDate) {
      const due = document.createElement("div");
      due.textContent = "Due: " + task.dueDate;
      if (task.dueDate === new Date().toISOString().split("T")[0]) {
        due.style.color = "red";
        due.style.fontWeight = "bold";
      }
      li.appendChild(due);
    }

    // Subtasks
    const subtaskList = document.createElement("ul");
    subtaskList.className = "subtask-list";
    task.subtasks.forEach(st => {
      const subLi = document.createElement("li");
      subLi.className = "subtask";
      subLi.textContent = st;
      subtaskList.appendChild(subLi);
    });

    const subtaskInput = document.createElement("div");
    subtaskInput.className = "subtask-input";
    const subInput = document.createElement("input");
    subInput.placeholder = "Add subtask...";
    const subBtn = document.createElement("button");
    subBtn.textContent = "+";
    subBtn.onclick = () => {
      if (subInput.value.trim()) {
        task.subtasks.push(subInput.value.trim());
        saveTasks();
        renderTasks();
      }
    };
    subtaskInput.appendChild(subInput);
    subtaskInput.appendChild(subBtn);

    // Complete Button
    const completeBtn = document.createElement("button");
    completeBtn.textContent = task.completed ? "Undo" : "Complete";
    completeBtn.onclick = () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    };

    li.appendChild(header);
    li.appendChild(subtaskList);
    li.appendChild(subtaskInput);
    li.appendChild(completeBtn);

    if (task.completed) {
      li.style.textDecoration = "line-through";
      li.style.opacity = "0.6";
    }

    taskList.appendChild(li);
  });

  updateCounter();
}

// Clear Completed
clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
});

// Search + Sort events
searchInput.addEventListener("input", renderTasks);
sortTasks.addEventListener("change", renderTasks);

// Update Counter
function updateCounter() {
  const left = tasks.filter(t => !t.completed).length;
  taskCounter.textContent = `${left} tasks left`;
}
