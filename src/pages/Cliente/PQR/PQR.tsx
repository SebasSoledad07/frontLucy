import React, { useState } from 'react';
import GenerarPQR from './GenerarPQR';
import PageTitle from '../../../components/PageTitle';

interface Section {
  title: string;
  content: string;
}

const sections: Section[] = [
  {
    title: '1. PARTES DEL CONTRATO',
    content: `Por un lado, MAYLU STYLES, sociedad comercial, identificada con NIT. 1091807362-8, debidamente constituida bajo las leyes de Colombia y domiciliada en la dirección Avenida 6 #12-78, Centro, Cúcuta, que opera bajo la marca comercial "Lucy Mundo Pijamas", actúa como el VENDEDOR, en adelante "Lucy Mundo Pijamas"; y por el otro, el Cliente, mayor de edad, quien podrá actuar en nombre propio (persona natural) o como representante legal de una sociedad (persona jurídica), como el COMPRADOR, en adelante "el Cliente".

Lucy Mundo Pijamas, presumirá de buena fe que está contratando directamente con el Cliente mayor de edad o con su representante legal debidamente facultado, por lo que Lucy Mundo Pijamas no asumirá responsabilidad alguna en caso de suplantación.`,
  },
  {
    title: '2. OBJETO Y ÁMBITO DE APLICACIÓN',
    content: `Los presentes, constituyen los términos y las condiciones que se deberán tener en cuenta por los Clientes para las compras que realicen en el sitio web https://front-lucy.vercel.app/ O Tienda Online o por canales de comercio electrónico tales como WhatsApp -en lo que sea aplicable de los productos que comercializa Lucy Mundo Pijamas.

Se entenderán como productos los elementos, accesorios y pijamas que se comercializan en https://front-lucy.vercel.app/ o Tienda Online o por canales de comercio electrónico tales como WhatsApp -en lo que sea aplicable. Los términos y condiciones aquí descritos les serán aplicables de manera indistinta a la totalidad de productos, salvo que se indique expresamente lo contrario, caso en el cual se establecerán las condiciones especiales para la comercialización de cada tipo de producto.`,
  },
  {
    title: '3. ACLARACIONES IMPORTANTES',
    content: `Antes de realizar la compra de tu producto en Lucy Mundo Pijamas deberás tener en cuenta lo siguiente:

- Para realizar cualquier compra, es requisito esencial que el Cliente registre su información personal completa incluyendo: nombre, apellido, correo electrónico, teléfono, tipo y número de documento, fecha de nacimiento, dirección completa (departamento, ciudad, barrio y código postal), y se identifique correctamente para el envío del/los productos adquiridos.
- Estos términos podrán ser modificados o adicionados por Lucy Mundo Pijamas en el futuro.
- La venta de los productos ofertados y publicados y comercializados por Lucy Mundo Pijamas está sujeta a disponibilidad de inventario y cobertura geográfica.`,
  },
  {
    title: '4. PRECIO',
    content: `El precio de los productos ofrecidos en esta página web, Tienda Online o por canales de comercio electrónico tales como WhatsApp corresponde al valor del producto sin IVA, ya que Lucy Mundo Pijamas no maneja impuestos sobre el valor agregado en sus productos.`,
  },
  {
    title: '5. MEDIOS Y CONDICIONES DE PAGO',
    content: `Los pagos se procesan a través de la plataforma Wompi y podrán efectuarse por los siguientes medios:

- Tarjetas de Crédito o Débito: Permite usar tarjetas de crédito o débito para realizar el pago.
- Botón de Transferencia Bancolombia: Para clientes con cuentas de ahorros o corrientes Bancolombia.
- Nequi: Uso de cuenta Nequi desde el celular para completar el pago.
- PSE: Pago usando cuenta bancaria de ahorros o corriente de cualquier banco colombiano.
- Pago en efectivo en Corresponsales Bancarios Bancolombia: Pago en efectivo en cualquiera de los más de 15.000 Corresponsales Bancarios Bancolombia.
- PCOL: Pago redimiendo Puntos Colombia.
- BNPL BANCOLOMBIA: Crédito de libre inversión de BANCOLOMBIA sin intereses, dividido en 4 cuotas mensuales para transacciones superiores a $100,000 pesos.
- DAVIPLATA: Uso de cuenta Daviplata para realizar el pago.
- SU+ PAY: Compra de productos pagando en cuotas, facilitando la gestión financiera.`,
  },
  {
    title: '6. ENVÍOS Y ENTREGA DE LOS PRODUCTOS',
    content: `Los productos serán entregados en el domicilio que el Cliente registre al momento de la compra, dentro de un plazo máximo de veinte (20) días hábiles.`,
  },
  {
    title: '7. DERECHO DE RETRACTO',
    content: `El Cliente podrá ejercer el derecho de retracto dentro de los cinco (5) días calendario siguientes a la entrega del producto, siempre y cuando el artículo no haya sido manipulado ni usado.`,
  },
  {
    title: '8. REVERSIÓN DEL PAGO',
    content: `El Cliente podrá solicitar la reversión del pago en los siguientes casos:

    - Si es objeto de fraude.
    - Si el producto adquirido no fue recibido o no corresponde al solicitado.`,
  },
  {
    title: '9. GARANTÍAS',
    content: `Todos los productos comercializados por Lucy Mundo Pijamas cuentan con un término de garantía de tres (03) meses.`,
  },
  {
    title: '10. CAMBIOS Y DEVOLUCIONES',
    content: `Los cambios y devoluciones únicamente se realizarán en casos de reclamaciones por garantía, derecho de retracto o reversión del pago.`,
  },
  {
    title: '11. CANALES DE ATENCIÓN AL CLIENTE',
    content: `Chat y WhatsApp: +57 322 2685843

Dirección física: Avenida 6 #12-78, Centro, Cúcuta`,
  },
];

// Función para convertir saltos de línea en elementos JSX
const formatContent = (content: string) => {
  return content.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      {index < content.split('\n').length - 1 && <br />}
    </React.Fragment>
  ));
};

const PQR: React.FC = () => {
  const [openSection, setOpenSection] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setOpenSection(openSection === index ? null : index);
  };

  return (
    <>
      <PageTitle title="Lucy Mundo de Pijamas PQR" />
      <section className="max-w-screen-lg mx-auto p-6 bg-gray-50">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-900">
          Lucy Mundo de Pijamas PQR
        </h1>
        <GenerarPQR />
        {sections.map((section, index) => (
          <div
            key={index}
            className="border-b border-blue-100 py-4 cursor-pointer hover:bg-blue-50 transition-colors"
            onClick={() => toggleSection(index)}
          >
            <h2 className="text-xl font-medium flex justify-between items-center text-blue-900">
              {section.title}
              <span className="text-coral-500 font-bold">
                {openSection === index ? '−' : '+'}
              </span>
            </h2>
            {openSection === index && (
              <div className="mt-4 text-blue-800 whitespace-pre-line">
                {formatContent(section.content)}
              </div>
            )}
          </div>
        ))}
      </section>
    </>
  );
};

export default PQR;
