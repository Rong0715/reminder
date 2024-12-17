// DOM Elements
const currentDateElement = document.getElementById("currentDate");
const reminderInput = document.getElementById("reminderInput");
const reminderDate = document.getElementById("reminderDate");
const prioritySelect = document.getElementById("prioritySelect");
const addButton = document.getElementById("addButton");
const remindersList = document.getElementById("remindersList");
const modalWindow = document.getElementById("editModal");
const modalText = document.getElementById("editReminderInput");
const modalDate = document.getElementById("editReminderDate");
const modalPriority = document.getElementById("editPrioritySelect");
const modalClose = document.getElementById("modalClose");
const modalSave = document.getElementById("saveEditButton");

// Set default date-time value to current date and time
const now = new Date();
reminderDate.value = toLocalDateTimeString(now);

// Date format
const daysInAWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const monthsInAYear = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Reminder object
class Reminder {
  constructor(
    text,
    dateDue,
    priority,
    dateCreation = new Date(),
    id = dateCreation.toISOString(),
    completed = false
  ) {
    this.text = text;
    this.dateDue = dateDue;
    this.priority = priority;
    this.dateCreation = dateCreation;
    this.id = id;
    this.completed = completed;
  }
  getText() {
    return this.text;
  }
  getDateDue() {
    return this.dateDue;
  }
  getPriority() {
    return this.priority;
  }
  getDateCreation() {
    return this.dateCreation;
  }
  getId() {
    return this.id;
  }
  isCompleted() {
    return this.completed;
  }
  setText(text) {
    this.text = text;
  }
  setDateDue(dateDue) {
    this.dateDue = dateDue;
  }
  setPriority(priority) {
    this.priority = priority;
  }
  setCompleted(isCompleted) {
    this.completed = isCompleted;
  }
}

// Existing Reminders
let reminders = [];

let toEditId;

/*
graph TD
    A[User Opens App] --> B[View Existing Reminders]
    A --> C[Add New Reminder]
    C --> D[Enter Reminder Details]
    D --> E[Set Due Date/Time]
    D --> F[Set Priority]
    D --> G[Save Reminder]
    G --> B
    B --> H[Mark as Complete]
    B --> I[Delete Reminder]
    B --> J[Edit Reminder]
    J --> D
*/

// === Reminder App Tasks ===

/*
Task 1: Date Display
- Display the current date in the header
- Format it nicely (e.g., "Monday, March 18, 2024")
*/

currentDateElement.textContent = formatDate(now);

/*
Task 2: Add Reminder
- Create a function to add new reminders
- Collect data from input fields (text, date, priority)
- Create reminder objects with unique IDs
- Store reminders in localStorage
*/

addButton.addEventListener("click", addNewReminder);

/*
Task 3: Display Reminders
- Create a function to display all reminders
- Sort reminders by date
- Display different styles based on priority
- Show date in a readable format
*/

load();
updateUI();

/*
Task 4: Reminder Actions
- Implement mark as complete functionality
- Add delete reminder feature
- Add edit reminder capability
*/

remindersList.addEventListener("click", reminderOperation);
modalClose.addEventListener("click", (e) => {
  e.preventDefault();
  modalWindow.style.display = "none";
});
modalSave.addEventListener("click", (e) => {
  e.preventDefault();
  const reminder = findReminder(toEditId);
  if (
    !(
      inputErrorHandler(modalText.value, "text") &&
      inputErrorHandler(modalDate.value, "date")
    )
  ) {
    modalWindow.style.display = "none";
    return;
  }
  reminder.setText(modalText.value);
  reminder.setDateDue(new Date(modalDate.value));
  reminder.setPriority(modalPriority.value);
  modalWindow.style.display = "none";
  updateUI();
});

/*
Task 5: Data Persistence
- Save reminders to localStorage
- Load reminders when page loads
- Update localStorage when reminders change

DONE
*/

/*
Task 6: Validation
- Validate input fields
- Show error messages for invalid inputs
- Prevent duplicate reminders
*/

/*
Task 7: Sorting and Filtering
- Add ability to sort by date or priority
- Filter reminders by status (complete/incomplete)
- Search reminders by text
*/

function formatDate(date, showHour = false) {
  let hour = "";
  if (showHour) {
    hour = `${date.getHours()}:${String(date.getMinutes()).padStart(
      2,
      "0"
    )} | `;
  }
  return (hour += `${daysInAWeek[date.getDay()]}, ${
    monthsInAYear[date.getMonth()]
  } ${date.getDate()}, ${date.getFullYear()}`);
}

function addNewReminder(e) {
  e.preventDefault();
  if (
    !(
      inputErrorHandler(reminderInput.value, "text") &&
      inputErrorHandler(reminderDate.value, "date")
    )
  ) {
    console.error("Reminder can't be created with given input.");
    return;
  }
  const text = reminderInput.value;
  const dateDue = new Date(reminderDate.value);
  const priority = prioritySelect.value;
  const newReminder = new Reminder(text, dateDue, priority);
  reminders.push(newReminder);
  updateUI();
}

function updateUI() {
  save();
  if (reminders.length === 0) {
    remindersList.innerHTML = "<p>Your reminders will be here...</p>";
    return;
  }
  remindersList.innerHTML = "";
  const sortedReminders = sortByDue(reminders, true);
  sortedReminders.forEach((reminder) => insertReminderItem(reminder));
}

function insertReminderItem(reminder) {
  const html = `
  <div id="${reminder.getId()}">
    <div class="reminder-item priority-${reminder.getPriority()}">
      <div class="reminder-content">
        <h3 id="${reminder.getId()} text" ${
    reminder.isCompleted() ? 'class="completed"' : ""
  }>${reminder.getText()}</h3>
        <p>Due: ${formatDate(reminder.getDateDue(), true)}</p>
      </div>
      <div class="todo-buttons">
          <button class="btn btn-complete" id="${reminder.getId()} complete">✓</button>
          <button class="btn btn-edit" id="${reminder.getId()} edit">✎</button>
          <button class="btn btn-delete" id="${reminder.getId()} delete">×</button>
      </div>
    </div>
  </div>
    `;
  remindersList.insertAdjacentHTML("afterbegin", html);
}

function sortByDue(reminders, closestFirst = false) {
  if (closestFirst) {
    return reminders.toSorted((a, b) => {
      return a.getDateDue() < b.getDateDue() ? 1 : -1;
    });
  } else {
    return reminders.toSorted((a, b) => {
      return a.getDateDue() > b.getDateDue() ? 1 : -1;
    });
  }
}

function btnSelector(id, btn) {
  return document.getElementById(id + " " + btn);
}

function reminderOperation(e) {
  const target = e.target;
  const [id, operation] = target.id.split(" ");

  switch (operation) {
    case "complete":
      handleComplete(id);
      break;
    case "edit":
      hanldeEdit(id);
      break;
    case "delete":
      handleDelete(id);
      break;
  }

  updateUI();
}

function handleComplete(id) {
  console.log("Completed!");
  const editReminder = findReminder(id);
  editReminder.setCompleted(true);
}
function hanldeEdit(id) {
  console.log("Edited!");
  toEditId = id;
  const editReminder = findReminder(id);
  modalText.value = editReminder.getText();
  modalDate.value = toLocalDateTimeString(editReminder.getDateDue());
  modalWindow.style.display = "block";
}
function handleDelete(id) {
  console.log("Deleted!");
  document.getElementById(id).innerHTML = "";
  deleteIdx = reminders.findIndex(({ id }) => id === id);
  reminders.splice(deleteIdx, 1);
}

function findReminder(targetId) {
  return reminders[reminders.findIndex(({ id }) => id === targetId)];
}

function toLocalDateTimeString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function save() {
  localStorage.setItem("remindersList", JSON.stringify(reminders));
}

function load() {
  if (localStorage.getItem("remindersList")) {
    reminders = JSON.parse(localStorage.getItem("remindersList"));
    reminders = reminders.map(
      ({ text, dateDue, priority, dateCreation, id, completed }) => {
        return new Reminder(
          text,
          new Date(dateDue),
          priority,
          new Date(dateCreation),
          id,
          completed
        );
      }
    );
    console.log(reminders);
  }
}

function inputErrorHandler(input, type) {
  switch (type) {
    case "text":
      if (input.length >= 100) {
        console.error("Text too long, be easy to yourself.");
        return false;
      }
      if (input.length == 0) {
        console.error("You can't create empty reminder.");
        return false;
      }
      return true;
    case "date":
      if (new Date(input) < new Date()) {
        console.error("Life is going forward, no reminder for the past.");
        return false;
      }
      return true;
  }
}
