import { Outlet } from 'react-router-dom';
import { useState } from 'react';

import { UsuariosProvider } from '../Context/UsuariosContext';
import { ProductoProvider } from '../Context/ProductoContext';
import { PedidoProvider } from '../Context/PedidoContext';
import { UserProvider } from '../Context/UserContext';
import Sidebar from '../components/Sidebar/index';
import Header from '../components/Header/index';

const DefaultLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <UsuariosProvider>
      <PedidoProvider>
        <ProductoProvider>
          <UserProvider>
            <div className="dark:bg-boxdark-2 min-h-screen dark:text-bodydark">
              <div className="flex h-screen overflow-hidden">
                <Sidebar
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />

                <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
                  <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                  />
                  <main>
                    <div className="mx-auto p-4 md:p-6 2xl:p-10 max-w-screen-2xl">
                      <Outlet />
                      {/* 👈 Aquí renderizan las rutas hijas */}
                    </div>
                  </main>
                </div>
              </div>
            </div>
          </UserProvider>
        </ProductoProvider>
      </PedidoProvider>
    </UsuariosProvider>
  );
};

export default DefaultLayout;
