import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface Producto {
  cantidad: number;
  factura: number;
  id: number;
  precio: number;
  producto: {
    id: number;
    nombre: string;
    precioVenta: number;
  };
  total: number;
}

interface Factura {
  productos: Producto[];
  fechaRegistro: string | null;
}

interface ChartTwoProps {
  facturas: Factura[];
}

const ChartTwo: React.FC<ChartTwoProps> = ({ facturas }) => {
  const { series, categories } = useMemo(() => {
    const salesByMonth: Record<string, Record<string, number>> = {};

    // Procesar datos
    facturas.forEach((factura) => {
      const month =
        factura.fechaRegistro &&
        new Date(factura.fechaRegistro).toLocaleString("es-ES", { month: "long" });

      if (!month) return;

      factura.productos.forEach((producto) => {
        const productName = producto.producto.nombre;
        const totalVenta = producto.precio * producto.cantidad;

        if (!salesByMonth[month]) {
          salesByMonth[month] = {};
        }
        if (!salesByMonth[month][productName]) {
          salesByMonth[month][productName] = 0;
        }
        salesByMonth[month][productName] += totalVenta;
      });
    });

    // Obtener categorías (meses) y series (productos)
    const months = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];

    const allProducts = Array.from(
      new Set(
        facturas.flatMap((factura) =>
          factura.productos.map((producto) => producto.producto.nombre)
        )
      )
    );

    const series = allProducts.map((productName) => ({
      name: productName,
      data: months.map((month) => salesByMonth[month]?.[productName] || 0),
    }));

    return { series, categories: months };
  }, [facturas]);

  // Configuración del gráfico
  const options: ApexOptions = {
    colors: ["#3C50E0", "#80CAEE", "#F78C6B", "#D4A5A5", "#A29BFE"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "bar",
      height: 335,
      stacked: true,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 5,
        columnWidth: "25%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories,
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "Helvetica, Arial, sans-serif",
        },
      },
    },
    yaxis: {
      title: {
        text: "Precio de venta ($)",
        style: {
          fontSize: "14px",
          fontWeight: "bold",
          color: "#333",
        },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Satoshi",
      fontWeight: 500,
      fontSize: "14px",
      markers: {
        radius: 99,
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val) => `$${val.toFixed(2)}`,
      },
    },
  };

  return (
    <div className="col-span-12 rounded-sm mb-3 border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Ventas por mes
          </h4>
        </div>
      </div>
      <div>
        <ReactApexChart options={options} series={series} type="bar" height={350} />
      </div>
    </div>
  );
};

export default ChartTwo;
