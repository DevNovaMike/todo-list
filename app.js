/* =========================================================
   TO-DO APP — DAY 1 (Add + Display)
   Sections:
   1) DOM references
   2) App state
   3) Helpers
   4) Render function
   5) Event handlers
   6) Init
   ========================================================= */

/* ===== 1) DOM REFERENCES ===== */
const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const listEl = document.getElementById("taskList");
const countEl = document.getElementById("taskCount");
const statusEl = document.getElementById("status");

/* ===== 2) APP STATE =====
   For Day 1 we keep tasks only in memory.
   (Tomorrow we’ll keep this shape but add localStorage.) */
let tasks = []; // each task: { id, text, createdAt }

/* ===== 3) HELPERS ===== */
// create a task object with a unique id
function makeTask(text) {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    text: text.trim(),
    createdAt: new Date().toISOString(),
  };
}

/* ===== 4) RENDER FUNCTION =====
   Rebuilds the <ul> list from the tasks array. */
function render() {
  // build list item HTML for each task
  listEl.innerHTML = tasks
    .map(
      (t) => `
      <li class="task" data-id="${t.id}">
        <span class="task__text" title="${escapeHtml(t.text)}">${escapeHtml(
          t.text
        )}</span>
        <!-- Buttons come on Day 2 (complete/delete). -->
      </li>`
    )
    .join("");

  // update count pill
  countEl.textContent = String(tasks.length);
}

/* Small utility to avoid injecting raw HTML from user input */
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (ch) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return map[ch];
  });
}

/* ===== 5) EVENT HANDLERS ===== */
// handle add task form submit
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = input.value.trim();
  // basic validation
  if (!text) {
    input.focus();
    return;
  }

  // create + store task
  const task = makeTask(text);
  tasks.push(task);

  // re-render UI
  render();

  // status for a11y and feedback
  statusEl.textContent = `Added task: "${text}"`;

  // reset input
  form.reset();
  input.focus();
});

/* ===== 6) INIT ===== */
render(); // initial empty render
