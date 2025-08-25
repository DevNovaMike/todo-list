// ===== Selectors =====
const taskInput = document.getElementById("taskInput");
const taskDesc = document.getElementById("taskDesc");
const dueDate = document.getElementById("dueDate");
const priority = document.getElementById("priority");
const categoryInput = document.getElementById("categoryInput");
const recurring = document.getElementById("recurring");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const clearCompleted = document.getElementById("clearCompleted");
const searchBar = document.getElementById("searchBar");
const darkModeToggle = document.getElementById("darkModeToggle");
const progressBar = document.getElementById("progressBar");
const taskStreak = document.getElementById("taskStreak");
const exportTasksBtn = document.getElementById("exportTasks");
const importTasksInput = document.getElementById("importTasks");

// ===== Local Storage =====
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let streak = 0;

// ===== Event Listeners =====
addTaskBtn.addEventListener("click", addTask);
clearCompleted.addEventListener("click", clearCompletedTasks);
searchBar.addEventListener("input", renderTasks);
darkModeToggle.addEventListener("click", toggleDarkMode);
exportTasksBtn.addEventListener("click", exportTasks);
importTasksInput.addEventListener("change", importTasks);

// ===== Functions =====
function addTask() {
  const text = taskInput.value.trim();
  const desc = taskDesc.value.trim();
  const date = dueDate.value.trim();
  const prio = priority.value;
  const cat = categoryInput.value.trim() || "General";
  const recur = recurring.value;

  if (!text) return;

  const newTask = { 
    id: Date.now(), text, description:desc, date, priority:prio, category:cat, recurring:recur, completed:false, subtasks:[] 
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  taskInput.value=""; taskDesc.value=""; dueDate.value=""; categoryInput.value=""; recurring.value="none";
}

function renderTasks() {
  taskList.innerHTML="";
  const search = searchBar.value.toLowerCase();

  tasks.filter(t=>t.text.toLowerCase().includes(search)).forEach(task=>{
    const li=document.createElement("li"); li.classList.add("task-item");

    const mainDiv=document.createElement("div"); mainDiv.classList.add("task-main");

    const title=document.createElement("span"); title.className="task-title"; title.textContent=task.text;
    if(task.completed){ title.style.textDecoration="line-through"; title.style.color="#888"; }

    const dateSpan=document.createElement("span"); dateSpan.className="task-date"; dateSpan.textContent=task.date?`Due: ${task.date}`:"";

    const prioBadge=document.createElement("span"); prioBadge.className=`priority-badge priority-${task.priority}`; prioBadge.textContent=task.priority;
    const catBadge=document.createElement("span"); catBadge.className="category-badge"; catBadge.textContent=task.category;

    const descSpan=document.createElement("p"); descSpan.textContent=task.description; descSpan.style.fontSize="0.85rem";

    const completeBtn=document.createElement("button"); completeBtn.className="complete-btn"; completeBtn.textContent="✓"; completeBtn.onclick=()=>toggleComplete(task.id);
    const deleteBtn=document.createElement("button"); deleteBtn.className="delete-btn"; deleteBtn.textContent="✗"; deleteBtn.onclick=()=>deleteTask(task.id);

    mainDiv.append(title,dateSpan,prioBadge,catBadge,descSpan,completeBtn,deleteBtn);
    li.appendChild(mainDiv);

    // Subtasks
    const subUl=document.createElement("ul"); subUl.className="subtasks";
    task.subtasks.forEach((sub,i)=>{
      const subLi=document.createElement("li"); subLi.className="subtask-item";
      const check=document.createElement("input"); check.type="checkbox"; check.checked=sub.completed;
      check.onchange=()=>toggleSubtask(task.id,i);
      const subText=document.createElement("span"); subText.textContent=sub.text; 
      if(sub.completed) subText.style.textDecoration="line-through";
      subLi.append(check,subText);
      subUl.appendChild(subLi);
    });
    // Add subtask input
    const addSubInput=document.createElement("input"); addSubInput.type="text"; addSubInput.placeholder="Add subtask...";
    const addSubBtn=document.createElement("button"); addSubBtn.className="subtask-btn"; addSubBtn.textContent="+";
    addSubBtn.onclick=()=>addSubtask(task.id,addSubInput.value);
    li.appendChild(subUl); li.append(addSubInput, addSubBtn);

    taskList.appendChild(li);
  });

  updateProgress();
  updateStreak();
}

function toggleComplete(id){
  tasks=tasks.map(t=>t.id===id?{...t,completed:!t.completed}:t);
  handleRecurring(id);
  saveTasks(); renderTasks();
}

function deleteTask(id){ tasks=tasks.filter(t=>t.id!==id); saveTasks(); renderTasks(); }

function clearCompletedTasks(){ tasks=tasks.filter(t=>!t.completed); saveTasks(); renderTasks(); }

function addSubtask(taskId,text){
  if(!text.trim()) return;
  tasks=tasks.map(t=> t.id===taskId? {...t, subtasks:[...t.subtasks,{text,completed:false}]}:t );
  saveTasks(); renderTasks();
}

function toggleSubtask(taskId,index){
  tasks=tasks.map(t=> t.id===taskId? {...t, subtasks:t.subtasks.map((s,i)=>i===index?{...s,completed:!s.completed}:s)}:t );
  saveTasks(); renderTasks();
}

function handleRecurring(id){
  const task = tasks.find(t=>t.id===id);
  if(task.completed && task.recurring!=="none"){
    let nextDate=new Date();
    if(task.recurring==="daily") nextDate.setDate(nextDate.getDate()+1);
    if(task.recurring==="weekly") nextDate.setDate(nextDate.getDate()+7);
    if(task.recurring==="monthly") nextDate.setMonth(nextDate.getMonth()+1);
    task.completed=false; task.date=nextDate.toISOString().
