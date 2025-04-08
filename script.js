const planBtn = document.getElementById("planBtn");
const calendarSection = document.getElementById("calendarSection");
const plannerContainer = document.getElementById("plannerContainer");
const datePicker = document.getElementById("datePicker");
const planner = document.getElementById("planner");
const selectedDateText = document.getElementById("selectedDate");
const saveAllBtn = document.getElementById("saveAll");
const closePlannerBtn = document.getElementById("closePlanner");
const viewTasksBtn = document.getElementById("viewTasksBtn");
const viewPlans = document.getElementById("viewPlans");

let selectedDate = null;

planBtn.addEventListener("click", () => {
  calendarSection.style.display = "block";
  calendarSection.scrollIntoView({ behavior: "smooth" });
});

datePicker.addEventListener("change", () => {
  selectedDate = datePicker.value;
  viewPlans.innerHTML = "";
});

viewTasksBtn.addEventListener("click", () => {
  if (!datePicker.value) {
    viewPlans.innerHTML = "<p>Please select a date first.</p>";
    return;
  }

  const date = datePicker.value;
  let content = "";
  for (let hour = 0; hour < 24; hour++) {
    const task = localStorage.getItem(`${date}-hour-${hour}`);
    if (task && task.trim() !== "") {
      const timeLabel = `${hour.toString().padStart(2, "0")}:00`;
      content += `<li><strong>${timeLabel}</strong>: ${task}</li>`;
    }
  }

  if (content === "") {
    viewPlans.innerHTML = "<p>No tasks saved for this date.</p>";
  } else {
    viewPlans.innerHTML = `<h3>Tasks for ${new Date(date).toDateString()}</h3><ul>${content}</ul>`;
  }
});

datePicker.addEventListener("change", () => {
  selectedDate = datePicker.value;
  if (!selectedDate) return;

  selectedDateText.textContent = `Tasks for ${new Date(selectedDate).toDateString()}`;
  planner.innerHTML = "";
  plannerContainer.style.display = "block";

  const now = new Date();
  const today = new Date().toISOString().split("T")[0];
  const currentHour = (selectedDate === today) ? now.getHours() : -1;

  for (let hour = 0; hour < 24; hour++) {
    const display = `${hour.toString().padStart(2, '0')}:00`;
    const saved = localStorage.getItem(`${selectedDate}-hour-${hour}`) || "";

    const row = document.createElement("div");
    row.classList.add("time-block");

    const timeLabel = document.createElement("div");
    timeLabel.className = "hour";
    timeLabel.textContent = display;

    const textarea = document.createElement("textarea");
    textarea.className = "description";
    textarea.rows = 2;
    textarea.value = saved;

    if (currentHour !== -1) {
      if (hour < currentHour) {
        textarea.classList.add("past");
      } else if (hour === currentHour) {
        textarea.classList.add("present");
      } else {
        textarea.classList.add("future");
      }
    } else {
      textarea.classList.add("future");
    }

    const saveBtn = document.createElement("button");
    saveBtn.className = "saveBtn";
    saveBtn.textContent = "💾";
    saveBtn.onclick = () => {
      localStorage.setItem(`${selectedDate}-hour-${hour}`, textarea.value);
      showNotification("✅ Task Saved!");
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "deleteBtn";
    deleteBtn.textContent = "🗑️";
    deleteBtn.onclick = () => {
      localStorage.removeItem(`${selectedDate}-hour-${hour}`);
      textarea.value = "";
      showNotification("❌ Task Deleted!");
    };

    row.appendChild(timeLabel);
    row.appendChild(textarea);
    row.appendChild(saveBtn);
    row.appendChild(deleteBtn);
    planner.appendChild(row);
  }

  plannerContainer.scrollIntoView({ behavior: "smooth" });
});

saveAllBtn.addEventListener("click", () => {
  if (!selectedDate) return;
  const descriptions = document.querySelectorAll(".description");
  descriptions.forEach((textarea, index) => {
    localStorage.setItem(`${selectedDate}-hour-${index}`, textarea.value);
  });
  showNotification("✅ All tasks saved!");
});

closePlannerBtn.addEventListener("click", () => {
  plannerContainer.style.display = "none";
  calendarSection.scrollIntoView({ behavior: "smooth" });
});

function showNotification(message = "✅ Task Saved!") {
  const note = document.getElementById("notification");
  note.textContent = message;
  note.style.display = "block";
  note.style.opacity = "1";

  setTimeout(() => {
    note.style.opacity = "0";
    setTimeout(() => (note.style.display = "none"), 300);
  }, 2000);
}
