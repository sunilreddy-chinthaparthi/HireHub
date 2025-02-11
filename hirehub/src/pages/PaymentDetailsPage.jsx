import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext'; 
import SubscriptionSuccess from "../components/SubscriptionSuccess";

const PaymentDetailsPage = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [status, setStatus ] = useState(false);
  const navigate = useNavigate();
  const { selectedPlan } = location.state;
  console.log('user',user);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails({ ...paymentDetails, [name]: value });
  };

  const  handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Payment Details: ", paymentDetails);
    const plan = selectedPlan.name;
    const userId = user.userId;
    const price = selectedPlan.price;
    const durationInMonths = 1;
    const response = await fetch('http://localhost:4000/api/subscriptions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                },
                body: JSON.stringify({
                    userId,
                    plan,
                    price,
                    durationInMonths,
                }),
            });

            const data = await response.json();
            if(data.success){
                setStatus(true);
            }
    
  };

  return (
    <div
      className="relative w-screen mt-6 flex items-center justify-center"
    >
        { status ? (<SubscriptionSuccess />) :(<div className="bg-white w-full max-w-lg p-8 rounded-lg shadow-2xl text-gray-800">
        <h1 className="text-3xl font-bold text-center text-black mb-6">
          Complete Your Payment
        </h1>
        <p className="text-gray-600 text-center mb-8">
          You're subscribing to the{" "}
          <span className="font-semibold text-pink-600">{selectedPlan.name}</span>{" "}
          plan.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700">
              Cardholder Name
            </label>
            <input
              type="text"
              name="cardholderName"
              id="cardholderName"
              value={paymentDetails.cardholderName}
              onChange={handleChange}
              required
              placeholder="e.g., John Doe"
              className="w-full mt-2 p-3  border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
          </div>
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
              Card Number
            </label>
            <input
              type="text"
              name="cardNumber"
              id="cardNumber"
              value={paymentDetails.cardNumber}
              onChange={handleChange}
              required
              placeholder="e.g., 1234 5678 9012 3456"
              className="w-full mt-2 p-3  border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <input
                type="text"
                name="expiryDate"
                id="expiryDate"
                value={paymentDetails.expiryDate}
                onChange={handleChange}
                required
                placeholder="MM/YY"
                className="w-full mt-2 p-3  border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                CVV
              </label>
              <input
                type="text"
                name="cvv"
                id="cvv"
                value={paymentDetails.cvv}
                onChange={handleChange}
                required
                placeholder="e.g., 123"
                className="w-full mt-2 p-3  border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-3 rounded-lg font-semibold shadow-md transform hover:scale-105 transition-transform"
          >
            Pay ₹{selectedPlan.price}
          </button>
        </form>
      </div>)
}
      

      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-white/5 pointer-events-none"></div>
    </div>
  );
};

export default PaymentDetailsPage;
