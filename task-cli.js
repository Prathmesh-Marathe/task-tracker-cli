#!/usr/bin/env node

const fs = require('fs');

function displayTasks(tasks) {
    console.log("\n******************** Tasks ********************");

    for(task of tasks) {
        console.log("ID : ", task.id);
        console.log("Task : ", task.description);
        console.log("-----------------------------------------------");
    }
}

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

const args = process.argv.slice(2);
const command = args[0];

switch(command) {
    case "add":
        const task = args[1];
        const id = addTask(task);

        if(id === 0) {
            console.log("Enter Valid Task");
        } else {
            console.log(`Task added successfully (ID: {${id}})`);
        }

        break;

    case "list":
        const status = args[1];
        let isTaskPresent = listTasks(status);
        if(!isTaskPresent)
            console.log(`there is no task with status ${status}`);
        break;
}