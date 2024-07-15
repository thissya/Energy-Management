import React, { useContext } from 'react';
import AuthContext from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBarChart, faPlus } from '@fortawesome/free-solid-svg-icons';

const VerticalNavbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="flex flex-col bg-white w-[5vh] items-center">
      <div className='pt-[60px]'>
        <button onClick={() => navigate('/')}><FontAwesomeIcon icon={faHome} color='black' size='1x' /></button>
      </div>
      <div className='py-6'>
        <button onClick={() => navigate('/prediction')}><FontAwesomeIcon icon={faBarChart} color='black' size='1x' /></button>
      </div>
      {isAuthenticated && (
        <div className=''>
          <button onClick={() => navigate('/form')}><FontAwesomeIcon icon={faPlus} color='black' size='1x' /></button>
        </div>
      )}
    </div>
  );
}

export default VerticalNavbar;