/* Tab Button component for setting Hurricane or Daily Forecast view */
import '../css/tabbutton.css';

const TabButton = ({HorDF, setHorDF}) => {
    return (
        <div className = "tab-container">
            <button className={HorDF === 'hurricane' ? 'tab active' : 'tab'}
                onClick={(e) => setHorDF('hurricane')}
            >
                Hurricane
            </button>
            <button className={HorDF === 'daily' ? 'tab active' : 'tab'}
                onClick={(e) => setHorDF('daily')}
            >
                Daily Forecast
            </button>
        </div>
    ); // return
} // TabButton

export default TabButton;