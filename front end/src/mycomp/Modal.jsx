import { useState } from "react";

export default function Modal({ isOpen, setIsOpen }) {
  // Function to generate a random number between min and max
  function randomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const [steps] = useState({
    stepsItems: ["Farmaceutica", "Enruta", "Farmacia", "Cliente"],
    currentStep: randomNumberInRange(1, 4),
  });

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-0">
      <ul
        aria-label="Steps"
        className="items-center text-gray-600 font-medium md:flex"
      >
        {steps.stepsItems.map((item, idx) => (
          <li
            key={idx} // Add a unique key
            aria-current={steps.currentStep === idx + 1 ? "step" : undefined}
            className="flex-1 last:flex-none flex gap-x-2 md:items-center"
          >
            <div className="flex items-center flex-col gap-x-2">
              <div
                className={`w-8 h-8 rounded-full border-2 flex-none flex items-center justify-center ${
                  steps.currentStep > idx + 1
                    ? "bg-indigo-600 border-indigo-600"
                    : steps.currentStep === idx + 1
                    ? "border-indigo-600"
                    : ""
                }`}
              >
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}