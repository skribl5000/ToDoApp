document.addEventListener("DOMContentLoaded", loadTasks);

let addBtn = document.getElementById('AddBtn');
addBtn.addEventListener('click', CreateTask);

let taskDiv = document.getElementById('TaskList');
let completedFilter = document.getElementById('HideCompleted');
completedFilter.addEventListener('change', filterTasks)

const API_URL ='http://localhost:5000/todo/api/v1.0/tasks'


async function loadTasks(){
    getTasks(API_URL);
    updateStats();
}

async function getTasks(url) {

    while (taskDiv.firstChild) {
        taskDiv.removeChild(taskDiv.firstChild);
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', 
        'Accept': 'application/json'
      },
    });
  const response_data = await response.json().then(data=> {
    return data
   });

   for (var id in response_data['tasks']) {
    let task = response_data['tasks'][id];
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

    updateStats();
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

async function DeleteElement() {
    let taskId = this.parentElement.parentElement.getAttribute('taskid')
    let request_url = API_URL + '/' + taskId;
    let data = {
        'removed': 1
    }
    const response = await fetch(request_url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', 
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });
    const response_data = await response.json().then(data=> {
        return data
    });
    console.log(data);
    this.parentElement.parentElement.remove();
}

async function CreateTask(){
    let data = {
        'name': document.getElementById('NewTaskText').value,
        'targetDate': document.getElementById('NewTaskDue').value,
    }
    if (data['targetDate'] == '' || data['name'] == '' ){
        alert('Task name and target date must be provided!');
        return;
    }

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const response_data = await response.json().then(data=> {
          return data
      });
      console.log(response_data);

      loadTasks();

}

async function CompleteElement() {
    let taskId = this.parentElement.parentElement.getAttribute('taskid')
    let request_url = API_URL + '/' + taskId;

    let completedDate = new Date();
    let complDateElem = document.createElement('span');

    completedDate = completedDate.getFullYear().toString() + '-' 
     + String(completedDate.getMonth() + 1).padStart(2, '0') + '-' 
     + String(completedDate.getDate()).padStart(2, '0');

    let data = {
        'status': 'Closed',
        'completedDate': completedDate,
    }
    const response = await fetch(request_url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', 
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    });
    const response_data = await response.json().then(data=> {
        return data
    });
    
    complDateElem.textContent = completedDate;
    this.parentElement.parentElement.classList.remove('RedTask');
    this.parentElement.parentElement.classList.remove('ActiveTask');
    this.parentElement.parentElement.classList.add('CompletedTask');
    let taskElement = this.parentElement.parentElement
    let field = this.parentElement.parentElement.getElementsByClassName('DaysLeft')[0];
    let buttons = this.parentElement.parentElement.getElementsByClassName('buttons')[0];
    field.remove();
    buttons.remove();
    taskElement.append(complDateElem);

    updateStats();
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
