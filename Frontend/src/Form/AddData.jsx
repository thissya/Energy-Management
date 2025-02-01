import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../Auth/AuthContext';
import VerticalNavbar from '../Components/VerticalNavbar';
import HorizontalNavbar from '../Components/HorizontalNavbar';

function AddData() {
    const navigate = useNavigate();
    const { isAuthenticated, token } = useContext(AuthContext);

    const [date, setDate] = useState('');
    const [energyEastCampus, setEnergyEastCampus] = useState('');
    const [energyMbaMca, setEnergyMbaMca] = useState('');
    const [energyCivil, setEnergyCivil] = useState('');
    const [energyMech, setEnergyMech] = useState('');
    const [energyAuto, setEnergyAuto] = useState('');

    const [solarEnergyEastCampus, setSolarEnergyEastCampus] = useState('');
    const [solarEnergyMbaMca, setSolarEnergyMbaMca] = useState('');
    const [solarEnergyCivil, setSolarEnergyCivil] = useState('');
    const [solarEnergyMech, setSolarEnergyMech] = useState('');
    const [solarEnergyAuto, setSolarEnergyAuto] = useState('');

    const [collectionType, setCollectionType] = useState('electric'); 
    const [successMessage, setSuccessMessage] = useState(false); // New state for success message

    const handleEnergyChange = (setter) => (event) => {
        const value = event.target.value;
        if (!isNaN(value)) {
            setter(value);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const resetForm = () => {
        setDate('');
        setEnergyEastCampus('');
        setEnergyMbaMca('');
        setEnergyCivil('');
        setEnergyMech('');
        setEnergyAuto('');
        setSolarEnergyEastCampus('');
        setSolarEnergyMbaMca('');
        setSolarEnergyCivil('');
        setSolarEnergyMech('');
        setSolarEnergyAuto('');
        setCollectionType('electric');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const payload = {
                date,
                eastCampus: collectionType === 'electric' ? energyEastCampus : solarEnergyEastCampus,
                mbaMca: collectionType === 'electric' ? energyMbaMca : solarEnergyMbaMca,
                civil: collectionType === 'electric' ? energyCivil : solarEnergyCivil,
                mech: collectionType === 'electric' ? energyMech : solarEnergyMech,
                auto: collectionType === 'electric' ? energyAuto : solarEnergyAuto
            };

            const response = await axios.post(`http://localhost:3000/add/${collectionType}`, payload, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Data submitted successfully:', response.data);
            setSuccessMessage(true); // Show success message
            setTimeout(() => setSuccessMessage(false), 2000); // Hide after 2 seconds
            resetForm();
        } catch (error) {
            console.error('There was an error!', error.response ? error.response.data : error.message);
        }
    };

    return (
        <>
            <div className="flex flex-row overflow-hidden h-screen bg-cyan-800">
                <VerticalNavbar />
                <div className="flex flex-col w-full overflow-y-auto">
                    <HorizontalNavbar />
                    <form className="m-4 grid grid-cols-2 gap-4 w-[40%]" onSubmit={handleSubmit}>
                        <div className="flex flex-col">
                            <label className="text-black p-2">Enter Date:</label>
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field p-2" />
                        </div>
    
                        <div className="flex flex-col">
                            <label className="text-black p-2">Select Collection Type:</label>
                            <select value={collectionType} onChange={(e) => setCollectionType(e.target.value)} className="input-field p-2">
                                <option value="electric">Electric</option>
                                <option value="solar">Solar</option>
                            </select>
                        </div>
    
                        {collectionType === 'electric' ? (
                            <>
                                <div className="flex flex-col">
                                    <label className="text-black p-2">Enter Energy for East Campus:</label>
                                    <input type="text" value={energyEastCampus} onChange={handleEnergyChange(setEnergyEastCampus)} className="input-field p-2" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-black p-2">Enter Energy for MBA and MCA:</label>
                                    <input type="text" value={energyMbaMca} onChange={handleEnergyChange(setEnergyMbaMca)} className="input-field p-2" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-black p-2">Enter Energy for Civil:</label>
                                    <input type="text" value={energyCivil} onChange={handleEnergyChange(setEnergyCivil)} className="input-field p-2" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-black p-2">Enter Energy for Mech:</label>
                                    <input type="text" value={energyMech} onChange={handleEnergyChange(setEnergyMech)} className="input-field p-2" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-black p-2">Enter Energy for AUTO:</label>
                                    <input type="text" value={energyAuto} onChange={handleEnergyChange(setEnergyAuto)} className="input-field p-2" />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex flex-col">
                                    <label className="text-black p-2">Enter Solar Energy for East Campus:</label>
                                    <input type="text" value={solarEnergyEastCampus} onChange={handleEnergyChange(setSolarEnergyEastCampus)} className="input-field p-2" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-black p-2">Enter Solar Energy for MBA and MCA:</label>
                                    <input type="text" value={solarEnergyMbaMca} onChange={handleEnergyChange(setSolarEnergyMbaMca)} className="input-field p-2" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-black p-2">Enter Solar Energy for Civil:</label>
                                    <input type="text" value={solarEnergyCivil} onChange={handleEnergyChange(setSolarEnergyCivil)} className="input-field p-2" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-black p-2">Enter Solar Energy for Mech:</label>
                                    <input type="text" value={solarEnergyMech} onChange={handleEnergyChange(setSolarEnergyMech)} className="input-field p-2" />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-black p-2">Enter Solar Energy for AUTO:</label>
                                    <input type="text" value={solarEnergyAuto} onChange={handleEnergyChange(setSolarEnergyAuto)} className="input-field p-2" />
                                </div>
                            </>
                        )}
    
                        <button type="submit" className="btn-primary w-[150px] mt-4">Submit</button>
                    </form>

                    {successMessage && (
                        <div className="text-center text-green-600 mt-4">
                            Submitted successfully!
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default AddData;
