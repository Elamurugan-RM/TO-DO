const inputBox = document.getElementById("input-box");
const dueDateInput = document.getElementById("due-date");
const categorySelect = document.getElementById("category");
const calendar = document.getElementById("calendar");

async function addTask() {
  if (inputBox.value === "" || dueDateInput.value === "") {
    alert("You must write something and select a date!");
    return;
  }

  const task = {
    text: inputBox.value,
    dueDate: new Date(dueDateInput.value),
    category: categorySelect.value,
    isChecked: false, // Initialize isChecked
    completed: false // Initialize completed
  };

  try {
    const response = await fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });

    if (!response.ok) {
      throw new Error('Failed to add task');
    }

    const newTask = await response.json();
    appendTaskToDOM(newTask);

    inputBox.value = "";
    dueDateInput.value = "";
  } catch (error) {
    console.error('Error adding task:', error);
    alert('Failed to add task. Please try again.');
  }
}

async function removeTask(taskId) {
  try {
    const response = await fetch(`http://localhost:3000/tasks/${taskId}`, { method: 'DELETE' });
    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
    document.getElementById(taskId).remove();
  } catch (error) {
    console.error('Error removing task:', error);
    alert('Failed to remove task. Please try again.');
  }
}

async function loadData() {
  try {
    const response = await fetch('http://localhost:3000/tasks');
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    const tasks = await response.json();
    tasks.forEach(task => appendTaskToDOM(task));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    alert('Failed to fetch tasks. Please try again.');
  }
}

function appendTaskToDOM(task) {
  const dueDate = new Date(task.dueDate);
  const dayId = `day-${dueDate.toISOString().split('T')[0]}`;
  const dayElement = document.getElementById(dayId);

  if (!dayElement) {
    console.error(`Day element with ID ${dayId} not found. Task date may not be within the displayed month.`);
    return;
  }

  const taskElement = document.createElement("li");
  taskElement.setAttribute('id', task._id);
  taskElement.className = task.completed ? 'checked' : '';
  taskElement.innerHTML = `<span class="category ${task.category}">${task.category}</span> ${task.text} <span class="remove-task" onclick="removeTask('${task._id}')">&#x2716;</span>`;
  taskElement.addEventListener('click', () => toggleTaskCompletion(task._id, !task.completed));
  dayElement.querySelector('ul').appendChild(taskElement);
}

async function toggleTaskCompletion(id, completed) {
  try {
    console.log('Updating task:', id, 'with completed status:', completed);
    
    const response = await fetch(`http://localhost:3000/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed })
    });

    console.log('Server response:', response);

    if (!response.ok) {
      throw new Error('Failed to update task');
    }

    const updatedTask = await response.json();

    console.log('Updated task:', updatedTask);

    // Ensure updatedTask contains the completed property
    if (updatedTask && typeof updatedTask.completed !== 'undefined') {
      document.getElementById(id).className = updatedTask.completed ? 'checked' : '';
    } else {
      console.error('Updated task is invalid:', updatedTask);
      alert('Failed to update task status. Please try again.');
    }
  } catch (error) {
    console.error('Error updating task:', error);
    alert('Failed to update task status. Please try again.');
  }
}

function generateCalendar() {
  calendar.innerHTML = "";
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  for (let i = firstDayOfMonth.getDate(); i <= lastDayOfMonth.getDate(); i++) {
    const currentDay = new Date(today.getFullYear(), today.getMonth(), i);
    const dayId = `day-${currentDay.toISOString().split('T')[0]}`;

    const dayDiv = document.createElement("div");
    dayDiv.className = "day";
    dayDiv.setAttribute('id', dayId);

    const dayHeader = document.createElement("h3");
    dayHeader.innerText = currentDay.toLocaleDateString("en-US", { month: 'short', day: 'numeric', weekday: 'short' });

    const taskList = document.createElement("ul");

    dayDiv.appendChild(dayHeader);
    dayDiv.appendChild(taskList);

    calendar.appendChild(dayDiv);
  }
}

generateCalendar();
loadData();
