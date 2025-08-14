
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


const startBtn = document.querySelector("[data-start]");
const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");
const dateInput = document.querySelector("#datetime-picker");


startBtn.disabled = true;


let userSelectedDate = null;
let timerId = null;


const options = {
  enableTime: true, 
  time_24hr: true,  
  defaultDate: new Date(), 
  minuteIncrement: 1, 
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    
    if (selectedDate <= new Date()) {
      
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight'
      });
      startBtn.disabled = true;
    } else {
      
      userSelectedDate = selectedDate;
      startBtn.disabled = false;
    }
  }
};


flatpickr("#datetime-picker", options);


startBtn.addEventListener("click", () => {
  if (!userSelectedDate) return;

  
  startBtn.disabled = true;
  dateInput.disabled = true;

  timerId = setInterval(() => {
    const now = new Date();
    const diff = userSelectedDate - now;

    if (diff <= 0) {
      clearInterval(timerId);
      updateTimerDisplay(0, 0, 0, 0);
      dateInput.disabled = false; 
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(diff);
    updateTimerDisplay(days, hours, minutes, seconds);
  }, 1000);
});


function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}


function updateTimerDisplay(days, hours, minutes, seconds) {
  daysEl.textContent = days;
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}


function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}