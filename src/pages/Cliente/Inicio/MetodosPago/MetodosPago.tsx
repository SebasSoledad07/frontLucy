import React from "react";

const radios = [
  {
    name: "PSE",
    icon: "https://seeklogo.com/images/P/pse-logo-B00717880A-seeklogo.com.png",
    value: "PSE",
  },
  {
    name: "Tarjeta de crédito",
    icon: "https://static.vecteezy.com/system/resources/thumbnails/000/357/048/small/3__2821_29.jpg",
    value: "Tarjeta de crédito",
  },
  {
    name: "ContraEntrega",
    icon: "https://img.freepik.com/vector-gratis/concepto-pago-contra-reembolso_23-2148768275.jpg?semt=ais_hybrid",
    value: "ContraEntrega",
  },
];

const MetodosDePago: React.FC = () => {
  return (
    <section className="max-w-screen-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#3A3A3A]">
        Métodos de Pago Disponibles
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {radios.map((method, index) => (
          <div
            key={index}
            className="flex flex-col items-center border border-[#D3B8F0] p-4 rounded-xl shadow-sm bg-[#FDEDF4] hover:shadow-md transition"
          >
            <img
              src={method.icon}
              alt={method.name}
              className="w-16 h-16 rounded-full object-cover mb-3"
            />
            <h3 className="text-lg font-semibold text-[#3A3A3A] text-center">
              {method.name}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
};



export default MetodosDePago;
