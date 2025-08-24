// Elements
const taskForm = document.querySelector(".task-form");
const taskInput = document.querySelector("#taskInput");
const tagsInput = document.querySelector("#tagsInput");
const categorySelect = document.querySelector("#categorySelect");
const prioritySelect = document.querySelector("#prioritySelect");
const dateInput = document.querySelector("#dateInput");
const taskList = document.querySelector(".task-list");
const taskCounter = document.querySelector("#taskCounter");
const clearCompletedBtn = document.querySelector("#clearCompleted");
const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save tasks
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Count tasks including subtasks
function updateCounter() {
  let count = 0;
  tasks.forEach(task => {
    if(!task.completed) count++;
    task.subtasks.forEach(sub => { if(!sub.completed) count++; });
  });
  taskCounter.textContent = `Tasks left: ${count}`;
}

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";
  let filteredTasks = [...tasks];

  // Filter by search
  const search = searchInput.value.trim().toLowerCase();
  if(search) {
    filteredTasks = filteredTasks.filter(task => 
      task.text.toLowerCase().includes(search) ||
      task.tags.some(tag => tag.toLowerCase().includes(search))
    );
  }

  // Sort
  const sort = sortSelect.value;
  if(sort === "priority") {
    const order = { High: 1, Medium: 2, Low: 3 };
    filteredTasks.sort((a,b) => order[a.priority]-order[b.priority]);
  } else if(sort === "dueDate") {
    filteredTasks.sort((a,b) => new Date(a.dueDate || "2100-01-01") - new Date(b.dueDate || "2100-01-01"));
  } else if(sort === "category") {
    filteredTasks.sort((a,b) => a.category.localeCompare(b.category));
  }

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    if(task.completed) li.classList.add("completed");

    // Due date highlight
    if(task.dueDate) {
      const today = new Date();
      const due = new Date(task.dueDate);
      const diffDays = Math.ceil((due - today)/ (1000*60*60*24));
      if(diffDays < 0) li.classList.add("task-overdue");
      else if(diffDays <= 2) li.classList.add("task-due-soon");
    }

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

    // Tags
    task.tags.forEach(tagText => {
      const tagSpan = document.createElement("span");
      tagSpan.classList.add("badge", "other");
      tagSpan.textContent = tagText;
      meta.appendChild(tagSpan);
    });

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

    li.appendChild(header);
    li.appendChild(meta);
    li.appendChild(subDiv);

    // Swipe gesture (basic)
    let touchStartX = 0;
    li.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX);
    li.addEventListener('touchend', e => {
      let touchEndX = e.changedTouches[0].screenX;
      if(touchStartX - touchEndX > 50) toggleTask(index); // swipe left completes
      if(touchEndX - touchStartX > 50) tasks.splice(index,1); renderTasks(); // swipe right deletes
    });

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

  const tags = tagsInput.value.split(",").map(t => t.trim()).filter(t => t);

  const newTask = {
    text,
    category: categorySelect.value,
    priority: prioritySelect.value,
    dueDate: dateInput.value,
    completed: false,
    subtasks: [],
    tags
  };

  tasks.push(newTask);
  taskInput.value = "";
  tagsInput.value = "";
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

// Toggle subtask
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

// Search & sort events
searchInput.addEventListener("input", renderTasks);
sortSelect.addEventListener("change", renderTasks);

// Initial render
renderTasks();
