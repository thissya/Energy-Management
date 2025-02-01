import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import AuthContext from '../Auth/AuthContext';
import './HorizontalsNavbar.css'; // Make sure to create this CSS file

const HorizontalNavbar = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { user, isAuthenticated, setIsAuthenticated, login, logout, setToken } = useContext(AuthContext);
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

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: username,
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                login(data.token); // Assuming token is used for setting authentication
                navigate('/'); // Redirect to sample content
                closeModal();
            } else {
                setErrorMessage(data.message || 'Login failed');
            }
        } catch (error) {
            setErrorMessage('An error occurred. Please try again.');
        }
    };

    return (
        <>
            <div className="flex items-center justify-between h-[5vh] bg-white px-4 font-roboto">
                <div className="flex">
                    <div className="text-3xl font-bold text-green-500">
                        Green
                    </div>
                    <div className="text-3xl font-bold text-black">
                        AI
                    </div>
                </div>
                <div className="flex items-center">
                    {isAuthenticated ? (
                        <>
            
                            <button className='px-4 py-1 text-black   rounded hover:bg-gray-400' onClick={logout}>Logout</button>
                        </>
                    ) : (
                        <button className='px-4 py-1 text-black  rounded hover:bg-gray-400' onClick={openModal}>Login</button>
                    )}
                </div>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Login Modal"
                className='ReactModal__Content border border-gray-300 rounded-lg p-4 h-full w-full max-w-md max-h-96 overflow-auto'
                overlayClassName='ReactModal__Overlay'
            >
                <button onClick={closeModal} className="absolute top-2 right-2 text-xl">✕</button>
                <p className="text-2xl font-bold mb-4">Login</p>
                <form className="flex flex-col space-y-4" onSubmit={handleLogin}>
                    <label htmlFor="username" className="text-lg font-medium">Email ID</label>
                    <input type="text" id="username" className="p-2 border border-gray-300 rounded" />

                    <label htmlFor="password" className="text-lg font-medium">Password</label>
                    <input type="password" id="password" className="p-2 border border-gray-300 rounded" />

                    <button type="submit" className="bg-blue-500 text-white rounded py-2 hover:bg-blue-600">Login</button>
                    {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                </form>
            </Modal>
        </>
    );
}

export default HorizontalNavbar;
