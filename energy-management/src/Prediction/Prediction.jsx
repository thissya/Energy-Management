import VerticalNavbar from "../components/VerticalNavbar";
import HorizontalNavbar from "../components/HorizontalNavbar";
import PredictionChart from "./PredicitionChart";

function Prediction() {
    return (
        <>
            <div className="flex flex-row overflow-hidden h-screen">
                <VerticalNavbar />
                <div className="flex flex-col w-full overflow-y-auto">
                    <HorizontalNavbar />
                    <PredictionChart />
                </div>
               
            </div>
        </>
    )
}

export default Prediction;