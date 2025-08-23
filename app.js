// Select elements
const taskForm = document.querySelector(".task-form");
const taskInput = document.querySelector("#taskInput");
const categorySelect = document.querySelector("#categorySelect");
const prioritySelect = document.querySelector("#prioritySelect");
const dateInput = document.querySelector("#dateInput");
const taskList = document.querySelector(".task-list");
const clearCompletedBtn = document.querySelector("#clearCompleted");

// Store tasks
let tasks = [];

// Add Task
taskForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const taskText = taskInput.value.trim();
  const category = categorySelect.value;
  const priority = prioritySelect.value;
  const dueDate = dateInput.value;

  if (taskText === "") return;

  const newTask = {
    id: Date.now(),
    text: taskText,
    category,
    priority,
    dueDate,
    completed: false,
  };

  tasks.push(newTask);
  renderTasks();

  // Clear inputs
  taskInput.value = "";
  dateInput.value = "";
  categorySelect.selectedIndex = 0;
  prioritySelect.selectedIndex = 0;
});

// Render Tasks
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    // Header: task text + complete button
    const headerDiv = document.createElement("div");
    headerDiv.classList.add("task-header");

    const title = document.createElement("span");
    title.classList.add("task-title");
    title.textContent = task.text;

    const completeBtn = document.createElement("button");
    completeBtn.classList.add("complete-btn");
    completeBtn.textContent = task.completed ? "Undo" : "Complete";
    completeBtn.addEventListener("click", () => toggleComplete(task.id));

    headerDiv.appendChild(title);
    headerDiv.appendChild(completeBtn);

    // Meta: category, priority, date
    const metaDiv = document.createElement("div");
    metaDiv.classList.add("task-meta");

    const categoryBadge = document.createElement("span");
    categoryBadge.classList.add("badge", task.category.toLowerCase());
    categoryBadge.textContent = task.category;

    const priorityBadge = document.createElement("span");
    priorityBadge.classList.add("badge", task.priority.toLowerCase());
    priorityBadge.textContent = task.priority;

    metaDiv.appendChild(categoryBadge);
    metaDiv.appendChild(priorityBadge);

    if (task.dueDate) {
      const dateSpan = document.createElement("span");
      dateSpan.textContent = `Due: ${task.dueDate}`;
      metaDiv.appendChild(dateSpan);
    }

    // Append everything
    li.appendChild(headerDiv);
    li.appendChild(metaDiv);

    taskList.appendChild(li);
  });
}

// Toggle Complete
function toggleComplete(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  renderTasks();
}

// Clear Completed
clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.completed);
  renderTasks();
});
