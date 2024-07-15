import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import AuthContext from '../Context/AuthContext';
import { supabase } from '../Database/db';
import { width } from '@mui/system';

const HorizontalNavbar = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { user, isAuthenticated, setIsAuthenticated, login, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        let { data, error } = await supabase.auth.signInWithPassword({
            email: username,
            password: password
        })
        if (error) {
            setErrorMessage(error.message);
        } else {
            login(username);
            setIsAuthenticated(true);
            navigate('/');
            closeModal();
        }
    }

    return (
        <>
            <div className="flex flex-container h-[5vh] bg-white items-center font-roboto justify-between">
                <div className="flex">
                    <div className="text-3xl font-bold text-green-500 ">
                        Green
                    </div>
                    <div className="text-3xl font-bold text-black">
                        AI
                    </div>
                </div>
                <div className="text-black font-bold transition-colors duration-300">
                    {isAuthenticated ? (
                        <>
                            <span className='mr-2'>{user.username}</span>
                            <button className='h-[5vh] pl-4 pr-4  hover:bg-gray-200 hover:text-gray-800' onClick={logout}> Logout</button>

                        </>
                    ) : (
                        <button className='h-[5vh] pl-4 pr-4 hover:bg-gray-200 hover:text-gray-800' onClick={openModal}>Login</button>
                    )}
                </div>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Login Modal"
                className='ReactModal__Content border border-gray-300 rounded-lg p-4 h-full w-full max-w-md max-h-96 overflow-auto'
            >
                <button onClick={closeModal} className="float-right p-2">X</button>
                <p className="text-2xl font-bold mb-2">Login</p>
                <form className="flex flex-col" onSubmit={handleLogin}>
                    <label htmlFor="username" className="mb-2">Email ID</label>
                    <input type="text" id="username" className="mb-4 p-2 border rounded" />

                    <label htmlFor="password" className="mb-2">Password</label>
                    <input type="password" id="password" className="mb-4 p-2 border rounded" />

                    <button type="submit" className="bg-blue-500 text-white rounded py-1">Login</button>
                    {errorMessage && <p>{errorMessage}</p>}
                </form>
            </Modal>
        </>
    );
}

export default HorizontalNavbar;