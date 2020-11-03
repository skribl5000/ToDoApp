

document.addEventListener("DOMContentLoaded", LoadTasks);
window.addEventListener("load", updateStats);

// import * as fs from 'fs';

let taskDiv = document.getElementById('TaskList');
completedFilter = document.getElementById('HideCompleted');
completedFilter.addEventListener('change', filterTasks)


async function readFile(filePath) {
    const response = await fetch(filePath, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })

    const data = await response.json()
    return data
}

async function LoadTasks() {
    const data = await readFile('./data.json');
    for (var id in data['tasks']) {
        let task = data['tasks'][id];
        let taskElement = document.createElement('div');
        taskElement.setAttribute('taskid', id)
        taskElement.classList.add('Task');
        let taskName = document.createElement('span')
        taskName.textContent = task['name']
        taskElement.appendChild(taskName);
        let today = new Date()
        if (task["status"] == "Active") {
            taskElement.classList.add('ActiveTask');

            let targetDate = Date.parse(task['targetDate']);
            let daysLeft = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
            if (daysLeft < 0) {
                daysLeft = 0;
            }
            let daysLeftElement = document.createElement('span');
            daysLeftElement.classList.add('DaysLeft');
            if (daysLeft == 1) {
                daysLeftElement.textContent = daysLeft.toString() + ' Day';
            }
            else {
                daysLeftElement.textContent = daysLeft.toString() + ' Days';
            }
            taskElement.appendChild(daysLeftElement)

            if (daysLeft < 3) {
                taskElement.classList.add('RedTask');
            }

            buttons = CreateButtons();
            taskElement.appendChild(buttons);

        }
        else {
            let completedDate = task['completedDate']
            complDateElem = document.createElement('span');
            complDateElem.textContent = completedDate;
            taskElement.appendChild(complDateElem);
            taskElement.classList.add('CompletedTask');
        }



        taskDiv.append(taskElement);
    }
}


function CreateButtons() {
    let buttons = document.createElement('div');
    buttons.classList.add('buttons');
    let completeBtn = document.createElement('button');
    completeBtn.addEventListener
    let deleteBtn = document.createElement('button');
    completeBtn.classList.add('CmplBtn');
    completeBtn.addEventListener('click', CompleteElement);
    deleteBtn.classList.add('DelBtn');
    deleteBtn.addEventListener('click', DeleteElement);
    buttons.appendChild(completeBtn);
    buttons.appendChild(deleteBtn);
    return buttons
}

function DeleteElement() {
    this.parentElement.parentElement.remove();
}
function CompleteElement() {
    let data = readFile('./data.json')
    var new_data;
    data.then(
        data=> data['tasks'][this.parentElement.parentElement.getAttribute('taskid')]
    )
    console.log(new_data);


    // this.parentElement.parentElement.classList.remove('RedTask');
    // this.parentElement.parentElement.classList.remove('ActiveTask');
    // this.parentElement.parentElement.classList.add('CompletedTask');

    // let completedDate = new Date();
    // let complDateElem = document.createElement('span');
    // completedDate = completedDate.getFullYear().toString() + '-' 
    // + String(completedDate.getMonth() + 1).padStart(2, '0') + '-' 
    // + String(completedDate.getDate()).padStart(2, '0');
    // complDateElem.textContent = completedDate;
    // this.parentElement.parentElement.
}

async function filterTasks() {
    let tasks = document.getElementsByClassName('Task');
    if (this.checked) {
        for (const task of tasks) {
            if (task.classList.contains('CompletedTask')) {
                task.classList.add('HiddenTask');
            }
        }
    }
    else if (!this.checked) {
        for (const task of tasks) {
            if (task.classList.contains('HiddenTask')) {
                task.classList.remove('HiddenTask');
            }
        }
    }
}

async function updateStats() {
    const data = await readFile('./data.json');

    let activeCounter = document.getElementById('ActiveCount');
    let completedCounter = document.getElementById('CompletedCount');
    let dueCounter = document.getElementById('DueSoonCount');

    let a = c = d = 0;

    let tasks = Array.from(document.getElementsByClassName('Task'))
    for (id in tasks) {
        let task = tasks[id];
        if (task.classList.contains('ActiveTask')) {
            a++;
            if (task.classList.contains('RedTask')) {
                d++;
            }
        }
        else {
            c++
        }
    }
    activeCounter.textContent = a;
    completedCounter.textContent = c;
    dueCounter.textContent = d;
}




