const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const priorityInput = document.getElementById("priorityInput");
const tagInput = document.getElementById("tagInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const taskCounter = document.getElementById("taskCounter");
const searchInput = document.getElementById("searchInput");
const sortInput = document.getElementById("sortInput");

let tasks = [];

function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks.filter(task =>
    task.text.toLowerCase().includes(searchInput.value.toLowerCase())
  );

  if (sortInput.value === "date") {
    filteredTasks.sort((a,b) => (a.date || "").localeCompare(b.date || ""));
  } else if (sortInput.value === "priority") {
    const order = {high:1, medium:2, low:3};
    filteredTasks.sort((a,b) => order[a.priority] - order[b.priority]);
  } else if (sortInput.value === "az") {
    filteredTasks.sort((a,b) => a.text.localeCompare(b.text));
  }

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task";
    if (task.completed) li.classList.add("completed");

    // Highlight due today
    const today = new Date().toISOString().split("T")[0];
    if (task.date === today) li.classList.add("due-today");

    // Task main row
    const mainDiv = document.createElement("div");
    mainDiv.className = "task-main";

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const badges = document.createElement("span");
    badges.innerHTML = `
      <span class="badge priority-${task.priority}">${task.priority}</span>
      ${task.date ? `<span class="badge">${task.date}</span>` : ""}
    `;

    mainDiv.appendChild(text);
    mainDiv.appendChild(badges);

    // Tags
    const tagDiv = document.createElement("div");
    tagDiv.className = "tags";
    task.tags.forEach(t => {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = t;
      tagDiv.appendChild(span);
    });

    // Buttons
    const completeBtn = document.createElement("button");
    completeBtn.textContent = "✔️ Complete";
    completeBtn.onclick = () => {
      task.completed = !task.completed;
      renderTasks();
    };

    const subtaskBtn = document.createElement("button");
    subtaskBtn.textContent = "➕ Add Subtask";
    subtaskBtn.onclick = () => {
      const st = prompt("Enter subtask:");
      if (st) {
        task.subtasks.push({text: st, done: false});
        renderTasks();
      }
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌ Delete";
    deleteBtn.onclick = () => {
      tasks.splice(index, 1);
      renderTasks();
    };

    // Subtasks
    const subtasksUl = document.createElement("ul");
    subtasksUl.className = "subtasks";
    task.subtasks.forEach((st, si) => {
      const stLi = document.createElement("li");
      stLi.textContent = st.text;
      subtasksUl.appendChild(stLi);
    });

    li.appendChild(mainDiv);
    li.appendChild(tagDiv);
    li.appendChild(subtasksUl);
    li.appendChild(completeBtn);
    li.appendChild(subtaskBtn);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });

  updateCounter();
}

function updateCounter() {
  const remaining = tasks.filter(t => !t.completed).length;
  taskCounter.textContent = `${remaining} task${remaining !== 1 ? "s" : ""} left`;
}

addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({
    text,
    date: dateInput.value.trim(),
    priority: priorityInput.value,
    tags: tagInput.value ? tagInput.value.split(",").map(t => t.trim()) : [],
    completed: false,
    subtasks: []
  });

  taskInput.value = "";
  dateInput.value = "";
  tagInput.value = "";

  renderTasks();
});

clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter(t => !t.completed);
  renderTasks();
});

searchInput.addEventListener("input", renderTasks);
sortInput.addEventListener("change", renderTasks);

renderTasks();
