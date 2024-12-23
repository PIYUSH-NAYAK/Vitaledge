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


}