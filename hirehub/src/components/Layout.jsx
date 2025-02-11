import React, {useState} from 'react';
import Header from './Header';
import Footer from './Footer';
import { motion, AnimatePresence } from 'framer-motion';
import Spinner from './Spinner';
import { useAuth } from '../context/AuthContext'; 

const Layout = ({ children, onSignOut, loading }) => { 
  const { user, setUser } = useAuth();
  console.log('user in layout',user);
  return (
    <div
    className={`flex flex-col min-h-screen ${
      user && user.type == 'Employer'
        ? 'bg-[#F4F4F4] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400'
        : 'bg-[#E9E9E9] bg-gradient-to-r from-white via-indigo-50 to-pink-50'
    }`}
  >  
      <Header user={user} onSignOut={onSignOut} /> 
      <AnimatePresence>
        <motion.main 
          className="flex-grow" 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
        >
           {loading && (
        <div className="fullscreen-spinner">
          <Spinner />
        </div>
      )}
          {children}
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default Layout;
