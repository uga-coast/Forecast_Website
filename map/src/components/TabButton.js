/* Tab Button component for setting Hurricane or Daily Forecast view */
import '../css/tabbutton.css';

const TabButton = ({HorDF, setHorDF}) => {
    // On click, we
    const handleClick = (type) => {
        // Debug
        console.log("Tab clicked: ", type);

        // Update React state - will change to React state management later
        setHorDF(type);
        // Finding tiff-1 to keep cascading menu style working for now
        const tiff1 = document.getElementById("tiff-1");
        
        // CHecking if first dropdown element exists in DOM
        if (tiff1) {
        tiff1.value = type === 'hurricane' ? 'Hurricane' : 'forecast';
        // Trigger the change event so the DOM manipulation sees tab button function
        const changeEvent = new Event('change', { bubbles: true});
        tiff1.dispatchEvent(changeEvent);
        } else {
            return;
        } // if-else
    }; // handleClick
    
    return (
        <div className = "tab-container">
            <button className={HorDF === 'hurricane' ? 'tab active' : 'tab'}
                onClick={() => handleClick('hurricane')}
            >
                Hurricane
            </button>
            <button className={HorDF === 'daily' ? 'tab active' : 'tab'}
                onClick={() => handleClick('daily')}
            >
                Daily Forecast
            </button>
        </div>
    ); // return
} // TabButton

export default TabButton;