import "./Services.css";
import  { useState } from "react";
import Modal from "./Modal";

const Services = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const medicamentos = [
    {
      nombre: "Insulina Humana",
      descripcion: "Insulina Humana para el control de la glucosa en sangre",
      fechaCaducidad: "2025-09-30",
      costo: "150.00",
      farmacia: "Farmacias Benavides",
    },
    {
      nombre: "Metformina",
      descripcion: "Metformina para el tratamiento de la diabetes tipo 2",
      fechaCaducidad: "2025-12-31",
      costo: "120.00",
      farmacia: "Farmalisto",
    },
    {
      nombre: "Gliclazida",
      descripcion: "Gliclazida para el control de la glucosa en sangre",
      fechaCaducidad: "2026-03-31",
      costo: "130.00",
      farmacia: "Yza",
    },
    {
      nombre: "Sulfonilmida",
      descripcion: "Sulfonilmida para el tratamiento de la diabetes tipo 2",
      fechaCaducidad: "2026-06-30",
      costo: "140.00",
      farmacia: "Farmacias San Pablo",
    },
    {
      nombre: "Atenolol",
      descripcion: "Atenolol para el control de la presión arterial alta",
      fechaCaducidad: "2025-09-30",
      costo: "150.00",
      farmacia: "Farmacias Guadalajara",
    },
    {
      nombre: "Lisinopril",
      descripcion: "Lisinopril para el tratamiento de la hipertensión",
      fechaCaducidad: "2025-12-31",
      costo: "120.00",
      farmacia: "Farmacias de similares",
    },
    {
      nombre: "Metoprolol",
      descripcion: "Metoprolol para el control de la presión arterial alta",
      fechaCaducidad: "2026-03-31",
      costo: "130.00",
      farmacia: "Farmacias Benavides",
    },
    {
      nombre: "Amlodipino",
      descripcion: "Amlodipino para el tratamiento de la hipertensión",
      fechaCaducidad: "2026-06-30",
      costo: "140.00",
      farmacia: "Farmalisto",
    },
    {
      nombre: "Trametinib",
      descripcion: "Trametinib para el tratamiento del cáncer de pulmón",
      fechaCaducidad: "2025-09-30",
      costo: "250.00",
      farmacia: "Yza",
    },
    {
      nombre: "Daratumumab",
      descripcion: "Daratumumab para el tratamiento del mieloma múltiple",
      fechaCaducidad: "2025-12-31",
      costo: "220.00",
      farmacia: "Farmacias San Pablo",
    },
    {
      nombre: "Hidroxicloroquina",
      descripcion: "Hidroxicloroquina para el tratamiento del lupus",
      fechaCaducidad: "2026-03-31",
      costo: "230.00",
      farmacia: "Farmacias Guadalajara",
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
                  Lista de Medicamentos
                </h1>
              </div>
              <div className="items-center gap-x-3 mt-6 md:mt-0 sm:flex">
                <a
                  href="/"
                  className="block px-4 py-2 text-center text-white duration-150 font-bold bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm"
                >
                  Agregar
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
                      {item.nombre}
                    </h3>
                    <p className="text-gray-500 mt-2 pr-2">
                      {item.descripcion}
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
                      {item.fechaCaducidad}
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
                      ${item.costo}
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
                    {item.farmacia}
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