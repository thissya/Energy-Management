import { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-date-fns';
import { supabase } from '../Database/db';

function HomeChart() {
  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [energyCost, setEnergyCost] = useState([]);

  const [selectedInterval, setSelectedInterval] = useState('Past Week');
  const [selectedTable, setSelectedTable] = useState('Electricity');
  const [chart_color, set_chart_color] = useState(['green','green']);
  
  useEffect(() => {
    if (selectedTable === "Electricity") {
      set_chart_color(["rgba(230, 230, 250, 0.2)", "#5D3FD3"]);
    } else {
      set_chart_color(["rgba(173, 216, 230, 0.2)","#89CFF0"]);
    }
  }, [selectedTable]);
  
  const chartRef = useRef(null); 

  const TimeInterval = {
    "Past Week": "2024-04-19",
    "Past 3 Months": "2024-01-26",
    "Past Month": "2024-03-26",
  };

  const Table = {
    "Electricity": "totalenergycost",
    "Solar": "totalsolarcost",
  }

  useEffect(() => {
    async function fetchData() {
      const today = '2024-04-26';

      const { data: totalenergy, error } = await supabase
        .from(Table[selectedTable])
        .select('Date, Total')
        .gte('Date', TimeInterval[selectedInterval])
        .lte('Date', today);
      console.log(totalenergy);
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
}, [selectedTable, selectedInterval]);

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
      label: 'Energy Usage(in kw/h)',
      data: energyCost,
      fill: true,
      backgroundColor: chart_color[0],
      borderColor: chart_color[1],
      tension: 0.1
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
        color: 'rgba(0, 0, 0, 0)', 
      },
    },
    y: {
      title: {
        display: true,
        text: 'Energy Usage(in kw/h)'
      },
    }
  }
};

return (
  <>
    <div className='h-full w-full font-bold'>
      <div className='text-md pl-2 pt-2'>ENERGY USAGE</div>
      <div className='text-sm'>
        <div className='m-2 flex flex-row'>
          <select
            className='rounded border border-white bg-colombia px-2'
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}>
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
      <Line ref={chartRef} data={data_chart} options={options} />
    </div>
  </>
);
}

export default HomeChart;
