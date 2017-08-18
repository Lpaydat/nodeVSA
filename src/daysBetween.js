/* 
  Calculate distance between two dates

  Input format: "YYYY-MM-DD"
    2016-06-14
    2017-08-17
  
  Usually correct, occasionally 1 day off when compared to 
    https://www.timeanddate.com/date/durationresult.html
  Suits my purposes well, but just be aware.
*/

function daysBetween (startDate, endDate) {
  startDate = startDate.split("-"); // [2016,06,14]
  let start = {
    year : parseInt(startDate[0]), // 2016
    month : parseInt(startDate[1]), // 6
    days : parseInt(startDate[2]) //14
  };

  endDate = endDate.split("-"); // [2017,08,17]
  let end = {
    year : parseInt(endDate[0]), // 2017
    month : parseInt(endDate[1]), // 8
    days : parseInt(endDate[2]) //17
  };

  let daysInMonth = [null, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  // ^ Index matches number of month.
  
  let startTotal = 0, endTotal = 0;

  // Calculate days in completed years since 01-01-2000.
  startTotal += ((start.year-1) * 365);
  endTotal += ((end.year-1) * 365);

  // Add days in completed months
  for (let i = 1; i < start.month; i++) {
    startTotal += daysInMonth[i];
  }
  for (let j = 1; j < end.month; j++) {
    endTotal += daysInMonth[j];
  }

  // Add days so far in the current month.
  startTotal += start.days;
  endTotal += end.days;

  // Calculate and add days for completed leap years since 2000.
  startTotal += Math.ceil( (start.year - 1 - 2000)/4 );
  endTotal += Math.ceil( (end.year - 1 - 2000)/4 );

  // Add in a day if current year is a leap year and we've already done February.
  if ((start.year-2000) % 4 === 0 && start.month > 2) {
    startTotal += 1;
  }
  if ((end.year-2000) % 4 === 0 && end.month > 2) {
    endTotal += 1;
  }

  // Add 2 days to make start and end dates inclusive.
  return endTotal - startTotal + 2;
}
