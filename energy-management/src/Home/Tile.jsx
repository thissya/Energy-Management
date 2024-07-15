import React, { useState, useEffect } from 'react';
import 'react-multi-carousel/lib/styles.css';
import '../App.css';
import { supabase } from '../Database/db';

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

function TileBar() {
    const [data_fetched, setData_fetched] = useState([]);
    const [EnergyUnit, setEnergyUnit] = useState(0);
    const [EnergyUnitAvg, setEnergyUnitAvg] = useState(0);
    const [solarProduction, setSolarProduction] = useState(0);

    useEffect(() => {
        async function fetchTotal() {
            const today = '2024-04-26';
            const { data: totalenergy, error } = await supabase
                .from('totalenergycost')
                .select('*')
                .eq('Date', today);

            if (error) {
                console.error('Error fetching data:', error);
            } else if (totalenergy) {
                const parsedData = totalenergy.map(item => ({
                    ...item,
                    Date: new Date(item.Date),
                }));
                setData_fetched(parsedData);
            }
        }

        async function fetchAvg() {
            const { data: averageTotal, error } = await supabase
                .from('totalenergycost')
                .select('Total.avg()');
            
            if (error) {
              console.error('Error fetching data:', error);
            } else if (averageTotal) {
                setEnergyUnitAvg(parseInt(averageTotal[0].avg));
            }
          }

        async function fetchSolar() {
            const today = '4/26/2024';
            const { data: solar, error } = await supabase
                .from('totalsolarcost')
                .select('Total')
                .eq('Date', today);
            if(error) {
                console.error('Error fetching data:', error);
            }
            else if(solar) {
                setSolarProduction(solar[0].Total);
            }
        }
        fetchSolar();
        fetchTotal();
        fetchAvg();
    }, []);

    useEffect(() => {
        if (data_fetched && data_fetched.length > 0) {
            setEnergyUnit(data_fetched[0].Total);
        }
    }, [data_fetched]);

    return (
        <>
            <div className='flex flex-col justify-items items-center'>
                <div className='grid grid-cols-4 gap-5 m-4 ml-10 mr-10 h-[20vh] w-[98%]'>
                    <div className='bg-tilebox h-full bg-white rounded-lg'>
                        <div className='flex flex-col justify-center'>
                           <div className='m-2 text-xs font-bold '>TOTAL ENERGY COST</div>
                           <span><div className='text-center m-2 text-4xl mt-10'>Rs. {calculateElectricityBill(EnergyUnit)}</div></span>
                        </div>
                    </div>
                    <div className='bg-tilebox h-full bg-white rounded-lg'>
                        <div className='flex flex-col justify-center'>
                            <div className='m-2 text-xs font-bold'>TOTAL ENERGY UNIT PER DAY</div>
                            <span><div className='text-center mt-10 text-4xl'>{EnergyUnit}</div>
                            <div className='text-center m-2 text-2xl'>KW/Hr</div></span>
                        </div>
                    </div>
                    <div className='bg-tilebox h-full bg-white rounded-lg'>
                        <div className='flex flex-col justify-center'>
                            <div className='m-2 text-xs font-bold'>AVERAGE ENERGY USAGE</div>
                            <span><div className='text-center mt-10 text-4xl'>{EnergyUnitAvg}</div>
                            <div className='text-center m-2 text-2xl'>KW/Hr</div></span>
                        </div>
                    </div>
                    <div className='bg-tilebox h-full bg-white rounded-lg'>
                        <div className='flex flex-col justify-center'>
                            <div className='m-2 text-xs font-bold'>TOTAL SOLAR PRODUCTION</div>
                            <span><div className='text-center mt-10 text-4xl'>{solarProduction}</div>
                            <div className='text-center m-2 text-2xl'>KW/Hr</div></span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TileBar;
