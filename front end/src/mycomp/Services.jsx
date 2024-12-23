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

};

export default Services;