import React, { useEffect, useState, useRef } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import { format } from 'date-fns';
import { Chart, ArcElement, Tooltip, Legend, Filler } from 'chart.js';

// Register Chart.js components
Chart.register(ArcElement, Filler, Tooltip, Legend);

function HomePieChart() {
    // Set a specific default date
    const defaultDate = new Date('2024-04-26'); // Example default date

    const [data, setData] = useState(null);
    const [selectedDate, setSelectedDate] = useState(defaultDate);
    const [selectedTable, setSelectedTable] = useState('Electricity');

    const chartRef = useRef(null);

    const CustomInput = React.forwardRef(({ value, onClick, onChange }, ref) => (
        <div className="input-group flex items-center rounded-lg m-1 p-1">
            <input
                type="text"
                className="form-control w-[85px]"
                value={value}
                onClick={onClick}
                onChange={onChange} // Added onChange handler
                ref={ref}
            />
            <span className="input-group-text ml-2">
                <FontAwesomeIcon icon={faCalendarAlt} />
            </span>
        </div>
    ));

    const Table = {
        "Electricity": "http://localhost:3000/electricPie/",
        "Solar": "http://localhost:3000/solarPie/",
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const formattedDate = format(selectedDate, 'yyyy-MM-dd');
                const response = await axios.get(`${Table[selectedTable]}${formattedDate}`);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error.response?.data || error.message || error);
            }
        }
        fetchData();
    }, [selectedTable, selectedDate]);

    const data_chart = {
        labels: ['AUTO', 'Civil', 'East Campus', 'MBA', 'Mech'],
        datasets: [
            {
                data: data ? [data.auto, data.civil, data.eastCampus, data.mbaMca, data.mech] : [0, 0, 0, 0, 0],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',  // AUTO
                    'rgba(54, 162, 235, 0.2)',  // Civil
                    'rgba(255, 206, 86, 0.2)',  // East Campus
                    'rgba(75, 192, 192, 0.2)',  // MBA
                    'rgba(153, 102, 255, 0.2)'  // Mech
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',    // AUTO
                    'rgba(54, 162, 235, 1)',    // Civil
                    'rgba(255, 206, 86, 1)',    // East Campus
                    'rgba(75, 192, 192, 1)',    // MBA
                    'rgba(153, 102, 255, 1)'    // Mech
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className='h-[60vh] bg-white rounded-lg pl-3'>
            <div className='text-black font-bold bg-white mt-2'>ENERGY SPLITUP</div>
            <div className='flex flex-row'>
                <select
                    className='rounded border border-white font-bold text-sm'
                    value={selectedTable}
                    onChange={(e) => setSelectedTable(e.target.value)}>
                    <option value='Electricity'>ELECTRICITY</option>
                    <option value='Solar'>SOLAR</option>
                </select>

                <DatePicker
                    selected={selectedDate}
                    onChange={date => setSelectedDate(date)}
                    customInput={<CustomInput />}
                />
            </div>
            <div className='flex rounded-lg items-center justify-center ml-[100px]'>
                <div className='w-[55%] h-[55%] bg-white rounded-l'>
                    <Pie ref={chartRef} data={data_chart} />
                </div>
            </div>
        </div>
    );
}

export default HomePieChart;
