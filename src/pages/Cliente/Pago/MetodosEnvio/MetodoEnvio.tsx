const MetodoEnvio = () => {
  const radios = [
    {
      name: 'Envio Nacional',
      description: "Costo total de Envío: $ 42.000,00 Envíamos con Servientrega a nivel Nacional",
      icon: 'data:image/png;base64,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',
      value: '42000',
    },
   
  ];
  

  return (
    <div className="max-w-xl mx-auto  mb-3">
      <h2 className="text-gray-800 font-medium">Metodo de Envio</h2>
      <ul className="mt-6 space-y-3">
        {radios.map((item, idx) => (
          <li key={idx}>
            <label htmlFor={item.name} className="block relative">
              <input
                id={item.name}
                type="radio"
                defaultChecked={true}
                name="envio"
                value={item.value}
                className="sr-only peer"
                
                required
              />
              <div className="w-full flex gap-x-3 items-start p-4 cursor-pointer rounded-lg border  shadow-sm ring-indigo-600 peer-checked:ring-2 duration-200">
                <div className="flex-none">
                  <img
                    src={item?.icon}
                    alt="logo"
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <div>
                  <h3 className="leading-none text-gray-800 font-medium pr-3">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {item.description}
                  </p>
                </div>
              </div>
              <div className="absolute top-4 right-4 flex-none flex items-center justify-center w-4 h-4 rounded-full border peer-checked:bg-indigo-600 text-white peer-checked:text-white duration-200">
                <svg className="w-2.5 h-2.5" viewBox="0 0 12 10">
                  <polyline
                    fill="none"
                    stroke-width="2px"
                    stroke="currentColor"
                    stroke-dasharray="16px"
                    points="1.5 6 4.5 9 10.5 1"
                  ></polyline>
                </svg>
              </div>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MetodoEnvio;
