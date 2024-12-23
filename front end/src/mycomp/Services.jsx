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
    ];

};

export default Services;