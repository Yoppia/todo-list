// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyC_SAO5E6i2pPkudZBNgZvEk85rquwUl18",
  authDomain: "todoapp-cd55d.firebaseapp.com",
  projectId: "todoapp-cd55d",
  storageBucket: "todoapp-cd55d.appspot.com",
  messagingSenderId: "682409331876",
  appId: "1:682409331876:web:118007a1ac8f124affaa31"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


const taskInput = document.getElementById("task-input");
const taskButton = document.getElementById("task-button");
const tableBody = document.getElementById("table-body");

const taskEditInput = document.getElementById("task-edit-input");
const taskEditIdInput = document.getElementById("task-edit-id-input")
const taskEditButton = document.getElementById("save-task-button");

let taskBeingEdited;

const db = firebase.firestore();


async function markTaskComplete(task) {

  try {

    await db.collection("tasks").doc(task.id).update({
      complete: true
    });
    

    renderTasks();
     
  } catch (err) {
    console.log(err);

  }

}

async function removeTask(event, task) {

  try {
    event.stopPropagation();
    
    await db.collection("tasks").doc(task.id).delete();
    
    renderTasks();
  } catch(err) {
    console.log(err);
  }
  
}

function openTaskEditModal(event, task) {
  event.stopPropagation();

  taskBeingEdited = task;
  taskEditInput.value = task.task;
  taskEditIdInput.value = task.id;
  $('#exampleModal').modal('show')


}

async function renderTasks() {
  tableBody.innerHTML = "";

  try {
    const tasksSnap = await db.collection("tasks").get();

    for(const taskSnap of tasksSnap.docs) {

      const task = new Task();
      const data = taskSnap.data();
      task.id = taskSnap.id;
      task.task = data.task;
      task.complete = data.complete;



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

  } catch(err) {
    console.log(err);
  }


  
}


async function addTask() {
  if(!taskInput.value) {
    return;
  }

  //const task = new Task(taskInput.value);


  try {
    const res = await db.collection("tasks").add({
      task: taskInput.value,
      complete: false,
    });
    console.log(res);
  } catch(err) {
    console.log(err);
  }
  

  renderTasks();

  taskInput.value = "";
}

async function editTask() {

  try {
    const taskId = taskEditIdInput.value;

    await db.collection("tasks").doc(taskId).update({
      task: taskEditInput.value
    });
    

    $('#exampleModal').modal('hide')
    taskEditIdInput.value = "";
    taskEditInput.value = "";

    renderTasks();
     
  } catch (err) {
    console.log(err);

  }
  
}

taskButton.addEventListener('click', addTask);
taskEditButton.addEventListener('click', editTask);

renderTasks();