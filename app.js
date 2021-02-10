const taskInput = document.getElementById("task-input");
const taskButton = document.getElementById("task-button");
const tableBody = document.getElementById("table-body");

const taskEditInput = document.getElementById("task-edit-input");
const taskEditButton = document.getElementById("save-task-button");

let taskBeingEdited;
let tasks = [];

function markTaskComplete(task) {
  task.complete = true;
  renderTasks();
  // console.log(task);
}

function removeTask(event, task) {
  event.stopPropagation();
  // console.log(tasks); 
  tasks = tasks.filter((t) => t.id != task.id);
  renderTasks();
  // console.log(tasks); 
}

function openTaskEditModal(event, task) {
  event.stopPropagation();

  taskBeingEdited = task;
  taskEditInput.value = task.task;
  $('#exampleModal').modal('show')


}

function renderTasks() {
  tableBody.innerHTML = "";
  for(const task of tasks) {
    const row = document.createElement("tr");
    const taskCell = document.createElement("td");
    const statusCell = document.createElement("td");
    const removeCell = document.createElement("td");
    taskCell.innerHTML = task.task;

    if(task.complete) {
      statusCell.innerHTML = "<i class=\"fa fa-circle green\"></i>";
    } else {
      statusCell.innerHTML = "<i class=\"fa fa-circle-thin\"></i>";
      row.classList.add("pointer");
    }

    const removeButton = document.createElement("i");
    removeButton.classList.add("fa");
    removeButton.classList.add("fa-trash-o");
    removeButton.classList.add("ml-3");
    removeButton.classList.add("pointer");
    removeButton.addEventListener('click',  (event) => removeTask(event, task));

    const editButton = document.createElement("i");
    editButton.classList.add("fa");
    editButton.classList.add("fa-pencil");
    editButton.classList.add("pointer");
    editButton.addEventListener('click',  (event) => openTaskEditModal(event, task));

    removeCell.appendChild(editButton);
    removeCell.appendChild(removeButton);

    row.appendChild(taskCell);
    row.appendChild(statusCell);
    row.appendChild(removeCell);


    row.addEventListener('click', () => markTaskComplete(task));
    tableBody.appendChild(row);
  }
}


function addTask() {
  if(!taskInput.value) {
    return;
  }

  const task = new Task(taskInput.value);

  tasks.push(task);
  renderTasks();

  taskInput.value = "";
}

function editTask() {
  taskBeingEdited.task = taskEditInput.value;
  $('#exampleModal').modal('hide')
  renderTasks();
}

taskButton.addEventListener('click', addTask);
taskEditButton.addEventListener('click', editTask);