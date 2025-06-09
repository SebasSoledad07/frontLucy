import React from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FaFilePdf } from 'react-icons/fa';

interface Producto {
  cantidad: number;
  precio: number;
  total: number;
  producto: {
    nombre: string;
  };
}

interface Factura {
  id: number;
  cliente: {
    nombre: string;
    apellido: string;
    email: string;
    documento: string;
    departamento: string;
    ciudad: string;
    direccion: string;
    celular: string;
  };
  productos: Producto[];
  total: number;
  fechaRegistro: string | null;
  ref: string;
}

const FacturaPDF: React.FC<{ factura: Factura }> = ({ factura }) => {
  const generatePDF = async () => {
    const doc = new jsPDF();

    // Cargar logo de la empresa
    const logoUrl = '';
    const logo = await fetch(logoUrl)
      .then((res) => res.blob())
      .then((blob) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      });

    // Agregar encabezado
    doc.addImage(logo, 'PNG', 10, 10, 30, 30); // Logo (x, y, width, height)
    doc.setFontSize(18);
    doc.text('Lucy Mundo de Pijamas', 50, 20);
    doc.setFontSize(12);
    doc.text('Factura Digital', 50, 35);
    doc.text(`${new Date().toLocaleDateString()}`, 50, 40);

    // Información del cliente
    doc.setFontSize(12);
    doc.text(
      `Cliente: ${factura.cliente.nombre} ${factura.cliente.apellido}`,
      14,
      60,
    );
    doc.text(`Documento: ${factura.cliente.documento}`, 14, 67);
    doc.text(`Correo Electronico: ${factura.cliente.email}`, 14, 74);
    doc.text(`Fecha de Facturacíon: ${factura.fechaRegistro?.split('T')[0]}`, 14, 81);

    // Productos
    const productos = factura.productos.map((p) => [
      p.producto.nombre,

      `$${p.precio.toFixed(2)}`,
      p.cantidad,
      `$${p.total.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 100,
      head: [['Producto', 'Precio Unitario', 'Cantidad', 'Subtotal']],
      body: productos,
    });

    // Total
    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(14);
    doc.text(`Total: $${factura.total.toFixed(2)}`, 130, finalY + 10);
    doc.setFontSize(12);
    doc.text(`Dirección de envio`, 14, finalY + 17);
    doc.text(
      `${factura.cliente.nombre} ${factura.cliente.apellido}`,
      14,
      finalY + 24,
    );
    doc.text(
      `${factura.cliente.departamento} , ${factura.cliente.ciudad}`,
      14,
      finalY + 31,
    );
    doc.text(`${factura.cliente.celular}`, 14, finalY + 38);
    doc.text(
      `Realiza el seguimiento a tu pedido en nuestra pagina web`,
      14,
      finalY + 55,
    );
    doc.text(
      `https://tekcam-frontend.vercel.app/cliente/pedido/${factura.ref}`,
      14,
      finalY + 62,
    );

    // Descargar PDF
    doc.save(`Factura-${factura.id}.pdf`);
  };

  return (
    <div>
      <button
        onClick={generatePDF}
        className="px-2 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        <FaFilePdf />
      </button>
    </div>
  );
};

export default FacturaPDF;
