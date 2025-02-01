import VerticalNavbar from '../Components/VerticalNavbar';
import HorizontalNavbar from '../Components/HorizontalNavbar';
import Tile from './Tile';
import HomeChart from './HomeChart';
import HomePieChart from './HomePieChart';
import '../App.css';

export default function App() {
    return (
        <>
            <div className="flex flex-row overflow-hidden h-screen bg-cyan-800">
                <VerticalNavbar />
                <div className="flex flex-col w-full overflow-y-auto">
                    <HorizontalNavbar />
                    <Tile />
                  {<div className='ml-6 grid grid-cols-2 gap-2 mr-4 mt-4'>
                        <div className='h-[60vh] w-full bg-white rounded-lg'>
                            <HomeChart />
                        </div>
                        <HomePieChart />
                    </div>}
                </div>

            </div>

        </>
    );
}