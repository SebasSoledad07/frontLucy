import { useState, ReactNode } from 'react';
import Header from '../components/Header/index';
import Sidebar from '../components/Sidebar/index';
import { UserProvider } from '../Context/UserContext';
import { ProductoProvider } from '../Context/ProductoContext';
import { UsuariosProvider } from '../Context/UsuariosContext';
import { PedidoProvider } from '../Context/PedidoContext';
// 👈 importante

interface DefaultLayoutProps {
  children: ReactNode;
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <UsuariosProvider>
      <PedidoProvider>
        <ProductoProvider>
          <UserProvider>
            <div className="min-h-screen dark:bg-boxdark-2 dark:text-bodydark">
              <div className="flex h-screen overflow-hidden">
                <Sidebar
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                />

                <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                  <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                  />
                  <main>
                    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                      {children}
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
