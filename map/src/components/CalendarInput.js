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
import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css";

const CalendarInput = () => {
    const [date, changeDate] = useState(new Date());
    const [mode, setMode] = useState(null);

    // Handle mode changes from user based on H or DF selection
    useEffect(() => {
        const handleModeChange = (e) => {
            // Check
            console.log("Mode changed to: ", e.detail.mode);

            setMode(e.detail.mode);
        }; // handleModeChange

        document.body.addEventListener('modeChange', handleModeChange);

        return () => {
            document.body.removeEventListener('modeChange', handleModeChange);
        }; // return
    }, []); // useEffect

    return (
        <div className="basic">
            <Calendar onChange={changeDate} showWeekNumbers value={date} />
        </div>
    ); // return

}; // CalendarInput

export default CalendarInput; 