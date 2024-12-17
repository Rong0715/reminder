// DOM Elements
const currentDateElement = document.getElementById("currentDate");
const reminderInput = document.getElementById("reminderInput");
const reminderDate = document.getElementById("reminderDate");
const prioritySelect = document.getElementById("prioritySelect");
const addButton = document.getElementById("addButton");
const remindersList = document.getElementById("remindersList");

// Set default date-time value to current date and time
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, "0");
const day = String(now.getDate()).padStart(2, "0");
const hours = String(now.getHours()).padStart(2, "0");
const minutes = String(now.getMinutes()).padStart(2, "0");
reminderDate.value = `${year}-${month}-${day}T${hours}:${minutes}`;

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
  constructor(text, dateDue, priority, dateCreation = new Date()) {
    this.text = text;
    this.dateDue = dateDue;
    this.priority = priority;
    this.dateCreation = dateCreation;
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
  setText(text) {
    this.text = text;
  }
  setDateDue(dateDue) {
    this.dateDue = dateDue;
  }
  setPriority(priority) {
    this.priority = priority;
  }
}

// Existing Reminders
let reminders = [];

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

updateUI();

/*
Task 4: Reminder Actions
- Implement mark as complete functionality
- Add delete reminder feature
- Add edit reminder capability

Task 5: Data Persistence
- Save reminders to localStorage
- Load reminders when page loads
- Update localStorage when reminders change

Task 6: Validation
- Validate input fields
- Show error messages for invalid inputs
- Prevent duplicate reminders

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
  const text = reminderInput.value;
  const dateDue = new Date(reminderDate.value);
  const priority = prioritySelect.value;
  const newReminder = new Reminder(text, dateDue, priority);
  reminders.push(newReminder);
  updateUI();
}

function updateUI() {
  if (reminders.length === 0) {
    return;
  }
  remindersList.innerHTML = "";
  const sortedReminders = sortByDue(reminders, true);
  sortedReminders.forEach((reminder) => insertHTML(reminder));
}

function insertHTML(reminder) {
  remindersList.insertAdjacentHTML("afterbegin", buildReminderItem(reminder));
}

function buildReminderItem(reminder) {
  const html = `<div class="reminder-item priority-${reminder.getPriority()}">
            <div class="reminder-content">
                <h3>${reminder.getText()}</h3>
                <p>Due: ${formatDate(reminder.getDateDue(), true)}</p>
            </div>
        </div>`;
  return html;
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
