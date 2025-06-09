import { ReactNode } from 'react';
import BannerCliente from '../components/Banner/BannerCliente';
import FooterCliente from '../components/Footer/FooterCliente';
import NavbarCliente from '../components/Navbar/NavbarCliente';
import { ClienteProvider } from '../Context/ClienteContext';
import { useLocation } from 'react-router-dom';
import NavbarCheckout from '../components/Navbar/NavbarCheckout';

const ClienteLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation(); // Obtiene la ruta actual
  const isPagoRoute = location.pathname === '/cliente/pago'; // Compara la ruta actual

  return (
    <main className="dark:bg-slate-900 dark:text-bodydark">
      <ClienteProvider>
        <BannerCliente />
        {!isPagoRoute ? <NavbarCliente /> : <NavbarCheckout />}
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
          {children}
        </div>
        {!isPagoRoute && <FooterCliente />}
      </ClienteProvider>
    </main>
  );
};

export default ClienteLayout;
