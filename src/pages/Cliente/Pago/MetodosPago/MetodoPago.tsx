const MetodoPago = () => {
  const radios = [
    {
      name: 'PSE',
      description:
        'Una manera rápida y segura para realizar transferencias desde tu cuenta bancaria sin necesidad de tarjetas.',
      icon: 'https://seeklogo.com/images/P/pse-logo-B00717880A-seeklogo.com.png',
      value: 'PSE',
      active: true,
    },
    {
      name: 'Tarjeta de crédito',
      description:
        'Realiza pagos cómodamente usando tus tarjetas de crédito, con cobertura mundial y procesamiento instantáneo.',
      icon: 'https://static.vecteezy.com/system/resources/thumbnails/000/357/048/small/3__2821_29.jpg',
      value: 'Tarjeta de crédito',
      active: true,
    },
    {
      name: 'ContraEntrega',
      description:
        'Paga directamente al recibir tu pedido, sin anticipos ni pagos previos.',
      icon: 'https://img.freepik.com/vector-gratis/concepto-pago-contra-reembolso_23-2148768275.jpg?semt=ais_hybrid',
      value: 'ContraEntrega',
      active: false,
    },
  ];

  return (
    <div className="max-w-xl mx-auto ">
      <h2 className="text-gray-800 font-medium">Metodo de pago</h2>
      <ul className="mt-6 space-y-3">
        {radios.map((item, idx) => (
          <li key={idx}>
            <label htmlFor={item.name} className="block relative">
              <input
                id={item.name}
                type="radio"
                defaultChecked={idx == 2 ? true : false}
                name="payment"
                value={item.value}
                className="sr-only peer"
                disabled={item.active}
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
                  <p className="text-end text-sm text-gray-600">
                    {item.active && 'Proceso de pago en curso'}
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

export default MetodoPago;
