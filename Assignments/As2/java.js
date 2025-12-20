const taskList = document.getElementById("taskList");
const taskTitle = document.getElementById("taskTitle");
const taskDesc = document.getElementById("taskDesc");
const taskPriority = document.getElementById("taskPriority");
const filterPriority = document.getElementById("filterPriority");
const toggleTheme = document.getElementById("toggleTheme");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
renderTasks();


function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}


document.getElementById("addTaskBtn").addEventListener("click", () => {
  if (!taskTitle.value.trim()) return alert("Title is required!");

  const newTask = {
    id: Date.now(),
    title: taskTitle.value,
    desc: taskDesc.value,
    priority: taskPriority.value
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  taskTitle.value = "";
  taskDesc.value = "";
});



function renderTasks() {
  taskList.innerHTML = "";

  const filter = filterPriority.value;

  tasks
    .filter(task => filter === "All" || task.priority === filter)
    .forEach(task => {
      const div = document.createElement("div");
      div.className = "task";

      div.innerHTML = `
        <div>
          <input type="text" value="${task.title}" data-id="${task.id}" class="edit-title">
          <textarea data-id="${task.id}" class="edit-desc">${task.desc}</textarea>
          <p class="priority-${task.priority.toLowerCase()}">
            Priority: ${task.priority}
          </p>
        </div>

        <div>
          <button class="deleteBtn" data-id="${task.id}">Delete</button>
        </div>
      `;

      taskList.appendChild(div);
    });

  attachEventListeners();
}


function attachEventListeners() {

  document.querySelectorAll(".edit-title").forEach(input => {
    input.addEventListener("input", e => {
      const id = Number(e.target.dataset.id);
      const task = tasks.find(t => t.id === id);
      task.title = e.target.value;
      saveTasks();
    });
  });


  document.querySelectorAll(".edit-desc").forEach(input => {
    input.addEventListener("input", e => {
      const id = Number(e.target.dataset.id);
      const task = tasks.find(t => t.id === id);
      task.desc = e.target.value;
      saveTasks();
    });
  });


  document.querySelectorAll(".deleteBtn").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = Number(e.target.dataset.id);

      if (confirm("Are you sure you want to delete this task?")) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
      }
    });
  });
}



filterPriority.addEventListener("change", renderTasks);



toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
