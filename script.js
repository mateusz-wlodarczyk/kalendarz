let nav = 0;
let clicked = null;
let events = localStorage.getItem("events")
  ? JSON.parse(localStorage.getItem("events"))
  : [{ date: "", startTime: "", endTime: "", title: "" }];

const calendar = document.getElementById("calendar");
const newEventModal = document.getElementById("newEventModal");
const deleteEventModal = document.getElementById("deleteEventModal");
const backDrop = document.getElementById("modalBackDrop");
const eventTitleInput = document.getElementById("eventTitleInput");
const eventDateInput = document.getElementById("eventDateInput");
const eventStartTimeInput = document.getElementById("eventStartTimeInput");
const eventEndTimeInput = document.getElementById("eventEndTimeInput");
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function openModal(date) {
  clicked = date;

  const eventForDay = events.find((e) => e.date === clicked);

  if (eventForDay) {
    document.getElementById("eventText").innerText = eventForDay.title;
    deleteEventModal.style.display = "block";
  } else {
    newEventModal.style.display = "block";
  }

  backDrop.style.display = "block";
}

function load() {
  const dt = new Date();

  const today = new Date();

  function getFirstDayOfWeek(d) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);

    return new Date(date.setDate(diff));
  }

  const firstDay = getFirstDayOfWeek(today);

  const lastDay = new Date(firstDay);
  lastDay.setDate(lastDay.getDate() + 4);

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }
  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dateString = firstDayOfMonth.toLocaleDateString("en-us", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const paddingDays = weekdays.indexOf(dateString.split(", ")[0]);
  document.getElementById("monthDisplay").innerText = `${dt.toLocaleDateString(
    "en-es",
    { month: "long" }
  )} ${year}`;

  calendar.innerHTML = "";

  for (let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement("div");
    daySquare.classList.add("day");

    const dayString = `${month + 1}/${i - paddingDays}/${year}`;

    if (i > paddingDays) {
      daySquare.innerText = i - paddingDays;

      const eventForDay = events.find((e) => e.date === dayString);

      if (i - paddingDays === day && nav === 0) {
        daySquare.id = "currentDay";
      }

      if (eventForDay) {
        const eventDiv = document.createElement("div");
        eventDiv.classList.add("event");
        eventDiv.innerText = eventForDay.title;
        daySquare.appendChild(eventDiv);
      }

      daySquare.addEventListener("click", () => openModal(dayString));
    } else {
      daySquare.classList.add("padding");
    }

    calendar.appendChild(daySquare);
  }
}

// function load() {
//   const dt = new Date();

//   function getFirstDayOfWeek(d) {
//     const date = new Date(d);
//     const day = date.getDay();
//     const diff = date.getDate() - day + (day === 0 ? -6 : 1);

//     return new Date(date.setDate(diff));
//   }

//   const firstDay = getFirstDayOfWeek(dt);
//   const lastDay = new Date(firstDay);
//   lastDay.setDate(lastDay.getDate() + 4);

//   console.log(firstDay);
//   console.log(lastDay);

//   // if (nav !== 0) {
//   //   dt.setMonth(new Date().getMonth() + nav);
//   // }
//   const day = dt.getDate();
//   const month = dt.getMonth();
//   const year = dt.getFullYear();

//   // const firstDayOfMonth = new Date(year, month, 1);
//   // const daysInMonth = new Date(year, month + 1, 0).getDate();

//   const dateString = firstDay.toLocaleDateString("en-us", {
//     weekday: "long",
//     year: "numeric",
//     month: "numeric",
//     day: "numeric",
//   });
//   console.log(dateString);
//   const dateStringForLastDate = lastDay.toLocaleDateString("en-us", {
//     weekday: "long",
//     year: "numeric",
//     month: "numeric",
//     day: "numeric",
//   });
//   console.log(dateStringForLastDate);
//   const paddingDays = weekdays.indexOf(dateString.split(", ")[0]);

//   const weekDisplay = document.getElementById("weekDisplay");
//   weekDisplay.textContent = `${dateString}
//   - ${dateStringForLastDate}`;

//   calendar.innerHTML = "";

//   console.log(paddingDays);
//   console.log(lastDay.getDate());

//   for (let i = 1; i <= 5; i++) {
//     const daySquare = document.createElement("div");
//     daySquare.classList.add("day");

//     const dayString = `${month + 1}/${i + paddingDays}/${year}`;
//     console.log(dayString);
//     console.log(dayString);

//     if (i > 0) {
//       daySquare.innerText = i;

//       const eventForDay = events.find((e) => e.date === dayString);

//       if (i - 0 === day && nav === 0) {
//         daySquare.id = "currentDay";
//       }
//       if (eventForDay) {
//         const eventDiv = document.createElement("div");
//         eventDiv.classList.add("event");
//         eventDiv.innerText = eventForDay.title;
//         daySquare.appendChild(eventDiv);
//       }

//       daySquare.addEventListener("click", () => openModal(dayString));
//     } else {
//       daySquare.classList.add("padding");
//     }

//     calendar.appendChild(daySquare);
//   }
// }

function closeModal() {
  eventTitleInput.classList.remove("error");
  newEventModal.style.display = "none";
  deleteEventModal.style.display = "none";
  backDrop.style.display = "none";
  eventTitleInput.value = "";
  clicked = null;
  load();
}

function saveEvent() {
  // console.log(eventDateInput.value);
  // console.log(clicked);
  if (eventTitleInput.value) {
    eventTitleInput.classList.remove("error");

    let helper =
      clicked !== eventDateInput.value && typeof clicked !== "undefined"
        ? clicked
        : eventDateInput.value;
    // console.log(helper);

    events.push({
      date: helper,
      title: eventTitleInput.value,
      endTime: eventStartTimeInput.value,
      startTime: eventEndTimeInput.value,
    });
    localStorage.setItem("events", JSON.stringify(events));
    closeModal();
  } else {
    eventTitleInput.classList.add("error");
  }
}

function deleteEvent() {
  events = events.filter((e) => e.date !== clicked);
  localStorage.setItem("events", JSON.stringify(events));
  closeModal();
}

function initButtons() {
  document.getElementById("nextButton").addEventListener("click", () => {
    nav++;
    load();
  });

  document.getElementById("backButton").addEventListener("click", () => {
    nav--;
    load();
  });

  document.getElementById("saveButton").addEventListener("click", saveEvent);
  document.getElementById("cancelButton").addEventListener("click", closeModal);
  document
    .getElementById("deleteButton")
    .addEventListener("click", deleteEvent);
  document.getElementById("closeButton").addEventListener("click", closeModal);
  document.getElementById("addButton").addEventListener("click", () => {
    openModal();
    load();
  });

  document.getElementById("todayButton").addEventListener("click", () => {
    nav = 0;
    load();
  });
}

initButtons();
load();

// function loadWeek() {
//   const today = new Date();

//   // ✅ Get the first day of the current week (Monday)
//   function getFirstDayOfWeek(d) {
//     // 👇️ clone date object, so we don't mutate it
//     const date = new Date(d);
//     const day = date.getDay(); // 👉️ get day of week

//     // 👇️ day of month - day of week (-6 if Sunday), otherwise +1
//     const diff = date.getDate() - day + (day === 0 ? -6 : 1);

//     return new Date(date.setDate(diff));
//   }

//   const firstDay = getFirstDayOfWeek(today);

//   // ✅ Get the last day of the current week (Sunday)
//   const lastDay = new Date(firstDay);
//   lastDay.setDate(lastDay.getDate() + 4);

//   // console.log(firstDay);
//   // console.log(lastDay);
// }
// loadWeek();
