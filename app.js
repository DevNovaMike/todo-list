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
const darkModeToggle = document.getElementById("darkModeToggle");
const progressBar = document.getElementById("progressBar");

// ===== Local Storage =====
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// ===== Event Listeners =====
addTaskBtn.addEventListener("click", addTask);
clearCompleted.addEventListener("click", clearCompletedTasks);
searchBar.addEventListener("input", renderTasks);
sortOptions.addEventListener("change", renderTasks);
darkModeToggle.addEventListener("click", toggleDarkMode);

// ===== Functions =====
function addTask() {
  const text = taskInput.value.trim();
  const date = dueDate.value.trim();
  const prio = priority.value;
  const cat = categoryInput.value.trim() || "General";

  if (!text) return;

  const newTask = { id: Date.now(), text, date, priority: prio, category: cat, completed:false };
  tasks.push(newTask);
  saveTasks();
  renderTasks();
  taskInput.value=""; dueDate.value=""; categoryInput.value="";
}

function renderTasks() {
  taskList.innerHTML = "";

  const search = searchBar.value.toLowerCase();
  let sorted = [...tasks];

  if(sortOptions.value==="date") sorted.sort((a,b)=> (a.date > b.date?1:-1));
  if(sortOptions.value==="priority"){ const order={high:1,medium:2,low:3}; sorted.sort((a,b)=>order[a.priority]-order[b.priority]); }
  if(sortOptions.value==="category") sorted.sort((a,b)=>a.category.localeCompare(b.category));

  const filtered = sorted.filter(t=>t.text.toLowerCase().includes(search));

  filtered.forEach(task=>{
    const li=document.createElement("li");
    li.classList.add("task-item");

    // Task main
    const mainDiv = document.createElement("div");
    mainDiv.classList.add("task-main");

    const title = document.createElement("span");
    title.classList.add("task-title"); title.textContent=task.text;
    if(task.completed){ title.style.textDecoration="line-through"; title.style.color="#888"; }

    const dateSpan = document.createElement("span");
    dateSpan.classList.add("task-date"); dateSpan.textContent=task.date?`Due: ${task.date}`:"";

    const prioBadge=document.createElement("span");
    prioBadge.className=`priority-badge priority-${task.priority}`; prioBadge.textContent=task.priority;

    const catBadge=document.createElement("span");
    catBadge.className="category-badge"; catBadge.textContent=task.category;

    const completeBtn=document.createElement("button"); completeBtn.className="complete-btn"; completeBtn.textContent="✓";
    completeBtn.onclick=()=>toggleComplete(task.id);

    const deleteBtn=document.createElement("button"); deleteBtn.className="delete-btn"; deleteBtn.textContent="✗";
    deleteBtn.onclick=()=>deleteTask(task.id);

    mainDiv.append(title,dateSpan,prioBadge,catBadge,completeBtn,deleteBtn);
    li.appendChild(mainDiv);
    taskList.appendChild(li);

    // Swipe gestures (mobile)
    let startX=null;
    li.addEventListener("touchstart",e=>{ startX=e.touches[0].clientX; });
    li.addEventListener("touchend",e=>{
      const diffX=e.changedTouches[0].clientX - startX;
      if(diffX>50) toggleComplete(task.id); // swipe right
      if(diffX<-50) deleteTask(task.id); // swipe left
    });
  });

  updateProgress();
}

function toggleComplete(id){
  tasks=tasks.map(t=>t.id===id?{...t,completed:!t.completed}:t);
  saveTasks(); renderTasks();
}

function deleteTask(id){
  tasks=tasks.filter(t=>t.id!==id);
  saveTasks(); renderTasks();
}

function clearCompletedTasks(){
  tasks=tasks.filter(t=>!t.completed);
  saveTasks(); renderTasks();
}

function saveTasks(){ localStorage.setItem("tasks",JSON.stringify(tasks)); }

function toggleDarkMode(){ document.body.classList.toggle("dark-mode"); }

function updateProgress(){
  const total=tasks.length;
  const done=tasks.filter(t=>t.completed).length;
  const percent=total?Math.round((done/total)*100):0;
  progressBar.style.width=`${percent}%`;
}

// Initial render
renderTasks();
