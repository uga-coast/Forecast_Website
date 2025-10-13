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
    const [selectedStorm, setStorm] = useState(null);
    const [hDates, setHDates] = useState([]);

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

    // Handle date change from user input for DF rendered
    const handleDateChange = (selectedDate) => {
        // Debug
        console.log("Date clicked:", selectedDate);

        changeDate(selectedDate);

        // Dispatch event if in DF mode only
        if (mode === "Daily Forecast") {
            document.body.dispatchEvent(new CustomEvent('dateSelected', {detail: {date: selectedDate}}));
        } // if
    }; // handleDateChange

    // Handle storm change from user input for tiff-2 selecting the storm in H mode
    useEffect(() => {
        const handleStormSelected = (e) => {
            console.log("Storm selected:", e.detail.storm);
            setStorm(e.detail.storm);
        }; // handleStormSelected

        document.body.addEventListener('stormSelected', handleStormSelected);
        return () => {
            document.body.removeEventListener('stormSelected', handleStormSelected);
        }; // return
    }, []); // useEffect

    // Listen to retrieve H advisory dates based on user selection of storm
    useEffect(() => {
        const handleHData = (e) => {
            console.log("Hurricane data received:", e.detail);
            setHDates(e.detail.dates);
        }; // handleHData

        document.body.addEventListener('hurricaneData', handleHData);
        return () => {
            document.body.removeEventListener('hurricaneData', handleHData);
        };
    }, []); // useEffect

    return (
        <div style={{zIndex: 9999, position: 'relative', background: 'white', padding: '10px'}}>
            <p>Current mode: {mode || "none"}</p>
            <p>Current date: {date.toString()}</p>
            <Calendar onChange={handleDateChange} value={date} style={{pointerEvents: 'auto'}}/>
        </div>
    ); // return

}; // CalendarInput

export default CalendarInput; 