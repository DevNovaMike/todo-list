// ----------------------------
// To-Do App with Subtasks
// ----------------------------

const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const clearCompletedBtn = document.getElementById("clearCompleted");
const taskCounter = document.getElementById("taskCounter");

let tasks = [];

// Function to update the counter
function updateCounter() {
  const incomplete = tasks.filter(task => !task.completed).length;
  taskCounter.textContent = `Tasks left: ${incomplete}`;
}

// Function to render tasks
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""}`;

    li.innerHTML = `
      <div class="task-header">
        <span class="category-badge ${task.category.toLowerCase()}">${task.category}</span>
        <span class="priority-badge ${task.priority.toLowerCase()}">${task.priority}</span>
      </div>
      <div class="task-main">
        <input type="checkbox" class="complete-btn" ${task.completed ? "checked" : ""} data-index="${index}">
        <span class="task-text">${task.text}</span>
        <span class="due-date">Due: ${task.dueDate}</span>
      </div>
      <div class="subtasks">
        <ul>
          ${task.subtasks.map((sub, subIndex) => `
            <li>
              <input type="checkbox" class="subtask-checkbox" data-task="${index}" data-sub="${subIndex}" ${sub.completed ? "checked" : ""}>
              <span class="${sub.completed ? "completed-sub" : ""}">${sub.text}</span>
            </li>
          `).join("")}
        </ul>
        <input type="text" placeholder="Add subtask..." class="subtask-input" data-index="${index}">
      </div>
    `;

    taskList.appendChild(li);
  });

  updateCounter();
}

// Function to add a task
taskForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const taskInput = document.getElementById("taskInput").value.trim();
  const category = document.getElementById("taskCategory").value;
  const priority = document.getElementById("taskPriority").value;
  const dueDate = document.getElementById("taskDueDate").value || "No due date";

  if (taskInput) {
    tasks.push({
      text: taskInput,
      category,
      priority,
      dueDate,
      completed: false,
      subtasks: []
    });

    taskForm.reset();
    renderTasks();
  }
});

// Handle clicks (complete task, clear completed, add subtasks)
taskList.addEventListener("click", function(e) {
  if (e.target.classList.contains("complete-btn")) {
    const index = e.target.dataset.index;
    tasks[index].completed = e.target.checked;
    renderTasks();
  }
});

taskList.addEventListener("keypress", function(e) {
  if (e.target.classList.contains("subtask-input") && e.key === "Enter") {
    const index = e.target.dataset.index;
    const subtaskText = e.target.value.trim();

    if (subtaskText) {
      tasks[index].subtasks.push({ text: subtaskText, completed: false });
      e.target.value = "";
      renderTasks();
    }
  }
});

taskList.addEventListener("change", function(e) {
  if (e.target.classList.contains("subtask-checkbox")) {
    const taskIndex = e.target.dataset.task;
    const subIndex = e.target.dataset.sub;
    tasks[taskIndex].subtasks[subIndex].completed = e.target.checked;
    renderTasks();
  }
});

// Clear completed tasks
clearCompletedBtn.addEventListener("click", function() {
  tasks = tasks.filter(task => !task.completed);
  renderTasks();
});
