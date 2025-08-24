// Elements
const taskForm = document.querySelector(".task-form");
const taskInput = document.querySelector("#taskInput");
const categorySelect = document.querySelector("#categorySelect");
const prioritySelect = document.querySelector("#prioritySelect");
const dateInput = document.querySelector("#dateInput");
const taskList = document.querySelector(".task-list");
const taskCounter = document.querySelector("#taskCounter");
const clearCompletedBtn = document.querySelector("#clearCompleted");

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update task counter (including incomplete subtasks)
function updateCounter() {
  let count = 0;
  tasks.forEach(task => {
    if (!task.completed) count++;
    task.subtasks.forEach(sub => { if(!sub.completed) count++; });
  });
  taskCounter.textContent = `Tasks left: ${count}`;
}

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    // Task header
    const header = document.createElement("div");
    header.classList.add("task-header");

    const title = document.createElement("span");
    title.classList.add("task-title");
    title.textContent = task.text;

    const completeBtn = document.createElement("button");
    completeBtn.classList.add("complete-btn");
    completeBtn.textContent = task.completed ? "Undo" : "Complete";
    completeBtn.onclick = () => toggleTask(index);

    header.appendChild(title);
    header.appendChild(completeBtn);

    // Task meta
    const meta = document.createElement("div");
    meta.classList.add("task-meta");

    const catBadge = document.createElement("span");
    catBadge.classList.add("badge", task.category.toLowerCase());
    catBadge.textContent = task.category;

    const priBadge = document.createElement("span");
    priBadge.classList.add("badge", task.priority.toLowerCase());
    priBadge.textContent = task.priority;

    meta.appendChild(catBadge);
    meta.appendChild(priBadge);
    if(task.dueDate) {
      const dateSpan = document.createElement("span");
      dateSpan.textContent = `Due: ${task.dueDate}`;
      meta.appendChild(dateSpan);
    }

    // Subtasks
    const subDiv = document.createElement("div");
    subDiv.classList.add("subtasks");

    const subList = document.createElement("ul");
    task.subtasks.forEach((sub, subIndex) => {
      const liSub = document.createElement("li");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = sub.completed;
      checkbox.onchange = () => toggleSubtask(index, subIndex);

      const subText = document.createElement("span");
      subText.textContent = sub.text;
      if(sub.completed) subText.classList.add("completed-sub");

      liSub.appendChild(checkbox);
      liSub.appendChild(subText);
      subList.appendChild(liSub);
    });

    // Input to add new subtask
    const subInput = document.createElement("input");
    subInput.type = "text";
    subInput.placeholder = "Add subtask...";
    subInput.onkeypress = e => {
      if(e.key === "Enter" && subInput.value.trim() !== "") {
        task.subtasks.push({text: subInput.value.trim(), completed: false});
        subInput.value = "";
        saveTasks();
        renderTasks();
      }
    }

    subDiv.appendChild(subList);
    subDiv.appendChild(subInput);

    // Append to li
    li.appendChild(header);
    li.appendChild(meta);
    li.appendChild(subDiv);

    taskList.appendChild(li);
  });

  updateCounter();
  saveTasks();
}

// Add new task
taskForm.addEventListener("submit", e => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if(text === "") return;

  const newTask = {
    text,
    category: categorySelect.value,
    priority: prioritySelect.value,
    dueDate: dateInput.value,
    completed: false,
    subtasks: []
  };

  tasks.push(newTask);
  taskInput.value = "";
  dateInput.value = "";
  categorySelect.selectedIndex = 0;
  prioritySelect.selectedIndex = 0;

  renderTasks();
});

// Toggle task complete
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

// Toggle subtask complete
function toggleSubtask(taskIndex, subIndex) {
  tasks[taskIndex].subtasks[subIndex].completed = !tasks[taskIndex].subtasks[subIndex].completed;
  renderTasks();
}

// Clear completed tasks
clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter(t => !t.completed);
  tasks.forEach(t => t.subtasks = t.subtasks.filter(s => !s.completed));
  renderTasks();
});

// Initial render
renderTasks();
