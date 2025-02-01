import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import axios from 'axios';
import TileBar from '../Home/Tile'; // Import the TileBar component
import { Chart, Title, ArcElement, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale, TimeScale } from 'chart.js';

Chart.register(Title, Tooltip, ArcElement, Legend, PointElement, LineElement, CategoryScale, LinearScale, TimeScale);

function PredictionChart() {
    const [data, setData] = useState([]);
    const [date, setDate] = useState([]);
    const [prediction, setPrediction] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [PredictionDataTomorrow, setPredictionData] = useState(0);
    const [PredictionDataAvgWeek, setPredictionDataAvgWeek] = useState(0);
    const [chartColor, setChartColor] = useState(['rgba(173, 216, 230, 0.2)', 'rgba(0, 0, 139, 0.6)']); // Default colors

    useEffect(() => {
        if (selectedOption) {
            const url = `http://localhost:3000/predictEnergy/${selectedOption}`;
            
            axios.get(url)
                .then(response => {
                    const forecastData = response.data;
                    console.log('Forecast Data:', forecastData);
                    setData(forecastData); 
                })
                .catch(error => {
                    console.error('Error Message:', error.message);
                    console.error('Error Details:', error.response?.data);
                    console.error('Error Status:', error.response?.status);
                });
        }
    }, [selectedOption]);

    useEffect(() => {
        if (data && data.length > 0) {
            const date = data.map((item) => item.date);
            const prediction = data.map((item) => item.forecast);

            setDate(date);
            setPrediction(prediction);

            const sum = prediction.reduce((a, b) => a + b, 0);
            setPredictionData(sum);
            setPredictionDataAvgWeek(calculateElectricityBill(sum)); 
        } else {
            // Reset chart data when no data is available
            setDate([]);
            setPrediction([]);
        }
    }, [data]);

    const handleDropdownChange = (event) => {
        setSelectedOption(event.target.value);
        if (event.target.value === 'electric') {
            setChartColor(['rgba(173, 216, 230, 0.2)', 'rgba(0, 0, 139, 0.6)']); // Light blue fill and dark blue border
        } else {
            setChartColor(['rgba(144, 238, 144, 0.2)', 'rgba(0, 128, 0, 0.6)']); // Light green fill and dark green border
        }
    };

    const data_chart = {
        labels: date,
        datasets: [
            {
                label: selectedOption === 'electric' ? 'Energy Production (in kW/h)' : 'Solar Energy Production (in kW/h)',
                backgroundColor: chartColor[0], // Lighter fill color
                borderColor: chartColor[1], // Darker border color
                borderWidth: 2, // Set border width to make it visible
                data: prediction,
                fill: true,
                tension: 0.1,
            },
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return `${tooltipItem.dataset.label}: ${tooltipItem.raw} kW/h`;
                    }
                }
            }
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                    displayFormats: {
                        day: 'dd/MM/yyyy'
                    },
                },
                title: {
                    display: true,
                    text: 'Date'
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0)',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Energy Usage (in kW/h)'
                },
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                }
            }
        }
    };

    const calculateElectricityBill = (total) => {
        // Implement your billing calculation logic here
        return total * 0.15; // Example calculation
    };

    return (
        <>
            <TileBar /> {/* Add the TileBar component here */}
            <div className='flex flex-row'>
                <div className='bg-tilebox bg-white rounded-lg h-[62vh] ml-6 mr-4 mt-4 w-[20vw]'>
                    <div className='bg-tilebox bg-white rounded-lg h-full overflow-y-auto'>
                        <div className='flex flex-col justify-center'>
                            <table className='border border-1 rounded-lg w-full'>
                                <thead>
                                    <tr>
                                        <th className='px-4 py-2'>Date</th>
                                        <th className='px-4 py-2'>Prediction</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.length > 0 ? (
                                        data.map((item, index) => (
                                            <tr key={index}>
                                                <td className='border px-4 py-2'>{item.date}</td>
                                                <td className='border px-4 py-2'>{item.forecast}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="2" className='border px-4 py-2 text-center'>No Data Available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className='bg-tilebox bg-white rounded-lg h-[58vh] w-[50vw] mt-4'>
                    <div className='flex flex-col justify-center'>
                        <select value={selectedOption}
                            onChange={handleDropdownChange}
                            className='m-2 w-32'>
                            <option value="">Select an option</option>
                            <option value="electric">Electricity</option>
                            <option value="solar">Solar</option>
                        </select>
                        {selectedOption && <Line data={data_chart} options={options} />}
                    </div>
                </div>
            </div>
        </>
    );
}

export default PredictionChart;
