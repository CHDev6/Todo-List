const task__container = document.querySelector(".task__container");
const addTaskButton = document.querySelector('.add__task');
const addTaskContent = document.querySelector(".add__task__content");
const task_color_btn = document.querySelector(".task_color_btn");
const task_edit_btn = document.querySelector('.task_edit_btn');
const edit_modal_dont_save = document.querySelector(".edit_modal_dont_save");
const blurbg = document.querySelector(".blurbg");
const edit_modal = document.querySelector(".edit_modal");
const edit_modal_edit = document.querySelector(".edit_modal_edit");
const edit_modal_save = document.querySelector(".edit_modal_save");
const edit_modal_color = document.querySelector(".edit_modal_color")
// Variable Initialization  /|\

// Grabs data from local storage about tasks
document.querySelector(".task__container").innerHTML = localStorage.getItem("task__container123");

// Event listener for adding tasks
addTaskButton.addEventListener("click", function() {
    const uniqueId = Date.now(); // used to create a unqiue id for the dynamic elements so they can classify eachother

    // Creating task div \/
    const newTask = document.createElement('div');
    newTask.classList.add("draggable"); 
    newTask.innerHTML = addTaskContent.value;
    addTaskContent.value = "";
    newTask.id = uniqueId;
    newTask.style.backgroundColor = "#0000FF";

    // Creating delete button \/
    const newTaskDeleteBtn = document.createElement('button');
    newTaskDeleteBtn.classList.add("task_delete_btn");
    newTaskDeleteBtn.innerHTML = "X";
    newTaskDeleteBtn.id = uniqueId; 
    
    // Creating edit button \/
    const newTaskEditBtn = document.createElement('button');
    newTaskEditBtn.classList.add("task_edit_btn");
    newTaskEditBtn.innerHTML = "Edit";
    newTaskEditBtn.id = uniqueId; 
    newTask.draggable = true;
    
    // Adding everything to the task container
    newTask.appendChild(newTaskDeleteBtn);
    newTask.appendChild(newTaskEditBtn);
    task__container.appendChild(newTask);
    localStorage.setItem("task__container123", task__container.innerHTML); //adding the new task to local storage

});

task__container.addEventListener("click", function(event) {
    const target = event.target;

    // deleting a task
    if (target.classList.contains("task_delete_btn")) {
        const taskId = target.id;
        const taskElement = document.getElementById(taskId);
        if (taskElement) {
            taskElement.remove();
            localStorage.setItem("task__container123", task__container.innerHTML); 
        }
    }

    // editing a task
    if (target.classList.contains("task_edit_btn")) {
        const taskId = target.id;
        const taskElement = document.getElementById(taskId);
        const taskText = taskElement.childNodes[0].textContent.trim();

        // Prepare for editing modal
        edit_modal.classList.remove("hidden");
        blurbg.classList.remove("hidden");
        localStorage.setItem("taskId2", taskId);

        // Get RGB color and convert to hex
        const rgbColor = window.getComputedStyle(taskElement).backgroundColor;
        const hexColor = rgbToHex(rgbColor);
        edit_modal_color.value = hexColor;
        edit_modal_edit.style.backgroundColor = rgbColor;

        // Set edit modal text and local storage
        if (taskText == "X") {
            edit_modal_edit.value = "";
            localStorage.setItem("message", "");
            localStorage.setItem("v1", "");
        } else {
            edit_modal_edit.value = taskText;
            localStorage.setItem("message", taskText);
            localStorage.setItem("v1", taskText);
        }
    }
});

// Function to convert RGB to Hexadecimal
function rgbToHex(rgb) {
    // Use regular expression to match RGB values
    const matches = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!matches) {
        return rgb; // Return original value if not in expected format
    }

    // Convert each component to hexadecimal and concatenate
    const hex = (x) => ("0" + parseInt(x).toString(16)).slice(-2);
    return `#${hex(matches[1])}${hex(matches[2])}${hex(matches[3])}`;
}


// to modify local storage on the textarea within the edit modal
edit_modal_edit.addEventListener('keyup', function(){
    localStorage.setItem("v1", edit_modal_edit.value)
})

edit_modal_save.addEventListener("click", function(){    
    edit_modal.classList.add("hidden");
    blurbg.classList.add("hidden");

    const taskElement3 = document.getElementById(localStorage.getItem("taskId2"));

    taskElement3.style.backgroundColor = edit_modal_color.value;
    
    taskElement3.innerHTML = `${localStorage.getItem("v1")}<button class="task_delete_btn" id="${localStorage.getItem("taskId2")}">X</button><button class="task_edit_btn" id="${localStorage.getItem("taskId2")}">Edit</button>`;

})

// for closing edit modal
edit_modal_dont_save.addEventListener('click', function(){
    edit_modal.classList.add("hidden");
    blurbg.classList.add("hidden");
})

// for changing color of modal
edit_modal_color.addEventListener("input",function(){
    edit_modal_edit.style.backgroundColor = edit_modal_color.value;

})

// drag start event
task__container.addEventListener('dragstart', e => {
    if (e.target.classList.contains('draggable')) {
        e.target.classList.add('dragging');
    }
});

// drag end event
task__container.addEventListener('dragend', e => {
    if (e.target.classList.contains('draggable')) {
        e.target.classList.remove('dragging');
        localStorage.setItem("task__container123", task__container.innerHTML); //rrr
    }
});

// drag over event
task__container.addEventListener('dragover', e => {
    e.preventDefault();
    const afterElement = getDragAfterElement(task__container, e.clientY);
    const draggable = document.querySelector('.dragging');
    if (afterElement == null) {
        task__container.appendChild(draggable);
    } else {
        task__container.insertBefore(draggable, afterElement);
    }
}); 


// for what happens when a drag event ends and the elements must be moved
function getDragAfterElement(task__container, y) {
    const draggableElements = [...task__container.querySelectorAll('.draggable:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}
