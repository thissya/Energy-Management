import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { supabase } from '../Database/db';
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

    return totalBill;
}

function PredictionChart() {
    const [data, setData] = useState([]);
    const [date, setDate] = useState([]);
    const [prediction, setPrediction] = useState([]);

    const [selectedOption, setSelectedOption] = useState('energy');
    const [PredictionDataTomorrow, setPredictionData] = useState(0);
    const [PredictionDatatAvgWeek, setPredcitonDataAvgWeek] = useState(0);

    useEffect(() => {
        let url = 'https://076rd6w8mg.execute-api.ap-south-1.amazonaws.com/';
        url += selectedOption === 'energy' ? 'predict_energy' : 'predict_solar';

        axios.post(url)
            .then(response => {
                console.log(response.data);
                setData(response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    }, [selectedOption]);

    const handleDropdownChange = (e) => {
        setSelectedOption(e.target.value);
    }

    var sum = 0;

    useEffect(() => {
        if (data && data.length > 0) {
            const date = data.map((item) => item.Date);
            const prediction = data.map((item) => item.Prediction);

            setDate(date);
            setPrediction(prediction);

            const sum = prediction.reduce((a, b) => a + b, 0);
            setPredictionData(sum);
            setPredcitonDataAvgWeek(calculateElectricityBill(sum));
        }
    }, [data]);



    console.log(date);
    console.log(prediction);

    const data_chart = {
        labels: date,
        datasets: [
            {
                label: selectedOption === 'energy' ? 'Energy Production(in kw/h)' : 'Solar Energy Production(in kw/h)',
                backgroundColor: selectedOption === 'energy' ? 'blue' : 'green',
                borderColor: selectedOption === 'energy' ? 'blue' : 'green',
                data: prediction,
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
                    text: 'Energy Usage(in kw/h)'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                    lineWidth: 1
                }
            }
        }
    };


    console.log(data);

    return (
        <>
            <div className='flex flex-col justify-items items-center'>
                <div className='grid grid-cols-3 gap-5 m-4 ml-10 mr-10 h-[20vh] w-[98%]'>
                    <div className='bg-tilebox h-full bg-white rounded-lg'>
                        <div className='flex flex-col justify-center'>
                            <div className='m-2 text-xs font-bold'>TOTAL ENERGY USAGE</div>
                            <span><div className='text-center m-2 text-4xl'>{PredictionDataTomorrow}</div>
                                <div className='text-center m-2 text-2xl'>KW/Hr</div></span>
                        </div>
                    </div>
                    <div className='bg-tilebox h-full bg-white rounded-lg'>
                        <div className='flex flex-col justify-center'>
                            <div className='m-2 text-xs font-bold'>TOTAL ENERGY COST</div>
                            <span className='flex flex-row justify-center items-ceter p-3'><div className='text-center m-2 text-4xl'>Rs.</div>
                                <div className='text-center m-2 text-4xl'>{parseInt(PredictionDatatAvgWeek)}</div></span>

                        </div>
                    </div>
                    <div className='bg-tilebox h-full bg-white rounded-lg'>
                        <div className='flex flex-col justify-center'>
                            <div className='m-2 text-xs font-bold'>ENERGY AVERAGE</div>
                            <span><div className='text-center m-2 text-4xl'>{parseInt(PredictionDataTomorrow / 12)}</div>
                                <div className='text-center m-2 text-2xl'>KW/Hr</div></span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-row'>
                <div className='bg-tilebox bg-white rounded-lg h-[55vh] ml-6 mr-4 w-[20vw] overflow-y-auto'>
                        <div className='bg-tilebox bg-white rounded-lg'>
                            <div className='flex flex-col justify-center '>
                                <table className='border border-1 overflow-y-auto rounded-lg'>
                                    <thead>
                                        <tr>
                                            <th className='px-4 py-2'>Date</th>
                                            <th className='px-4 py-2'>Prediction</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((item, index) => (
                                            <tr key={index}>
                                                <td className='border px-4 py-2'>{item.Date}</td>
                                                <td className='border px-4 py-2'>{item.Prediction}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                    </div>
                </div>
                <div className='bg-tilebox bg-white rounded-lg h-[55vh] w-[50vw]'>
                    <div className='flex flex-col justify-center'>
                        <select value={selectedOption}
                            onChange={handleDropdownChange}
                            className='m-2 w-32'>
                            <option value="energy">Electricity</option>
                            <option value="solar">Solar</option>
                        </select>
                        <Line data={data_chart} options={options} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default PredictionChart;