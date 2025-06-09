import MetodosDePago from './Inicio/MetodosPago/MetodosPago';
import Categorias from './Inicio/Categorias/Categorias';
import PageTitle from '../../components/PageTitle';
import Hero from './Inicio/Hero/Hero';

export default function Inicio() {
  return (
    <>
      <PageTitle title="Lucy Mundo de Pijamas" />
      <Hero />
      <MetodosDePago />
      <div className="flex justify-center">
        <Categorias />
      </div>
    </>
  );
}
