import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import axios from 'axios'; 

function SolarChart() {
    const [data, setData] = useState([]);
    const [labels, setLabels] = useState([]);
    const [energyCost, setEnergyCost] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const today = '2024-04-26';
                const sevenDaysAgo = '2024-04-19';

                // Replace the supabase query with an axios call to your Node.js backend
                const response = await axios.get('/api/solar/energy', {
                    params: {
                        startDate: sevenDaysAgo,
                        endDate: today
                    }
                });

                const totalenergy = response.data;

                if (totalenergy) {
                    const parsedData = totalenergy.map(item => ({
                        ...item,
                        Date: new Date(item.Date),
                    }));
                    setData(parsedData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        if (data && data.length > 0) {
            const labels = data.map((item) => item.Date);
            const energyCost = data.map((item) => item.Total);

            setLabels(labels);
            setEnergyCost(energyCost);
        }
    }, [data]);

    const data_chart = {
        labels: labels,
        datasets: [
            {
                label: 'Solar Energy Production (in kW/h)',
                backgroundColor: 'green',
                borderColor: 'green',
                data: energyCost,
            },
        ]
    };

    const options = {
        showLines: true,
        scales: {
            x: {
                type: 'time',
                time: {
                    parser: 'yyyy-MM-dd',
                    unit: 'day',
                    displayFormats: {
                        day: 'dd/MM/yyyy'
                    },
                },
                title: {
                    display: true,
                    text: 'Time'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Energy Usage (in kW/h)'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                    lineWidth: 1
                }
            }
        }
    };

    return (
        <div className='h-full w-full font-bold font-roboto'>
            <Line data={data_chart} options={options} />
        </div>
    );
}

export default SolarChart;
