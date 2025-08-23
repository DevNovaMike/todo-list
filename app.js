// Select DOM elements
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDate");
const categoryInput = document.getElementById("category");
const priorityInput = document.getElementById("priority");
const taskList = document.getElementById("taskList");
const clearCompletedBtn = document.getElementById("clearCompleted");
const taskCounter = document.getElementById("taskCounter");

let tasks = [];

// Update task counter
function updateCounter() {
  const remaining = tasks.filter(t => !t.completed).length;
  taskCounter.textContent = `Tasks left: ${remaining}`;
}

// Render all tasks
function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task-item";
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      <div class="task-header">
        <span class="category-badge ${task.category.toLowerCase()}">${task.category}</span>
        <span class="priority-badge ${task.priority.toLowerCase()}">${task.priority}</span>
      </div>
      <div class="task-main">
        <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleComplete(${index})">
        <span class="task-text">${task.text}</span>
        <span class="due-date">${task.dueDate ? "Due: " + task.dueDate : ""}</span>
        <button onclick="removeTask(${index})">❌</button>
      </div>
      <div class="subtasks">
        <ul>
          ${task.subtasks.map((sub, i) => `
            <li>
              <input type="checkbox" ${sub.completed ? "checked" : ""} onchange="toggleSubtask(${index}, ${i})">
              <span class="${sub.completed ? "completed-sub" : ""}">${sub.text}</span>
            </li>
          `).join("")}
        </ul>
        <input type="text" placeholder="Add subtask..." onkeypress="addSubtask(event, ${index})">
      </div>
    `;

    taskList.appendChild(li);
  });
  updateCounter();
}

// Add a new task
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  const dueDate = dueDateInput.value.trim();
  const category = categoryInput.value;
  const priority = priorityInput.value;

  if (text === "") return;

  tasks.push({
    text,
    dueDate,
    category,
    priority,
    completed: false,
    subtasks: []
  });

  taskInput.value = "";
  dueDateInput.value = "";
  renderTasks();
});

// Toggle complete task
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

// Remove task
function removeTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

// Add subtask
function addSubtask(e, taskIndex) {
  if (e.key === "Enter") {
    const text = e.target.value.trim();
    if (text === "") return;
    tasks[taskIndex].subtasks.push({ text, completed: false });
    e.target.value = "";
    renderTasks();
  }
}

// Toggle subtask complete
function toggleSubtask(taskIndex, subIndex) {
  tasks[taskIndex].subtasks[subIndex].completed = !tasks[taskIndex].subtasks[subIndex].completed;
  renderTasks();
}

// Clear completed tasks
clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter(t => !t.completed);
  renderTasks();
});

// Initial render
renderTasks();
