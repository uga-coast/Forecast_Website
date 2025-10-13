// Calendar.js - exports Calendar component

// Automatically render the Daily Forecast (Location + Water Elev)
// Display Calendar -> Hurricane Popup will show ?


// Bilskie: 
// 1) Daily Forecast as the default. 
// 2) If user chooses DAILY -> Calendar renders. 
// 3) 

// OLD: Hurricane vs. Daily Forecast
// H:
// Select storm: Ian, Debby, Idalia
// Select advisory #
// Select track type. 

// DF:
// Select month.
// Select date. 
// Select time (00, 06, 12, 18)
import { useState } from 'react';
import Calendar from 'react-calendar';

const CalendarInput = () => {
    const [date, changeDate] = useState(new Date());

    return (
        <div className="basic">
            <Calendar onChange={changeDate} showWeekNumbers value={date} />
        </div>
    ); // return

}; // CalendarInput

export default CalendarInput; 