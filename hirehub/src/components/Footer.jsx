import React from 'react';

const Footer = () => {
  return (
    <footer className="text-black py-6 mt-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <a href="/" className="text-sm hover:border-black transition duration-200">Home</a>
          <a href="/about" className="text-sm hover:border-black transition duration-200">About Us</a>
          <a href="/contact" className="text-sm hover:border-black transition duration-200">Contact</a>
          <a href="/privacy" className="text-sm hover:border-black transition duration-200">Privacy Policy</a>
        </div>
        <div className="text-sm">
          © {new Date().getFullYear()} HireHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
