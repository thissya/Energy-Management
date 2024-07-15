import React, { useEffect, useState, useRef } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { registerLocale } from "react-datepicker";
import enGB from 'date-fns/locale/en-GB';
import { Pie } from 'react-chartjs-2';
import { supabase } from '../Database/db';
import { format } from 'date-fns';

function HomePieChart() {
    const [data, setData] = useState([]);
    const [labels, setLabels] = useState([]);
    const [AUTOenergyCost, AUTOsetEnergyCost] = useState([]);
    const [CivilenergyCost, CivilsetEnergyCost] = useState([]);
    const [EastCampusenergyCost, EastCampussetEnergyCost] = useState([]);
    const [MBAenergyCost, MBAsetEnergyCost] = useState([]);
    const [MechenergyCost, MechsetEnergyCost] = useState([]);

    const [selectedDate, setSelectedDate] = useState('2024-04-26');
    const [selectedTable, setSelectedTable] = useState('Electricity');

    const chartRef = useRef(null);

    const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
        <div className="input-group flex items-center rounded-lg m-1 p-1">
            <input type="text" className="form-control w-[85px]" value={value} onClick={onClick} ref={ref} />
            <span className="input-group-text ml-2">
                <FontAwesomeIcon icon={faCalendarAlt} />
            </span>
        </div>
    ));

    const Table = {
        "Electricity": "totalenergycost",
        "Solar": "totalsolarcost",
    }

    useEffect(() => {
        async function fetchData() {
            let formattedDate = selectedDate;

            const { data: totalenergy, error } = await supabase
                .from(Table[selectedTable])
                .select('*')
                .eq('Date', formattedDate);

            if (chartRef.current) {
                chartRef.current.data.labels = labels;
                chartRef.current.data.datasets[0].data = data;
                chartRef.current.update();
            }

            if (error) {
                console.error('Error fetching data:', error);
            } else if (totalenergy) {
                const parsedData = totalenergy.map(item => ({
                    ...item,
                    Date: new Date(item.Date),
                }));
                setData(parsedData);
            }
        }
        fetchData();
    }, [selectedTable, selectedDate]);

    useEffect(() => {
        if (data && data.length > 0) {
            const labels = data.map((item) => item.Date);

            const AUTOenergyCost = data.map((item) => item.Auto);
            const CivilenergyCost = data.map((item) => item.Civil);
            const EastCampusenergyCost = data.map((item) => item.East_Campus);
            const MBAenergyCost = data.map((item) => item['MBA_MCA']);
            const MechenergyCost = data.map((item) => item.Mech);

            setLabels(labels);

            AUTOsetEnergyCost(AUTOenergyCost);
            CivilsetEnergyCost(CivilenergyCost);
            EastCampussetEnergyCost(EastCampusenergyCost);
            MBAsetEnergyCost(MBAenergyCost);
            MechsetEnergyCost(MechenergyCost);

        }
    }, [data]);

    console.log()

    const data_chart = {
        labels: ['AUTO', 'Civil', 'East Campus', 'MBA', 'Mech'],
        datasets: [
            {
                data: [AUTOenergyCost, CivilenergyCost, EastCampusenergyCost, MBAenergyCost, MechenergyCost],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
            },
        ],
    };

    return (
        <>
            <div className='h-[60vh] bg-white rounded-lg pl-3'>
                <div className='text-black font-bold bg-white mt-2'>ENERGY SPLITUP</div>
                <div className='flex flex-row'>
                    <select
                        className='rounded border border-white font-bold text-sm '
                        value={selectedTable}
                        onChange={(e) => setSelectedTable(e.target.value)}>
                        <option value='Electricity'>ELECTRICITY</option>
                        <option value='Solar'>SOLAR</option>
                    </select>

                    <DatePicker
                        selected={selectedDate}
                        onChange={date => setSelectedDate(format(date, 'yyyy-MM-dd'))}
                        customInput={<CustomInput />}
                    />
                </div>
                <div className='flex rounded-lg items-center justify-center ml-[100px]'>
                    <div className='w-[55%] h-[55%] bg-white rounded-l'>
                        <Pie ref={chartRef}
                            data={data_chart} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomePieChart;   
