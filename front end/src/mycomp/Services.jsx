import "./Services.css";
import { useState } from "react";
import Modal from "./Modal";

const Services = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const medicamentos = [
    {
      name: "Augmentin",
      description: "A broad-spectrum antibiotic used to treat various bacterial infections.",
      Expiration_date: "12/2025",
      price: "₹150 per strip of 10 tablets",
      company: "GlaxoSmithKline",
    },
    {
      name: "Pantocid",
      description: "A proton pump inhibitor used to treat acid reflux and peptic ulcer disease.",
      Expiration_date: "09/2025",
      price: "₹120 per strip of 15 tablets",
      company: "Sun Pharmaceutical Industries Ltd.",
    },
    {
      name: "Allegra",
      description: "An antihistamine used to relieve allergy symptoms such as runny nose and sneezing.",
      Expiration_date: "08/2025",
      price: "₹180 per strip of 10 tablets",
      company: "Sanofi India Ltd.",
    },
    {
      name: "Combiflam",
      description: "A combination of ibuprofen and paracetamol used for pain relief and reducing inflammation.",
      Expiration_date: "07/2025",
      price: "₹50 per strip of 20 tablets",
      company: "Sanofi India Ltd.",
    },
    {
      name: "Dolo 650",
      description: "A paracetamol tablet used for relieving fever and mild to moderate pain.",
      Expiration_date: "06/2025",
      price: "₹30 per strip of 15 tablets",
      company: "Micro Labs Ltd.",
    },
    {
      name: "Saridon",
      description: "An analgesic used for the relief of headaches and other types of pain.",
      Expiration_date: "05/2025",
      price: "₹35 per strip of 10 tablets",
      company: "Piramal Enterprises Ltd.",
    },
    {
      name: "Betadine",
      description: "An antiseptic ointment used for preventing infections in minor cuts and burns.",
      Expiration_date: "04/2025",
      price: "₹60 per 20g tube",
      company: "Win-Medicare Pvt. Ltd.",
    },
    {
      name: "Revital H",
      description: "A daily health supplement with vitamins and minerals to improve energy and immunity.",
      Expiration_date: "03/2025",
      price: "₹300 per pack of 30 capsules",
      company: "Sun Pharmaceutical Industries Ltd.",
    },
    {
      name: "Glycomet GP",
      description: "An anti-diabetic medication used to manage blood sugar levels in type 2 diabetes patients.",
      Expiration_date: "11/2025",
      price: "₹90 per strip of 10 tablets",
      company: "USV Pvt. Ltd.",
    },
    {
      name: "Calpol",
      description: "A paracetamol-based analgesic and antipyretic used for relieving pain and reducing fever.",
      Expiration_date: "10/2025",
      price: "₹30 per strip of 15 tablets",
      company: "GlaxoSmithKline",
    },
    {
      name: "Volini Gel",
      description: "A topical analgesic gel used for relieving muscle and joint pain.",
      Expiration_date: "02/2025",
      price: "₹100 per 30g tube",
      company: "Sun Pharmaceutical Industries Ltd.",
    },
  ];

  return (
    <>
      <section className="mt-12 max-w-screen-lg min-h-[690px] mx-auto px-4 md:px-8 pt-20">
        <div>
          <div className="max-w-screen-xl mx-auto px-4 md:px-8">
            <div className="items-start justify-between py-4 border-b md:flex">
              <div>
                <h1 className="text-gray-800 text-3xl font-semibold">
                  List of Medicines
                </h1>
              </div>
              <div className="items-center gap-x-3 mt-6 md:mt-0 sm:flex">
                <a
                  href="/"
                  className="block px-4 py-2 text-center text-white duration-150 font-bold bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm"
                >
                  Add Medicine
                </a>
              </div>
            </div>
          </div>
        </div>
        <ul className="mt-8 space-y-5">
          {medicamentos.map((item, idx) => (
            <li
              key={idx}
              className="p-5 bg-white border-gray-300 border-[1px] rounded-md shadow-lg hover:shadow-xl hover:transform hover:scale-105 duration-300"
            >
              <div>
                <div className="justify-between sm:flex">
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-cyan-600">
                      {item.name}
                    </h3>
                    <p className="text-gray-500 mt-2 pr-2">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-5 space-y-4 text-sm sm:mt-0 sm:space-y-2">
                    <span className="flex items-center text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {item.Expiration_date}
                    </span>
                    <span className="flex items-center text-gray-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {item.price}
                    </span>
                  </div>
                </div>
                <div className="mt-4 items-center space-y-4 text-sm sm:flex sm:space-x-4 sm:space-y-0">
                  <span className="flex items-center text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {item.company}
                  </span>
                </div>
                <div class="pt-5">
                  <Modal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default Services;