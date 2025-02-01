import React, { useState, useEffect } from 'react';
import 'react-multi-carousel/lib/styles.css';
import '../App.css';
import axios from 'axios'; 

function calculateElectricityBill(unitsConsumed) {
    let totalBill = 0;

    if (unitsConsumed <= 100) {
        totalBill = unitsConsumed * 5.50;
    } else if (unitsConsumed <= 500) {
        totalBill = (100 * 5.50) + ((unitsConsumed - 100) * 6.70);
    } else {
        totalBill = (100 * 5.50) + (400 * 6.70) + ((unitsConsumed - 500) * 7.10);
    }

    return parseFloat(totalBill.toFixed(2));;
}

function TileBar() {
    const [dataFetched, setDataFetched] = useState([]);
    const [energyUnit, setEnergyUnit] = useState(0);
    const [energyUnitAvg, setEnergyUnitAvg] = useState(0);
    const [solarProduction, setSolarProduction] = useState(0);
    const [dateInput, setDateInput] = useState('2024-04-26'); // Default date or user input

    const fetchData = async (date) => {
        try {
            const response = await axios.get(`http://localhost:3000/energyData/${date}`, {
                // No need to pass 'params' if you already use date in the URL directly
            });
            if (response.data) {
                setDataFetched(response.data);
                setEnergyUnit(response.data.totalEnergyConsumed);
                setEnergyUnitAvg(response.data.averageEnergyConsumed);
                setSolarProduction(response.data.totalSolar);
            }
        } catch (error) {
            console.error('Error fetching energy data:', error);
        }
    };

    useEffect(() => {
        fetchData(dateInput); // Fetch data on first render with default date
    }, [dateInput]);

    const handleDateChange = (e) => {
        setDateInput(e.target.value); // Update date input
    };

    const handleFetch = () => {
        fetchData(dateInput); // Fetch data for the entered date
    };

    return (
        <>
            <div className='flex flex-col justify-items items-center'>
                {/* Date input and Fetch button */}
                <div className="m-4">
                    <input 
                        type="date" 
                        value={dateInput} 
                        onChange={handleDateChange} 
                        className="p-2 border rounded-lg"
                    />
                    
                </div>

                {/* Tile grid for displaying data */}
                <div className='grid grid-cols-4 gap-5 m-1 ml-10 mr-10 h-[20vh] w-[98%]'>
                    <div className='bg-tilebox h-full bg-white rounded-lg'>
                        <div className='flex flex-col justify-center'>
                            <div className='m-2 text-xs font-bold '>TOTAL ENERGY COST</div>
                            <span>
                                <div className='text-center m-2 text-4xl mt-10'>
                                    Rs. {calculateElectricityBill(energyUnit)}
                                </div>
                            </span>
                        </div>
                    </div>
                    <div className='bg-tilebox h-full bg-white rounded-lg'>
                        <div className='flex flex-col justify-center'>
                            <div className='m-2 text-xs font-bold'>TOTAL ENERGY UNIT PER DAY</div>
                            <span>
                                <div className='text-center mt-10 text-4xl'>{energyUnit}</div>
                                <div className='text-center m-2 text-2xl'>KW/Hr</div>
                            </span>
                        </div>
                    </div>
                    <div className='bg-tilebox h-full bg-white rounded-lg'>
                        <div className='flex flex-col justify-center'>
                            <div className='m-2 text-xs font-bold'>AVERAGE ENERGY USAGE</div>
                            <span>
                                <div className='text-center mt-10 text-4xl'>{energyUnitAvg}</div>
                                <div className='text-center m-2 text-2xl'>KW/Hr</div>
                            </span>
                        </div>
                    </div>
                    <div className='bg-tilebox h-full bg-white rounded-lg'>
                        <div className='flex flex-col justify-center'>
                            <div className='m-2 text-xs font-bold'>TOTAL SOLAR PRODUCTION</div>
                            <span>
                                <div className='text-center mt-10 text-4xl'>{solarProduction}</div>
                                <div className='text-center m-2 text-2xl'>KW/Hr</div>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TileBar;
