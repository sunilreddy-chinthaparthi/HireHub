import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext'; 
import SubscriptionStatus from "../components/SubscriptionStatus";
import Loader from "../components/Loader";

const JobPortalSubscriptionPage = () => {
  const { user, logout } = useAuth();
  const [subscription, setSubscription] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (user) {
      getSubscriptionInfo();
    }
}, [user]);
   const getSubscriptionInfo = async () =>{
    try {
       setIsLoading(true);
        console.log('user 17',user);
        const userId = user.userId || user._id;
        const response = await fetch(`http://localhost:4000/api/getsubscriptions?userId=${encodeURIComponent(userId)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        console.log('SubscriptionData',data);
        if(data.subscription.status == 'active') setIsSubscribed(true)
        setSubscription(data.subscription);
    }catch (error){
        console.error(error);
    }
    setIsLoading(false);
}
  console.log('user32',user);
  const handleSubscribe = (selectedPlan) => {
    navigate("/payment", { state: { selectedPlan } });
  };
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("Basic");

  const plans = [
    {
      name: "Basic",
      price: "$199/Month",
      description: "Ideal for startups and small businesses",
      features: {
        jobPostings: 5,
        resumeAccess: false,
        featuredListings: false,
        support: "Email Support",
      },
    },
    {
      name: "Standard",
      price: "$499/Month",
      description: "Perfect for growing businesses",
      features: {
        jobPostings: 20,
        resumeAccess: true,
        featuredListings: false,
        support: "Priority Email Support",
      },
    },
    {
      name: "Premium",
      price: "$999/Month",
      description: "Best for large organizations",
      features: {
        jobPostings: "Unlimited",
        resumeAccess: true,
        featuredListings: true,
        support: "24/7 Support",
      },
    },
  ];

  return (
    <>
    {isLoading && <Loader />}
    <div className="relative w-screen mt-8 flex items-center justify-center">
     {!(subscription && subscription.status == 'active') ? ( <div className="relative bg-white max-w-4xl bg-whitew-full rounded-lg p-8 shadow-lg">
        <h1 className="text-3xl font-semibold mb-4 text-center">
          Choose a Subscription Plan
        </h1>
        <p className="text-center text-gray-400 mb-6">
          Select the plan that best fits your hiring or job-seeking needs.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`p-6 border rounded-lg shadow-md transition-transform transform ${
                selectedPlan.name === plan.name
                  ? "bg-blue-600 border-blue-700 scale-105 text-white"
                  : "bg-white border-gray-600 text-black hover:scale-105"
              }`}
              onClick={() => setSelectedPlan(plan)}
            >
              <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
              <p className="text-lg mb-4">{plan.price}</p>
              <p className="text-sm mb-4">{plan.description}</p>
              <ul className="space-y-2 text-sm">
                <li>Job Postings: {plan.features.jobPostings}</li>
                <li>
                  Resume Access:{" "}
                  {plan.features.resumeAccess ? "✔ Included" : "✖ Not Included"}
                </li>
                <li>
                  Featured Listings:{" "}
                  {plan.features.featuredListings ? "✔ Included" : "✖ Not Included"}
                </li>
                <li>Support: {plan.features.support}</li>
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button className=" w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-3 rounded-lg font-semibold shadow-md transform hover:scale-105 transition-transform"
           onClick={() => handleSubscribe(selectedPlan)}>
            Continue with {selectedPlan.name} Plan
          </button>
        </div>
      </div>):<SubscriptionStatus isSubscribed = {isSubscribed} subscriptionDetails={subscription}/>}
     
    </div>
    </>
  );
};

export default JobPortalSubscriptionPage;
