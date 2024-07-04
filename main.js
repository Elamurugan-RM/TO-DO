const inputBox = document.getElementById("input-box");
const dueDateInput = document.getElementById("due-date");
const categorySelect = document.getElementById("category");
const calendar = document.getElementById("calendar");

function addTask() {
  if (inputBox.value === "" || dueDateInput.value === "") {
    alert("You must write something and select a date!");
    return;
  }
  
  const taskText = inputBox.value;
  const dueDate = new Date(dueDateInput.value);
  const category = categorySelect.value; // Get selected category
  const dayId = `day-${dueDate.toISOString().split('T')[0]}`;
  
  const taskList = document.getElementById(dayId);
  
  if (!taskList) {
    alert("Selected date is not within the displayed month.");
    return;
  }
  
  let li = document.createElement("li");
  li.innerHTML = `<span class="category ${category}">${category}</span> ${taskText} <span onclick="removeTask(this)">&#x2716;</span>`;
  taskList.appendChild(li);
  
  inputBox.value = "";
  dueDateInput.value = "";
  saveData();
}

function removeTask(element) {
  element.parentElement.remove();
  saveData();
}

function saveData() {
  const monthData = {};
  const dayElements = document.querySelectorAll(".day ul");
  dayElements.forEach(day => {
    const dayId = day.parentElement.id;
    monthData[dayId] = day.innerHTML;
  });
  localStorage.setItem("monthData", JSON.stringify(monthData));
}

function loadData() {
  const monthData = JSON.parse(localStorage.getItem("monthData"));
  if (monthData) {
    Object.keys(monthData).forEach(dayId => {
      document.getElementById(dayId).innerHTML = monthData[dayId];
    });
  }
}

function generateCalendar() {
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
