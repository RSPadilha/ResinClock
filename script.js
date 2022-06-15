"use strict";

function $(x) {return document.getElementById(x);} 
function checkTime(i) { return i < 10 ? i = "0" + i : i;} // Zero on decimals

// STOPWATCH START
let stopwatch = { // Can be a class if wanted to create multiple stopwatches(class can reference this.)
   "id": 0,
   "html": $("stopwatch"),
   "minutes": 0,
   "seconds": 0,
   "isPaused": true,
   "play": () => {
      stopwatch.id = setInterval(timer.upward, 1000, stopwatch, stopwatch.html); // Try to get reference like "self"
   },
   "pause": () => {
      clearInterval(stopwatch.id);
   },
   "stop" : () => {
      clearInterval(stopwatch.id);
      stopwatch.minutes = stopwatch.seconds = 0;
      stopwatch.isPaused = true;
      stopwatch.html.innerHTML = "00:00";
      // criar updateView(div, value) talvez
   }
}
function play(){
   stopwatch.isPaused = !stopwatch.isPaused;
   if(!stopwatch.isPaused) {
      stopwatch.play();
   } else {
      stopwatch.pause();
   }
}
function stop(){
   stopwatch.stop();
}
const timer = {
   upward(e, html) {
      e.seconds++;
      if(e.seconds == 60) {
         e.seconds = 0;
         e.minutes++;
      }
      html.innerHTML = `${checkTime(e.minutes)}:${checkTime(e.seconds)}`;
      // `${minutes.toLocaleString('en-US',{minimumIntegerDigits: 2,})}:${seconds.toLocaleString('en-US',{minimumIntegerDigits: 2,})}`;
   },
   downward(e, html ,loop) {
      e.seconds--;
      if(e.seconds <= 0 && e.minutes <= 0 && !loop) {
         clearInterval(e.id);
      }else if(e.seconds < 0) {
         if(e.minutes == 0 && loop){
            e.minutes = e.startingMinute;
            resin.quantity++; /* gambiarra */
            calculateResin(); 
         }
         e.seconds = 59;
         e.minutes--;
      }
      html.innerHTML = `${checkTime(e.minutes)}:${checkTime(e.seconds)}`;
   }
}
// STOPWATCH END

// RESIN COUNTER START
let timeNow = new Date(); /* resetar quando usuario sincronizar */
var resin = {
   "html": {
      "quantity": $("resina-atual"),
      "CDTimer": $("timer-resina"),
      "timeToFull": $("time-to-full"),
      "dateWhenFull": $("date-when-full"),
      "inputValue": $("resin-input-value"),
      "inputTime": $("resin-input-time")
   },
   "syncedTime": new Date(localStorage.getItem("syncedTime")),
   "quantityWhenSynced": localStorage.getItem("resinWhenSynced"),
   "quantity": 0,
   "timer": {
      "id": 0,
      "startingMinute": 8,
      "minutes": 0,
      "seconds": 0
   }
} // done
function sync() { /* chamar todas funções ao iniciar */
   resin.syncedTime = new Date();
   localStorage.setItem("syncedTime", resin.syncedTime);
   resin.quantityWhenSynced  = resin.html.inputValue.value;
   if (resin.quantityWhenSynced != "") {
      resin.quantity = resin.quantityWhenSynced;
      localStorage.setItem("resinWhenSynced", resin.quantityWhenSynced);
   }
} // done for now
function calculateResin() {
   if (resin.syncedTime != null && resin.quantityWhenSynced != null) {
      let difference = (new Date().getTime() - resin.syncedTime.getTime());
      resin.quantity = Math.floor((difference / 1000 / 60 / 8) + parseInt(resin.quantityWhenSynced));
      resin.html.quantity.innerHTML = resin.quantity;
   }
} // done
calculateResin();

function cdTimer() {
   if (resin.syncedTime != null && resin.quantityWhenSynced != null) {
      let difference = (new Date().getTime() - resin.syncedTime.getTime());
      resin.timer.minutes = Math.floor((difference / 1000 / 60)) % 8; /* calculando o quanto já passou, não oq falta */
      resin.timer.minutes = Math.abs(resin.timer.minutes - 7);
      resin.timer.seconds = Math.floor((difference / 1000)) % 60;
      resin.timer.seconds = Math.abs(resin.timer.seconds - 60);
      resin.html.CDTimer.innerHTML = `${checkTime(resin.timer.minutes)}:${checkTime(resin.timer.seconds)}`;
   }
   if(resin.timer.id == 0) { 
      resin.timer.id = setInterval(timer.downward, 1000, resin.timer, resin.html.CDTimer, "loop");
   }
}
cdTimer();

function timeToFull() {
   let resinMili = (159 - parseInt(resin.quantity)) * 8 * 60; //2.400
   let timeMili = (parseInt(resin.timer.seconds) + parseInt(resin.timer.minutes*60)); //trocar esse
   let timeToFull = (resinMili + timeMili); //seconds to full
   let hoursToFull = checkTime(Math.floor(timeToFull / 60 / 60));
   let minutesToFull = checkTime(Math.floor((timeToFull / 60) % 60));
   let secondsToFull = checkTime(Math.floor(timeToFull % 60));
   resin.html.timeToFull.innerHTML = `Full in ${hoursToFull}:${minutesToFull}:${secondsToFull}`;
   return timeToFull; // deletar?
}
setInterval(timeToFull, 1000);

function dateWhenFull() {
   let dateWhenFull = new Date(new Date().getTime() + timeToFull()*1000);
   let dayFull = checkTime(dateWhenFull.getDate());
   let monthFull = checkTime(dateWhenFull.getMonth()+1);
   let hourFull = checkTime(dateWhenFull.getHours());
   let minuteFull = checkTime(dateWhenFull.getMinutes());
   let secondFull = checkTime(dateWhenFull.getSeconds());
   resin.html.dateWhenFull.innerHTML = `Full resin on: ${dayFull}/${monthFull} ${hourFull}:${minuteFull}:${secondFull}`;
}
dateWhenFull();

function spend(qtd) {
   // "20": () => {

   // },
   // "40": {

   // }
   // // resin - qtd
   // setstorage resin - 20
   // new date(getsyncedstorage)
   // setsyncedstorage + 9600000 (20)
   if (qtdResin >= qtd) {
      updateResinValue(-qtd);
   }
}