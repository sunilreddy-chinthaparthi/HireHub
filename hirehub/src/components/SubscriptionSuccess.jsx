import React from "react";
import { useNavigate } from "react-router-dom";

const SubscriptionSuccess = ({ subscription }) => {
  const navigate = useNavigate();

  const handleManageSubscription = () => {
    navigate("/manage-subscription");
  };
  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
          alt="Success Icon"
          className="w-20 h-20 mx-auto mb-6"
        />
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Subscription Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for subscribing to our service. You can now enjoy premium features with your selected plan.
        </p>
        
        {subscription && (
          <div className="bg-gray-100 p-4 rounded-md text-left mb-6">
            <p className="font-semibold text-gray-800">Plan: <span className="font-normal">{subscription.plan}</span></p>
            <p className="font-semibold text-gray-800">Price: <span className="font-normal">₹{subscription.price}</span></p>
            <p className="font-semibold text-gray-800">Start Date: <span className="font-normal">{new Date(subscription.startDate).toLocaleDateString()}</span></p>
            <p className="font-semibold text-gray-800">End Date: <span className="font-normal">{new Date(subscription.endDate).toLocaleDateString()}</span></p>
          </div>
        )}

        <button
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition mb-4"
          onClick={handleManageSubscription}
        >
          Manage Subscription
        </button>
        <button
          className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
          onClick={handleGoHome}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;
