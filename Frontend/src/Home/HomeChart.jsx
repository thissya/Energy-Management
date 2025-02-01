import { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import axios from 'axios';
import { Chart, Title, ArcElement, Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale, TimeScale } from 'chart.js';

Chart.register(Title, Tooltip, ArcElement, Legend, PointElement, LineElement, CategoryScale, LinearScale, TimeScale);


function HomeChart() {
  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [energyCost, setEnergyCost] = useState([]);

  const [selectedInterval, setSelectedInterval] = useState('Past Week');
  const [selectedTable, setSelectedTable] = useState('Electricity');
  const [chartColor, setChartColor] = useState(['green', 'green']);

  useEffect(() => {
    if (selectedTable === "Electricity") {
      setChartColor(["rgba(230, 230, 250, 0.4)", "#6C4DD5"]);

    } else {
      setChartColor(["rgba(173, 216, 230, 0.2)", "#89CFF0"]);
    }
  }, [selectedTable]);

  const chartRef = useRef(null);

  const TimeInterval = {
    "Past Week": 7,
    "Past Month": 30,
    "Past 3 Months": 90,
  };

  const Table = {
    "Electricity": "electric",
    "Solar": "solar",
  };

  useEffect(() => {
    async function fetchData() {
      const days = TimeInterval[selectedInterval];
      try {
        const response = await axios.get(`http://localhost:3000/graph/${Table[selectedTable]}/${days}`);
  
        console.log(response.data); // Debugging line
  
        if (Array.isArray(response.data)) {
          const parsedData = response.data.map(item => ({
            ...item,
            Date: new Date(item.date),
          }));
          setData(parsedData);
  
          // Update chart data
          if (chartRef.current) {
            chartRef.current.data.labels = parsedData.map(item => item.Date);
            chartRef.current.data.datasets[0].data = parsedData.map(item => item.total);
            chartRef.current.update();
          }
        } else {
          console.error('Expected an array but got:', response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, [selectedTable, selectedInterval]);
  

  useEffect(() => {
    if (data.length > 0) {
      const labels = data.map(item => item.Date);
      const energyCost = data.map(item => item.total);

      setLabels(labels);
      setEnergyCost(energyCost);
    }
  }, [data]);

  const data_chart = {
    labels: labels,
    datasets: [
      {
        label: 'Energy Usage (in kW/h)',
        data: energyCost,
        fill: true,
        backgroundColor: chartColor[0],
        borderColor: chartColor[1],
        tension: 0.1,
      },
    ]
  };

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          displayFormats: {
            day: 'dd/MM/yyyy',
          },
        },
        title: {
          display: true,
          text: 'Time',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Energy Usage (in kW/h)',
        },
      },
    },
  };

  return (
    <div className='h-full w-full font-bold'>
      <div className='text-md pl-2 pt-2'>ENERGY USAGE</div>
      <div className='text-sm'>
        <div className='m-2 flex flex-row'>
          <select
            className='rounded border border-white bg-colombia px-2'
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
          >
            <option value='Electricity'>ELECTRICITY</option>
            <option value='Solar'>SOLAR</option>
          </select>
          <select
            className='rounded border border-white'
            value={selectedInterval}
            onChange={(e) => setSelectedInterval(e.target.value)}
          >
            <option value='Past Week'>Past Week</option>
            <option value='Past Month'>Past Month</option>
            <option value='Past 3 Months'>Past 3 Months</option>
          </select>
        </div>
      </div>
      <Line data={data_chart} options={options} />
    </div>
  );
}

export default HomeChart;
