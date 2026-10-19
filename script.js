// ===== Assignment Tracker =====
// Each assignment looks like: { id, title, dueDate, completed }

const STORAGE_KEY = "assignments";

const form = document.getElementById("assignment-form");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const list = document.getElementById("assignment-list");
const emptyMessage = document.getElementById("empty-message");
const summary = document.getElementById("summary");

let assignments = loadAssignments();

// ----- localStorage helpers -----
function loadAssignments() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Could not load assignments:", error);
    return [];
  }
}

function saveAssignments() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
  } catch (error) {
    console.error("Could not save assignments:", error);
  }
}

// ----- Date helpers -----
// Turns "2026-10-20" into a local Date (avoids time zone off-by-one bugs)
function parseDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function daysUntil(dateString) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((parseDate(dateString) - today) / msPerDay);
}

function formatDueText(dateString) {
  const pretty = parseDate(dateString).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const days = daysUntil(dateString);

  if (days < 0) return `Due ${pretty} (overdue)`;
  if (days === 0) return `Due ${pretty} (today)`;
  if (days === 1) return `Due ${pretty} (tomorrow)`;
  return `Due ${pretty} (in ${days} days)`;
}

// ----- Actions -----
function addAssignment(title, dueDate) {
  assignments.push({
    id: Date.now() + Math.random(), // unique even if added in the same millisecond
    title: title,
    dueDate: dueDate,
    completed: false,
  });
  saveAssignments();
  render();
}

function toggleCompleted(id) {
  const assignment = assignments.find((a) => a.id === id);
  if (assignment) {
    assignment.completed = !assignment.completed;
    saveAssignments();
    render();
  }
}

function deleteAssignment(id) {
  assignments = assignments.filter((a) => a.id !== id);
  saveAssignments();
  render();
}

// ----- Rendering -----
function render() {
  list.innerHTML = "";

  // Unfinished first, then sorted by soonest due date
  const sorted = [...assignments].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return a.dueDate.localeCompare(b.dueDate);
  });

  sorted.forEach((assignment) => {
    const li = document.createElement("li");
    li.className = "assignment" + (assignment.completed ? " completed" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = assignment.completed;
    checkbox.setAttribute("aria-label", "Mark as completed");
    checkbox.addEventListener("change", () => toggleCompleted(assignment.id));

    const info = document.createElement("div");
    info.className = "info";

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = assignment.title; // textContent keeps user input safe

    const due = document.createElement("div");
    due.className = "due";
    due.textContent = formatDueText(assignment.dueDate);

    const days = daysUntil(assignment.dueDate);
    if (!assignment.completed && days < 0) due.classList.add("overdue");
    else if (!assignment.completed && days <= 2) due.classList.add("soon");

    info.append(title, due);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteAssignment(assignment.id));

    li.append(checkbox, info, deleteBtn);
    list.appendChild(li);
  });

  // Empty message + summary
  emptyMessage.style.display = assignments.length === 0 ? "block" : "none";

  const done = assignments.filter((a) => a.completed).length;
  summary.textContent =
    assignments.length === 0 ? "" : `${done} of ${assignments.length} completed`;
}

// ----- Form submit -----
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const dueDate = dateInput.value;

  if (title === "" || dueDate === "") {
    alert("Please enter an assignment name and a due date.");
    return;
  }

  addAssignment(title, dueDate);
  form.reset();
  titleInput.focus();
});

render();
