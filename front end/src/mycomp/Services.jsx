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
            nombre: "Gliclazida",
            descripcion: "Gliclazida para el control de la glucosa en sangre",
            fechaCaducidad: "2026-03-31",
            costo: "130.00",
            farmacia: "Yza",
        },
        {
            nombre: "Atenolol",
            descripcion: "Atenolol para el control de la presión arterial alta",
            fechaCaducidad: "2025-09-30",
            costo: "150.00",
            farmacia: "Farmacias Guadalajara",
        },
        {
            nombre: "Metoprolol",
            descripcion: "Metoprolol para el control de la presión arterial alta",
            fechaCaducidad: "2026-03-31",
            costo: "130.00",
            farmacia: "Farmacias Benavides",
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

            </section>
        </>
    );
};

export default Services;