import { useMemo } from 'react';


function useFormatCurrency(value: number | undefined) {
  const formattedValue = useMemo(() => {
    if (typeof value !== 'number') {
      return '';
    }

    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }, [value]);

  return formattedValue;
}

export default useFormatCurrency;
