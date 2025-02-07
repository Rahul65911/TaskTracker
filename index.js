const path = require('path');
const fs = require('fs');

const tasksFile = path.join(__dirname, 'tasks.json');

if(!fs.existsSync(tasksFile)) {
    fs.writeFileSync(tasksFile, JSON.stringify([]));
}

const readFile = () => {
    return JSON.parse(fs.readFileSync(tasksFile, 'utf-8'));
}

const writeFile = (tasks) => {
    fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
}

const createId = (tasks) => {
    return tasks.length > 0? Math.max(...tasks.map(task => task.id))+1 : 1;
}

const commands = {

    add(data) {
        if(!data) return console.error('data required!!!');
        
        const tasks = readFile();
        const task = {
            id: createId(tasks),
            description: data,
            status: 'todo',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        tasks.push(task)
        writeFile(tasks);

        console.log(`Task added successfully (ID: ${task.id})`);
    },

    update(id, data) {
        if(!id || !data) return console.error('Id and new data both required!!!');

        tasks = readFile();
        task = tasks.find(task => task.id === parseInt(id));
        console.log(task);

        if(!task) {
            return console.error(`task does not exist having id:${id}!!!`);
        }

        task.description = data;
        task.updatedAt = new Date().toISOString();
        writeFile(tasks);
        console.log(`Task updated successfully (ID: ${id})`);
    },

    delete(id) {
        if(!id) return console.error('Id required!!!');

        tasks = readFile();
        taskIndex = tasks.findIndex(task => task.id === parseInt(id));
        if(taskIndex === -1) return console.error(`task does not exist having id:${id}!!!`);

        tasks.splice(taskIndex, 1);
        writeFile(tasks);
        console.log(`task deleted successfully (ID: ${id})`);
    },

    list(status) {
        if(!status) return console.log(readFile());

        if(status === 'done') {
            const tasks = readFile();
            console.log(tasks.filter(task => task.status === 'done'));
        } else if(status === 'todo') {
            const tasks = readFile();
            console.log(tasks.filter(task => task.status === 'todo'));
        } else if(status === 'in-progress') {
            const tasks = readFile();
            console.log(tasks.filter(task => task.status === 'in-progress'));
        }
    },

    'mark-in-progress'(id) {
        changeStatus(id, 'in-progress');
    },

    'mark-done'(id) {
        changeStatus(id, 'done');
    }
}

function changeStatus(id, status) {
    if(!id) return console.error('Id required!!!');
    
    tasks = readFile();
    task = tasks.find(task => task.id === parseInt(id));
    if(!task) return console.error(`task does not exists (ID: ${id})`);

    task.status = status;
    task.updatedAt = new Date().toISOString();

    writeFile(tasks);
    console.log(`Task status changed to in-progress (ID: ${id})`);
}

const [command, ...args] = process.argv.slice(2);

if(!command || !commands[command]) {
    return console.error('command is not present or recognized!!! please use one of these commands: add, update, delete, list, mark-in-progress mark-done');
}

commands[command](...args);