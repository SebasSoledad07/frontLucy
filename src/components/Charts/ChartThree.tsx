
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const ChartThree = ({ productSales }: { productSales: any[] }) => {
  const series = productSales.map((item: any) => item.cantidad);
  const labels = productSales.map((item: any) => item.name);

  const options: ApexOptions = {
    chart: {
      type: "donut",
      height: 350, // Altura del gráfico
      toolbar: {
        show: true, // Muestra las opciones para exportar el gráfico
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
    },
    colors: ["#3C50E0", "#6577F3", "#8FD0EF", "#0FADCF"], // Paleta de colores personalizada
    labels, // Etiquetas dinámicas basadas en los datos
    plotOptions: {
      pie: {
        donut: {
          size: "65%", // Tamaño del centro del donut
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "22px",
              fontFamily: "Helvetica, Arial, sans-serif",
              color: "#333",
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: "16px",
              fontFamily: "Helvetica, Arial, sans-serif",
              color: "#666",
              offsetY: 16,
              formatter: (val) => `${val}%`, // Formato para valores
            },
            total: {
              show: true,
              label: "Total",
              color: "#333",
              formatter: () => productSales.reduce((sum, item) => sum + item.cantidad, 0).toString(), // Total dinámico
            },
          },
        },
      },
    },
    legend: {
      show: true, // Mostrar leyenda
      position: "bottom", // Ubicación de la leyenda
      horizontalAlign: "center",
      labels: {
        colors: ["#333"], // Color de las etiquetas de la leyenda
      },
    },
    responsive: [
      {
        breakpoint: 480, // Configuración específica para pantallas pequeñas
        options: {
          chart: {
            width: 300, // Ajusta el ancho
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    dataLabels: {
      enabled: true, // Mostrar etiquetas en los segmentos
      style: {
        fontSize: "14px",
        fontFamily: "Helvetica, Arial, sans-serif",
        colors: ["#333"],
      },
      formatter: (val: number) => `${val.toFixed(1)}%`, // Formato de porcentaje
    },
    tooltip: {
      enabled: true, // Activar tooltips
      theme: "dark",
      y: {
        formatter: (val: number) => `${val} unidades`, // Formato de tooltip
      },
    },
  };

  return (
    <div className="chart-container bg-white mb-3 shadow-default dark:bg-boxdark">
      <ReactApexChart options={options} series={series} type="donut" height={400} />
    </div>
  );
};

export default ChartThree;
