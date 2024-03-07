// NOTE: I deleted the wrapping function that was provided in the starter code. My instructors have suggested putting my script.js file at 
//        the end of the body as the method of ensuring that the rest of the page loads before my code is executed.

// Declare global variables here:
var currentDay = $('#currentDay')
var currentHourAbs = dayjs().format('HH')
var timeBlocks = $('.time-block')
var hourOfBlock = $('.time-block > .hour')
var saveBtn = timeBlocks.children('.btn')
var clearBtn = $('#clearbtn')
var inputFields = $('.description')
var notification = $('#notification')
var nContainer = $('#n-container')

// Create a function to remove notification that will be displayed when a save or clear button is clicked
// After 5 seconds, changes display of notification container from "flex" to "none"
function quickDisplay() {
  // Display a notification container at top of page
  nContainer.removeClass("d-none")
  nContainer.addClass("d-flex")
  // Hide notification container after 5 seconds
  setTimeout(function () {
    nContainer.removeClass("d-flex")
    nContainer.addClass("d-none")
  }, 5000)
}

// Create function to grab the current day, and set it to the text content of the <p> in my header, with id = "currentDay"
// Using day.js, sets current day in the format like "Tuesday, March 05, 2024"
function setCurrentDay() {
  currentDay.text(dayjs().format('dddd, MMMM DD, YYYY'))
}

// Objective: find a way to create a correspondence between the time-value of a certain time-block and a certain element within that time block
// Solution used: Take the '8AM' format header for the block, convert that to 24-hour time format using day.js.
//                Create an array that pairs that time with the time-block container based on its 'hour-8' id
// Intended use: Time-value of a given time-block can be compared with current time. A new class-value can be added to the time-block
//                based on its time-value's relationship to current time

// Asked Xpert Learning Assistant about this one. Learned about .map() and .get()
// The variable below will store an array of key-value pairs.
// First, the hourOfBlock.map method will iterate over all elements included in hourOfBlock, via the .map() method
// hourOfBlock would include all of the <div> elements that provide a time (e.g. "9AM") for each time block
// The variable hourIdMatch will hold a key-value pair for each element included.
// The first key, 'hour', will be paired with the value of the text included in the time <div> (using .text())
// The second key, 'id', will be paired with the value of the unique id (e.g. "hour-10") of its parent element, 
//  (using .parent() to select parent, and .attr() to select the id attribute)
// Finally, .get() will convert the list of objects created by the .map() method into an array of key-value pairs.

// Reference for day.js info: https://day.js.org/docs/en/parse/string-format
// Reference, on using CustomParseFormat plugin of day.js: https://day.js.org/docs/en/plugin/custom-parse-format

// Information about using CDN as a way of accessing day.js plugins was provided by Xpert Learning Assistant
// This customParseFormat plugin is necessary to allow me to convert the 'hA' (9AM) format of the HTML text
//    into the 'HH' 24-hour time pure number format of my currentHourAbs variable.
var hourOfBlockArray = hourOfBlock.map(function () {
  var hourText = $(this).text()
  var hourConvert = dayjs(hourText, 'hA').format('HH')
  var hourIdMatch = {
    hour: hourConvert,
    id: $(this).parent().attr('id')
  }
  return hourIdMatch
}).get()

// The following for-loop will iterate through the array of key-value pairs
// For each item of the array: 
for (var i = 0; i < hourOfBlockArray.length; i++) {
  // If the hour value that corresponds to a certain time block is equivalent to the current time, the class
  //    'present' will be added to that time blocks outer container <div> element, thus turning that block red on the page
  if (hourOfBlockArray[i].hour === currentHourAbs) {
    var id = "#" + hourOfBlockArray[i].id
    $(id).addClass('present')
    // If the hour value that corresponds to a certain time block is less than the current time, the class
    //    'past' will be added to that time blocks outer container <div> element, thus turning that block gray on the page
  } else if (hourOfBlockArray[i].hour < currentHourAbs) {
    var id = "#" + hourOfBlockArray[i].id
    $(id).addClass('past')
    // If the hour value that corresponds to a certain time block is greater than the current time, the class
    //    'present' will be added to that time blocks outer container <div> element, thus turning that block green on the page
  } else if (hourOfBlockArray[i].hour > currentHourAbs) {
    var id = "#" + hourOfBlockArray[i].id
    $(id).addClass('future')
  }
}

// Function for what happens when save button is clicked
saveBtn.click(function () {
  // Sets value of 'clicked' to the save button element that is clicked (similar to event.target)
  var clicked = $(this)
  // Sets value of 'userInput' to the value that is contained in the <textarea> element, selected using the jQuery syntax below.
  var userInput = clicked.parent().children('.description').val()
  // Sets value of 'blockId' to the id value of the time-block in question, selected using the jQuery syntax below.
  var blockId = clicked.parent().attr('id')
  // creates object 'idInput', containing two key value pairs: idInput.id will give the 'blockId', idInput.input will give 'userInput'
  var idInput = {
    id: blockId,
    input: userInput
  }
  // this function will store the user input in local storage
  function storeItem() {
    // The key name for the item stored in local storage will be equivalent to the id of the time-block in question;
    // the value that is stored inside that key will be whatever was input by the user, converted from JS-object to JSON format.
    return localStorage.setItem(idInput.id, JSON.stringify(idInput.input))
  }
  // Item is stored
  storeItem()
  // Time-block content is updated
  updateTBlocks()
  // Show notification for 5-seconds
  quickDisplay()
  // Set text color of notification
  if (notification.attr("class", "text-warning")) {
    notification.removeClass("text-warning")
    notification.addClass("text-white")
  } else {
    notification.addClass("text-white")
  }
  // Set text content to display
  notification.text("Appointment saved in local storage \u2713")
})

// This function will pull the inputs stored in local storage and display them in their appropriate places on the page 
function updateTBlocks() {
  // This for-loop will iterate over the array of hour-values. 
  // Each index corresponds to a different time-block and can input the text to the corresponding time-block <textarea>
  for (var i = 0; i < hourOfBlockArray.length; i++) {
    // 'next' will be stored like '#hour-8'
    var next = "#" + hourOfBlockArray[i].id
    // 'loadInto' will be equal to correct time-block that corresponds to whichever index the for-loop is currently on
    var loadInto = $(next).children('.description')
    // 'toLoad' will contain the data stored in the local storage item that corresponds to the currently selected element's id
    var toLoad = function pullItem() {
      // Pulls the chosen item from local storage and converts from JSON to JS-object format.
      return JSON.parse(localStorage.getItem(hourOfBlockArray[i].id))
    }
    // Sets the text content of the element currently selected to the data that matches that element's id, from local storage
    loadInto.text(toLoad)
  }
}

// EXTRA: Add functionality to a "Clear All" button that will clear all entries from page, and wipe out entries in localStorage
function clearAll() {
  // Clear text from <textarea> elements
  inputFields.val('')
  // Creates a loop: iterates thru the hourOfBlockArray object;
  //    'block' stands in for each iteration thru array;  
  hourOfBlockArray.forEach(function (block) {
    // On each iteration: 
    // selects key in local storage with same name as the hourOfBlockArray.id of current iteration (i.e. 'hour-9' for hourOfBlockArray[0].id)
    // sets value of selected key to '', or empty
    localStorage.setItem(block.id, JSON.stringify(''))
  })
  // Display a notification of "All appointments cleared from localStorage" at top of page
  nContainer.removeClass("d-none")
  nContainer.addClass("d-flex")
  // Set text color of notification
  if (notification.attr("class", "text-white")) {
    notification.removeClass("text-white")
    notification.addClass("text-warning")
  } else {
    notification.addClass("text-warning")
  }
  // Call function to display notification for 5 seconds
  quickDisplay()
  // Set text content to display
  notification.text("All appointments cleared from localStorage \u2713")
  
}

// Attach an event listener to the "Clear All" button; pass the clearAll() function
clearBtn.click(clearAll)
// At load, set the current date; update the time-block content
setCurrentDay()
updateTBlocks()
