import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { supabase } from '../Database/db';

function SolarChart() {
    const [data, setData] = useState([]);
    const [labels, setLabels] = useState([]);
    const [energyCost, setEnergyCost] = useState([]);
    const  
    useEffect(() => {
      async function fetchData() {
        const today = '2024-04-26';
        const sevenDaysAgo = '2024-04-19';
    
        const { data: totalenergy, error } = await supabase
          .from('totalenergycost')
          .select('Date, Total')
          .gte('Date', sevenDaysAgo)
          .lte('Date', today);
    
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
    }, []);
    
    console.log(data);
  
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
          label: 'Solar Energy Production(in kw/h)',
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
            text: 'Energy Usage(in kw/h)'
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
