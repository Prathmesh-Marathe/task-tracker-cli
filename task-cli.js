#!/usr/bin/env node

const fs = require('fs');

// ------------------------------------------- Display Task List -------------------------------------------------------
function displayTasks(tasks) {
    console.log("\n******************** Tasks ********************");

    for(task of tasks) {
        console.log("ID : ", task.id);
        console.log("Task : ", task.description);
        console.log("Status : ", task.status);
        console.log("-----------------------------------------------");
    }
}

// ------------------------------------------- Add New Task ------------------------------------------------------------
function addTask(task) {
    if(task === undefined)
        return 0;

    let tasks = [];

    if(fs.existsSync('task.json')) {
        const data = fs.readFileSync('task.json', 'utf-8');
        tasks = data ? JSON.parse(data) : [];
    }

    const id = tasks.length == 0 ? 1 : tasks[tasks.length-1].id + 1;

    const newTask = {
        id: id,
        description: task,
        status: 'todo',
        createdAt: new Date(Date.now()),
        updatedat: new Date(Date.now())
    }

    tasks.push(newTask);
    fs.writeFileSync('task.json', JSON.stringify(tasks, null, 2));
    return id;
}

// ------------------------------------------- List Tasks ------------------------------------------------------------------
function listTasks(status) {
    const taskStatus = ['todo', 'in-progress', 'done'];

    if(status !== undefined && !taskStatus.includes(status))
        return false;
    
    let tasks = [];
    let data = fs.readFileSync('task.json', 'utf-8');

    tasks = data ? JSON.parse(data) : [];

    if(tasks.length == 0)
        return "list is empty!";

    let taskList = [];

    for(task of tasks) {
        if(status === undefined) {
            taskList.push(task);
            continue;
        }

        if(task.status == status) {
            taskList.push(task);
        } 
    }

    if(taskList.length == 0)
        return false;

    displayTasks(taskList);
    return true;
}

// ------------------------------------------------------- Update Task -----------------------------------------------------
function updateTask(id, updatedTask) {
    let tasks = [];
    let data = fs.readFileSync('task.json', 'utf-8');

    tasks = data ? JSON.parse(data) : [];

    if(tasks.length == 0) {
        console.log("Task List is Empty!");
        return false;
    }

    for(let task of tasks) {
        if(task.id === id) {
            task.description = updatedTask;
            fs.writeFileSync('task.json', JSON.stringify(tasks, null, 2));
            return true;
        }
    }

    console.log(`Task with ID ${id} is not present in list`);
    return false;
}

// --------------------------------------------------- Delete Task --------------------------------------------------------------
function deleteTask(id) {
    let tasks = [];
    let data = fs.readFileSync('task.json', 'utf-8');
    tasks = data ? JSON.parse(data) : [];

    if(tasks.length == 0){
        console.log("Task List is Empty");
        return false;
    }

    for(let i=tasks.length-1; i>=0; i--) {
        if(tasks[i].id == id) {
            tasks.splice(i, 1);
            fs.writeFileSync('task.json', JSON.stringify(tasks, null, 2));
            return true;
        }
    }

    console.log(`Task with ID ${id} NOT FOUND`);
    return false;
}

// ---------------------------------------------- Marking a task as in progress or done ----------------------------------------
function mark(id, status) {
    let tasks = [];
    let data = fs.readFileSync('task.json', 'utf-8');

    tasks = data ? JSON.parse(data) : [];

    if(tasks.length == 0) {
        console.log("Task List is Empty!");
        return false;
    }

    for(let task of tasks) {
        if(task.id === id) {
            if(status === "done") {
                deleteTask(id);
            } else {
                task.status = status;
                fs.writeFileSync('task.json', JSON.stringify(tasks, null, 2));
            }
            return true;
        }
    }

    console.log(`Task with ID ${id} not found`);
}

const args = process.argv.slice(2);
const command = args[0];

switch(command) {
    case "add": {
        const task = args[1];
        const id = addTask(task);

        if(id === 0) {
            console.log("Enter Valid Task");
        } else {
            console.log(`Task added successfully (ID: {${id}})`);
        }

        break;
    }

    case "list": {
        const status = args[1];
        let isTaskPresent = listTasks(status);
        if(!isTaskPresent)
            console.log(`there is no task with status ${status}`);
        break;
    }

    case "update": {
        const id = parseInt(args[1]);
        const updatedTask = args[2];
        if(Number.isNaN(id)) {
            console.log("Enter Valid Task ID");
        } else if(updatedTask === undefined || updatedTask === "") {
            console.log("Please Enter Task to Update Old Task");
        } else {
            const res = updateTask(id, updatedTask);
            if(res) {
                console.log("Updated Sucessfully!");
            } 
        }
        break;
    }

    case "delete": {
        const id = args[1];
        if(Number.isNaN(id)) {
            console.log("Enter Valid Task ID");
        } else {
            const res = deleteTask(parseInt(id));
            if(res)
                console.log(`Task with ID ${id} deleted Successfully!`);
        }
    }

    case "mark-in-progress": {
        const id = parseInt(args[1]);
        if(Number.isNaN(id)) {
            console.log("Enter Valid Task ID");
        } else {
            const res = mark(id, "in-progress");
            if(res)
                console.log(`Status Updated Successfully for Task ID ${id}`);
        }
        break;
    }

    case "mark-done" : {
        const id = parseInt(args[1]);
        if(Number.isNaN(id)) {
            console.log("Enter Valid Task ID");
        } else {
            const res = mark(id, "done");
            if(res)
                console.log(`Status Updated Successfully for Task ID ${id}`);
        }
        break;
    }

    default : {
        console.log("Enter VALID Command!");
        break;
    }
}