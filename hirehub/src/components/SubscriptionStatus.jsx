import React from "react";

const SubscriptionStatus = ({ isSubscribed, subscriptionDetails }) => {
  return (
    <div className="">
      {isSubscribed ? (
        <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg w-96 text-center">
          <h2 className="text-2xl font-bold mb-4">Subscription Active</h2>
          <p className="mb-4">
            You are already subscribed to the <strong>{subscriptionDetails.planName}</strong> plan.
          </p>
          <p className="mb-4">
            Next Billing Date:{" "}
            {subscriptionDetails.endDate &&  <strong>
              {new Date(subscriptionDetails.endDate).toLocaleDateString("en-US")}
            </strong>}
           
          </p>
          <button
            onClick={() => alert("Redirecting to manage subscription page...")}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Manage Subscription
          </button>
        </div>
      ) : (
        <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg w-96 text-center">
          <h2 className="text-2xl font-bold mb-4">No Active Subscription</h2>
          <p className="mb-4">Subscribe now to unlock premium features!</p>
          <button
            onClick={() => alert("Redirecting to subscription page...")}
            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
          >
            Subscribe Now
          </button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionStatus;
