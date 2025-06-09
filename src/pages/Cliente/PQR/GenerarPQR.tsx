import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const GenerarPQR: React.FC = () => {
  const whatsappNumber = "+573132215688";
  const defaultMessage = "Hola, quiero generar un PQR.";

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber.replace(
      "+",
      ""
    )}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
        Generar PQR por WhatsApp
      </h2>
      <button
        onClick={handleWhatsAppClick}
        className="flex items-center bg-green-500 text-white font-medium px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300"
      >
        <FaWhatsapp className="mr-2 text-2xl" />
        Generar PQR
      </button>
    </div>
  );
};

export default GenerarPQR;
