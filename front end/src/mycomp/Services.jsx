import "./Services.css";
import { useState } from "react";
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
            nombre: "Metoprolol",
            descripcion: "Metoprolol para el control de la presión arterial alta",
            fechaCaducidad: "2026-03-31",
            costo: "130.00",
            farmacia: "Farmacias Benavides",
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
                                    </div>
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