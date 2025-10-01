import React from "react";
import { useNavigate } from "react-router-dom";


const steps = [
  {
    id: 1,
    title: "Create Your Profile",
    description: "Sign up and set up your personal dashboard in minutes.",
  },
  {
    id: 2,
    title: "Fund Your Account",
    description: "Pick an account type and add funds securely.",
  },
  {
    id: 3,
    title: "Start Trading",
    description: "Access the platform and begin your trading journey.",
  },
];

const StepsSection = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-gray-900 text-white py-16 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">
          Getting Started in 3 Simple Steps
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col items-center text-center">
              <div className="relative flex items-center justify-center w-20 h-20 rounded-full border-4 border-blue-600 mb-6">
                <span className="text-2xl font-bold">{step.id}</span>
                <div className="absolute inset-0 rounded-full border-2 border-gray-700"></div>
              </div>

              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <button 
          onClick={() => navigate("/signup")}
          className="bg-blue-600 text-black px-6 py-3 rounded-full font-medium shadow-lg hover:bg-green-500 transition">
            Open Your Account
          </button>
        </div>
      </div>
    </section>
  );
};

export default StepsSection;
