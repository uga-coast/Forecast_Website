// CalendarInput.js - exports Calendar component
// On Daily Forecast selection, renders Calendar component.
// Red days are days with DF data available. Click days - pop up will display for days with no DF data available. 
// DF data (Location + Water Elev)
// Forecast cycle dropdown will display after clicking a valid red day. 

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css";
import "../css/calendar.css";

const CalendarInput = () => {
    const [date, changeDate] = useState(new Date());
    const [mode, setMode] = useState(null);
    const [availableDates, setAvailableDates] = useState([]);
    const [isCalOpen, setIsCalOpen] = useState(true);

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
        console.log("Date clicked:", selectedDate);
        changeDate(selectedDate);

        if (mode === "Daily Forecast") {
            // Check if selected date has data
            const hasData = availableDates.some(availDate => {
                const d = new Date(availDate);
                return d.getFullYear() === selectedDate.getFullYear() &&
                    d.getMonth() === selectedDate.getMonth() &&
                    d.getDate() === selectedDate.getDate();
            }); // hasData 
            // Check if DF data available 
            if (hasData) {
                document.body.dispatchEvent(new CustomEvent('dateSelected', {detail: {date: selectedDate}}));
            } else {
                document.body.dispatchEvent(new CustomEvent('noDataPopup', {detail: {date: selectedDate}}));
            } // if 
        } // if 
    }; // handleDateChange

    // Handle DF dates
    useEffect(() => {
        const handleDailyForecastDates = (e) => {
            console.log("Daily Forecast dates received:", e.detail.dates);
            setAvailableDates(e.detail.dates);
        }; // handleDailyForecastDates

        document.body.addEventListener('dailyForecastDates', handleDailyForecastDates);
        return () => {
            document.body.removeEventListener('dailyForecastDates', handleDailyForecastDates);
        };
    }, []); // handleDailyForecastDates 
 
    // Only show calendar in Daily Forecast mode
    if (mode !== "Daily Forecast") {
        return null;
    } // if 


    return (
        <div style={{position: 'relative', zIndex: 10000, pointerEvents: 'auto'}} onClick={(e) => {e.stopPropagagation();}}>
            <button onClick={() => setIsCalOpen(!isCalOpen)}
                style={{
                    padding: '1% 2%',
                    margin: '1%',
                    background: '#d6d2c4', 
                    color: '#000000',
                    border: '1px solid #cccccc',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontFamily: 'Oswald, sans-serif',
                    fontSize: '1rem',
                    fontWeight: 'normal',
                    display: 'block',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => {e.target.style.background ='#c8d8eB';}}
                onMouseLeave={(e) => {e.target.style.background = '#d6d2c4';}}
                >
                {isCalOpen ? '▲ Hide Calendar' : '▼ Show Calendar'}
            </button>
            
            <div style={{
                maxHeight: isCalOpen ? '500px' : '0',
                opacity: isCalOpen ? 1 : 0,
                overflow: 'hidden',
                transition: 'max-height 0.5s ease, opacity 0.5s ease'
            }}>
                <Calendar 
                    onChange={handleDateChange} 
                    value={date}
                    prev2Label={null}
                    next2Label={null}
                    tileClassName={({date, view}) => {
                        if (view !== 'month') return null;
                        const hasData = availableDates.some(availDate => {
                            const d = new Date(availDate);
                            return d.getFullYear() === date.getFullYear() &&
                                d.getMonth() === date.getMonth() &&
                                d.getDate() === date.getDate();
                        });
                        return hasData ? 'has-forecast' : null;
                    }}
                />
            </div>
        </div>
    ); // return
}; // CalendarInput

export default CalendarInput; 