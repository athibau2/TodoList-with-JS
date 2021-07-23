class Task
{
    constructor({ text, date, done, id }) 
    {
        this.text = text
        this.date = date
        this.done = done
        this.id = id
    }

    toHTML()        // takes information entered by a user and applies it to the task template
    {
        return `
        <li class="list-group-item">
            <i onclick="updateTask(${this.id})" class="material-icons checkBox">${this.done ? "check_box" : "check_box_outline_blank"}</i>
            <span class=${this.done ? "strikeText" : ""}>${this.text}</span>
            <i onclick="deleteTask(${this.id})" class="material-icons removeCircle">remove_circle</i>
            <span class="dueDate">${this.prettyDate()}</span>
        </li>
        `
    }

    prettyDate()        // takes yyyy-mm-dd format and converts it to dd / mm / yyyy
    {
        let year = this.date.substring(0, 4)
        let month = this.date.substring(5, 7)
        let day = this.date.substring(8, 10)
        return month + " / " + day + " / " + year
    }

    toggle()            // switches tasks completion between true and false
    {
        this.done = !this.done
    }
}

// following two if statments fill task details and date with local storage after refresh
if (localStorage.getItem('form text') != "")    
{
    document.getElementById("taskInfo").value = localStorage.getItem('form text');
} 
if (localStorage.getItem('form date') != "")    
{
    document.getElementById("taskDate").value = localStorage.getItem('form date');
} 

let tasks = readStorage() || []         // either fills tasks with local storage or an empty array
readTasks()

function updateStorage(newData)         // adds a new task to the storage, using newData info
{
    let jsonString = JSON.stringify(newData);       // converts the array object into a string
    localStorage.setItem('database', jsonString);   // adds new string into local storage database
    document.getElementById("taskDate").value = ""
    document.getElementById("taskInfo").value = ""
    localStorage.setItem('form text', document.getElementById("taskInfo").value)
    localStorage.setItem('form date', document.getElementById("taskDate").value)
}   // last 4 lines clear form and local storage for form after submitting task

function readStorage() 
{
    let storageResultString = localStorage.getItem('database');
    let storageResult = JSON.parse(storageResultString) || []
    storageResult = storageResult.map(taskData => new Task(taskData));
    if (localStorage.getItem('form') != "") 
    return storageResult;
}

function escape(text) {
    var charsToReplace = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;'
    };
    return text.replace(/[&<>]/g, function(char) {
        return charsToReplace[char] || char;
    });
};

function createTask() 
{
    let taskInfo = document.getElementById("taskInfo").value;
    let newDate = document.getElementById("taskDate").value;

    if (taskInfo.trim() == "") return false
    if (newDate.trim() == "") return false
    
    let escapeText = escape(document.getElementById("taskInfo").value)
    console.log(escapeText)

    let newTask = new Task
    ({
        text: escapeText,
        done: false,
        date: newDate,
        id: Date.now()
    })
    tasks.push(newTask)
    updateStorage(tasks)
    readTasks();
}

function readTasks() 
{
    let tempTasks = readStorage()
    if (document.getElementById("customSwitch1").checked) tempTasks = sortDate(tempTasks)
    if (document.getElementById("customSwitch2").checked) tempTasks = filterCompleted(tempTasks)

    let taskString = ""
    for (let i = 0; i < tempTasks.length; ++i) 
    {
       taskString += tempTasks[i].toHTML()
    }
    document.getElementById("taskList").innerHTML = taskString
}

function updateTask(id) 
{
    for (let i = 0; i < tasks.length; ++i) 
    {
        if (tasks[i].id == id) tasks[i].toggle()
    }
    updateStorage(tasks)
    readTasks()
}

function deleteTask(id) 
{
    for (let i = 0; i < tasks.length; ++i) 
    {
        if (tasks[i].id == id) tasks.splice(i, 1)
    }
    updateStorage(tasks)
    readTasks()
}

function stopRefresh() 
{
    event.preventDefault();
    createTask();
}

function saveInput() 
{
    let formInput = document.getElementById("taskInfo").value;
    localStorage.setItem('form text', formInput);
    let tempDate = document.getElementById("taskDate").value;
    localStorage.setItem('form date', tempDate);
}

function sortDate(tasksByDate) 
{
    tasksByDate.sort(function(a, b) 
    {
        if (a.date > b.date) return 1;
        else if (a.date < b.date) return -1;
        return 0;
    })
    console.log(tasksByDate)
    return tasksByDate
}


function filterCompleted(doneTasks)
{
    let uncheckedTasks = doneTasks.filter(task => task.done == false) || []
    return uncheckedTasks
}

