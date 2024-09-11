import {getActiveTransactions} from '../models/sql_functions.js';
import 'datejs';


function getAllTransaction(surname, pin) {
  return new Promise((resolve, reject) => {
    getActiveTransactions(surname, pin, (err, results) => {
      if (err) {
        console.error("Failed to execute query:", err);
        return reject(err);  // Propagate the error
      }
      resolve(results);  // Return the results
    });
  });
}


function getProposedHoldTime(rate_type,proposed_time){
  if(rate_type === "Daily"){
    
    return proposed_time;
  }else{
   
    return proposed_time = proposed_time / 60;
  }

}

function convertEpocToDate(epochTimestamp){

// Convert epoch to milliseconds
//const milliseconds = epochTimestamp * 1000;

// Create a Date object from milliseconds
const date = new Date(parseInt(epochTimestamp,10));

// Format the date using datejs (if needed)
const formattedDate = date.toString("dd-MM-yyyy hh:mm tt");


return formattedDate;
  
}

function calculateFutureTime(epochTimestamp, minutes) {
  // Convert epoch timestamp from seconds to milliseconds
  const startDate = new Date(parseInt(epochTimestamp));
  
  // Convert minutes to milliseconds
  const millisecondsToAdd = minutes * 60 * 1000;
  
  // Calculate future time
  const futureDate = new Date(startDate.getTime() + millisecondsToAdd);
  
  // Format the date
  const day = String(futureDate.getDate()).padStart(2, '0');
  const month = String(futureDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = futureDate.getFullYear();
  
  // Format the time
  let hours = futureDate.getHours();
  const minutesFormatted = String(futureDate.getMinutes()).padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert to 12-hour format
  
  // Construct the formatted string
  const formattedDate = `${day}-${month}-${year} ${String(hours).padStart(2, '0')}:${minutesFormatted} ${period}`;
  
  return formattedDate;
}

function getElapsedTime(epochTimeStamp,rate_type){

  if(rate_type === "Daily"){
    return getElapsedTimeDays(epochTimeStamp).toFixed(2);
  }else{
    return getElapsedTimeHour(epochTimeStamp).toFixed(2);
  }

}


function getElapsedTimeDays(epochTimeStamp){
  const currentTime = Date.now(); // Get current time in milliseconds
    const timeDifference = currentTime - epochTimeStamp; // Difference in milliseconds
    const millisecondsInADay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
    
    // Calculate the number of days (including decimals)
    const daysElapsed = timeDifference / millisecondsInADay;

    return daysElapsed;
}

function getElapsedTimeHour(epochTimeStamp){
  const currentTime = Date.now(); // Get the current time in milliseconds
    const timeDifference = currentTime - epochTimeStamp; // Difference in milliseconds
    const millisecondsInAnHour = 60 * 60 * 1000; // Number of milliseconds in an hour
    
    // Calculate the number of hours (including decimals)
    const hoursElapsed = timeDifference / millisecondsInAnHour;

    return hoursElapsed;
}

export{getAllTransaction,getProposedHoldTime,convertEpocToDate,calculateFutureTime,getElapsedTime}


