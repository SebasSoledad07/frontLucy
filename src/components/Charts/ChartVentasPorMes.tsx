import ReactApexChart from 'react-apexcharts';
import { FC } from 'react';

interface Props {
  data: { mes: number; total: number }[];
}

const monthNames = [
  '',
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const ChartVentasPorMes: FC<Props> = ({ data }) => {
  // Prepare chart data
  const categories = data.map((row) => monthNames[row.mes]);
  const seriesData = data.map((row) => row.total);
  const maxValue = Math.max(...seriesData, 0);
  const yAxisMax = maxValue > 0 ? maxValue : undefined;

  const options = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '40%',
        distributed: true,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `$${val.toLocaleString()}`,
    },
    xaxis: {
      categories,
      labels: {
        style: {
          fontSize: '14px',
        },
      },
    },
    yaxis: {
      min: 0,
      max: yAxisMax,
      forceNiceScale: true,
      labels: {
        formatter: (val: number) => `$${val.toLocaleString()}`,
        style: {
          fontSize: '14px',
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `$${val.toLocaleString()}`,
      },
    },
    colors: ['#B695E0'],
  };

  return (
    <div className="bg-white shadow my-4 p-4 rounded">
      <h2 className="mb-2 font-bold text-lg">Ventas por Mes</h2>
      {data.length === 0 ? (
        <div className="text-gray-500">No hay datos para mostrar.</div>
      ) : (
        <ReactApexChart
          options={options}
          series={[{ name: 'Total', data: seriesData }]}
          type="bar"
          height={350}
        />
      )}
    </div>
  );
};

export default ChartVentasPorMes;
