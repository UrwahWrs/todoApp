

const todoForm = document.querySelector(".todo-form");
const todoList = document.querySelector(".todo-list");
const completedTasks = document.querySelector(".completed-tasks span");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

if (localStorage.getItem("tasks")) {
  tasks.map((task) => {
    createTask(task);
  });
}



// submit form
todoForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const input = this.name;
  const inputValue = input.value;

  


  if (inputValue != "") {
    const task = {
      id: new Date().getTime(),
      name: inputValue,
      isCompleted: false, 

    };

    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    createTask(task);
    todoForm.reset();
  }
  input.focus();
});



// remove task
todoList.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("remove-task") ||
    e.target.parentElement.classList.contains("remove-task")
  ) {
    const taskId = e.target.closest("li").id;
    removeTask(taskId);
  }
});

// edit task 
todoList.addEventListener("input", (e) => {
  const taskId = e.target.closest("li").id;
  updateTask(taskId, e.target);
});


// create task
function createTask(task) {
  const taskEl = document.createElement("li");
  taskEl.setAttribute("id", task.id);
  let col_id = `${task.id}-col`;
  const taskElMarkup = `
    <div class="checkbox-wrapper">
      <input type="checkbox" id="${task.name}-${task.id}" name="tasks" ${
    task.isCompleted ? "checked" : ""
  }>
      <label for="${task.name}-${task.id}">
        <svg class="checkbox-empty">
          <use xlink:href="#checkbox_empty"></use>
        </svg>
        <svg class="checkmark">
          <use xlink:href="#checkmark"></use>
        </svg>
      </label>
      <span ${!task.isCompleted ? "contenteditable" : ""}>${task.name}</span>
    </div>
    
    <button class="drop-row" data-toggle="collapse" id="${task.id}" data-target="#${col_id}" >
    <span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span>
  </button>
  <div id="${col_id}" class="collapse">
<div class="collwin">
  <div class="col-md-6">
    <li>Notes </li>
    <input name="notec" id="${task.id}-note" type="text">
  </div>
  <div class="col-md-6">
    <input name="dat" id="${task.id}-coldate" type="date">
    <br>
    <div class="form-group">
      <li id="pri">Priority</li>
      <select name="sel" class="form-control" id="${task.id}-sel1">
      <span>${task.pri}</span>
        <option>None</option>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
    </div>
    <button class="remove-task" title="Remove ${task.name} task">
  Delete
</button>
  </div>
</div>
</div>
  `;
  taskEl.innerHTML = taskElMarkup;
  todoList.appendChild(taskEl);
  countTasks();
  
}


// remove task
function removeTask(taskId) {
  tasks = tasks.filter((task) => task.id !== parseInt(taskId));
  localStorage.setItem("tasks", JSON.stringify(tasks));
  document.getElementById(taskId).remove();
  countTasks();
}




// update task
function updateTask(taskId, el) {
  const task = tasks.find((task) => task.id === parseInt(taskId));

  if (el.hasAttribute("contenteditable")) {
    task.name = el.textContent;
  } else if(el.type == 'checkbox'){
    const span = el.nextElementSibling.nextElementSibling;
    task.isCompleted = !task.isCompleted;
    if (task.isCompleted) {
      span.removeAttribute("contenteditable");
      el.setAttribute("checked", "");
    } else {
      el.removeAttribute("checked");
      span.setAttribute("contenteditable", "");
    }
  } else {
    task.taskInfo = updateTaskInfo(task);
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
  countTasks();
}

function countTasks() {

  const completedTasksArray = tasks.filter((task) => task.isCompleted === true);
  completedTasks.textContent = completedTasksArray.length;

}

function updateTaskInfo(task){

  const inote = document.getElementById(`${task.id}-note`);
  const inputNote= inote.value;
  const idat=document.getElementById(`${task.id}-coldate`);
  const inputDate= idat.value;
  const ipri=document.getElementById(`${task.id}-sel1`);
  const inputPri= ipri.value;
  let taskI = {};

  if (inote != "" && idat !="" && ipri !="") {
    taskI = { notec: inputNote, dat: inputDate, pri: inputPri}; 
    
  }
  return taskI;
}
