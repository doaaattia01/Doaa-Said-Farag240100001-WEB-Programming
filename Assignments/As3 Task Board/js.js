const cardContainer = document.getElementById("cardContainer");
const titleInput = document.getElementById("inputTitle");
const descInput = document.getElementById("inputDesc");
const priorityInput = document.getElementById("inputPriority");
const filterSelect = document.getElementById("filterSelect");
const themeBtn = document.getElementById("themeBtn");
const addBtn = document.getElementById("addBtn");

// Load Tasks from LocalStorage
let todoList = JSON.parse(localStorage.getItem("myTasks")) || [];

// --- FIX: Load Theme from LocalStorage on start ---
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
  themeBtn.textContent = "☀️ Light Mode";
}

// Initial Render
render();

// --- Core Functions ---

function save() {
  localStorage.setItem("myTasks", JSON.stringify(todoList));
}

function render() {
  cardContainer.innerHTML = "";
  const currentFilter = filterSelect.value;

  const filteredTasks = todoList.filter(item => {
    return currentFilter === "All" || item.priority === currentFilter;
  });

  filteredTasks.forEach(task => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <input type="text" class="card-title" value="${task.title}" data-id="${task.id}">
      <textarea class="card-desc" data-id="${task.id}">${task.desc}</textarea>
      
      <div class="card-footer">
        <span class="badge p-${task.priority}">${task.priority}</span>
        <button class="delete-btn" data-id="${task.id}">Delete</button>
      </div>
    `;
    cardContainer.appendChild(card);
  });
}

// --- Event Listeners ---

addBtn.addEventListener("click", () => {
  if (titleInput.value.trim() === "") return alert("Please enter a title!");

  const newItem = {
    id: Date.now(),
    title: titleInput.value,
    desc: descInput.value,
    priority: priorityInput.value
  };

  todoList.push(newItem);
  save();
  render();

  titleInput.value = "";
  descInput.value = "";
});

filterSelect.addEventListener("change", render);

// --- FIX: Toggle Theme and Save to LocalStorage ---
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
    themeBtn.textContent = "☀️ Light Mode";
  } else {
    localStorage.setItem("theme", "light");
    themeBtn.textContent = "🌙 Dark Mode";
  }
});

// Event Delegation for Delete and Edit
cardContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const idToDelete = Number(e.target.dataset.id);
    if (confirm("Remove this task?")) {
      todoList = todoList.filter(t => t.id !== idToDelete);
      save();
      render();
    }
  }
});

cardContainer.addEventListener("input", (e) => {
  if (e.target.classList.contains("card-title") || e.target.classList.contains("card-desc")) {
    const idToEdit = Number(e.target.dataset.id);
    const task = todoList.find(t => t.id === idToEdit);
    
    if (e.target.classList.contains("card-title")) {
      task.title = e.target.value;
    } else {
      task.desc = e.target.value;
    }
    save();
  }
});
