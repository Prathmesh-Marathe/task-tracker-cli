#!/usr/bin/env node

const fs = require("fs");

const FILE_NAME = "D:/Projects/task-tracker-cli/task.json";

// -------------------------------- Helper Functions --------------------------------

function loadTasks() {
    if (!fs.existsSync(FILE_NAME)) return [];

    const data = fs.readFileSync(FILE_NAME, "utf-8");
    return data ? JSON.parse(data) : [];
}

function saveTasks(tasks) {
    fs.writeFileSync(FILE_NAME, JSON.stringify(tasks, null, 2));
}

function displayTasks(tasks) {
    if (tasks.length === 0) {
        console.log("No tasks found!");
        return;
    }

    console.log("\n******************** Tasks ********************");

    tasks.forEach(task => {
        console.log(`ID      : ${task.id}`);
        console.log(`Task    : ${task.description}`);
        console.log(`Status  : ${task.status}`);
        console.log("-----------------------------------------------");
    });
}

// -------------------------------- Add Task --------------------------------

function addTask(description) {
    if (!description) {
        console.log("Enter Valid Task");
        return;
    }

    const tasks = loadTasks();

    const newTask = {
        id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
        description,
        status: "todo",
        createdAt: new Date(),
        updatedAt: new Date()
    };

    tasks.push(newTask);
    saveTasks(tasks);

    console.log(`Task added successfully (ID: ${newTask.id})`);
}

// -------------------------------- List Tasks --------------------------------

function listTasks(status) {
    const validStatus = ["todo", "in-progress", "done"];

    if (status && !validStatus.includes(status)) {
        console.log("Invalid Status");
        return;
    }

    const tasks = loadTasks();

    const filteredTasks = status
        ? tasks.filter(task => task.status === status)
        : tasks;

    displayTasks(filteredTasks);
}

// -------------------------------- Update Task --------------------------------

function updateTask(id, updatedDescription) {
    const tasks = loadTasks();

    const task = tasks.find(task => task.id === id);

    if (!task) {
        console.log(`Task with ID ${id} not found`);
        return;
    }

    task.description = updatedDescription;
    task.updatedAt = new Date();

    saveTasks(tasks);

    console.log("Task Updated Successfully!");
}

// -------------------------------- Delete Task --------------------------------

function deleteTask(id) {
    const tasks = loadTasks();

    const filteredTasks = tasks.filter(task => task.id !== id);

    if (tasks.length === filteredTasks.length) {
        console.log(`Task with ID ${id} not found`);
        return;
    }

    saveTasks(filteredTasks);

    console.log(`Task with ID ${id} deleted successfully!`);
}

// -------------------------------- Mark Task --------------------------------

function markTask(id, status) {
    const tasks = loadTasks();

    const task = tasks.find(task => task.id === id);

    if (!task) {
        console.log(`Task with ID ${id} not found`);
        return;
    }

    task.status = status;
    task.updatedAt = new Date();

    saveTasks(tasks);

    console.log(`Task ID ${id} marked as ${status}`);
}

// -------------------------------- CLI Commands --------------------------------

const args = process.argv.slice(2);
const command = args[0];

switch (command) {

    case "add":
        addTask(args[1]);
        break;

    case "list":
        listTasks(args[1]);
        break;

    case "update": {
        const id = parseInt(args[1]);

        if (Number.isNaN(id) || !args[2]) {
            console.log("Usage: update <id> <new-task>");
            break;
        }

        updateTask(id, args[2]);
        break;
    }

    case "delete": {
        const id = parseInt(args[1]);

        if (Number.isNaN(id)) {
            console.log("Enter Valid Task ID");
            break;
        }

        deleteTask(id);
        break;
    }

    case "mark-in-progress": {
        const id = parseInt(args[1]);

        if (Number.isNaN(id)) {
            console.log("Enter Valid Task ID");
            break;
        }

        markTask(id, "in-progress");
        break;
    }

    case "mark-done": {
        const id = parseInt(args[1]);

        if (Number.isNaN(id)) {
            console.log("Enter Valid Task ID");
            break;
        }

        markTask(id, "done");
        break;
    }

    default:
        console.log("Enter VALID Command!");
}