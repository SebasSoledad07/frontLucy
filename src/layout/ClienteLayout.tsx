import { useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

import NavbarCheckout from '../components/Navbar/NavbarCheckout';
import NavbarCliente from '../components/Navbar/NavbarCliente';
import FooterCliente from '../components/Footer/FooterCliente';
import BannerCliente from '../components/Banner/BannerCliente';
import { ProductoProvider } from '../Context/ProductoContext';
import { ClienteProvider } from '../Context/ClienteContext';
import { UserProvider } from '../Context/UserContext';

const ClienteLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation(); // Obtiene la ruta actual
  const isPagoRoute = location.pathname === '/cliente/pago'; // Compara la ruta actual

  return (
    <main className="dark:bg-slate-900 dark:text-bodydark">
      <ClienteProvider>
        <ProductoProvider>
          <UserProvider>
            <BannerCliente />
            {!isPagoRoute ? <NavbarCliente /> : <NavbarCheckout />}
            <div className="mx-auto p-4 md:p-6 2xl:p-10 max-w-screen-2xl">
              {children}
            </div>
            {!isPagoRoute && <FooterCliente />}
          </UserProvider>
        </ProductoProvider>
      </ClienteProvider>
    </main>
  );
};

export default ClienteLayout;
