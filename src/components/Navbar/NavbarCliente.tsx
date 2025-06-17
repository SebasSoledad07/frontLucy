import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { FaShoppingBag } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useClienteContext } from '../../Context/ClienteContext';
import useColorMode from '../../hooks/useColorMode';
import Drawer from './Drawer';

const NavbarCliente = () => {
  const [state, setState] = useState(false);

  const { carrito, drawerOpen, setDrawerOpen } = useClienteContext();
  // Replace javascript:void(0) path with your path
  const navigation = [
    { title: 'Inicio', path: '/cliente' },
    { title: 'Productos', path: '/cliente/productos' },
    { title: 'PQR', path: '/cliente/pqr' },
    { title: 'Login', path: '/cliente/login' },
  ];
  const [colorMode, setColorMode] = useColorMode();
  // User info from token
  const [userName, setUserName] = useState<string | null>(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserName(
          payload?.nombre || payload?.name || payload?.username || null,
        );
      } catch (e) {
        setUserName(null);
      }
    } else {
      setUserName(null);
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/cliente';
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const drawerElement = document.getElementById('drawer-example');
      if (
        drawerOpen &&
        drawerElement &&
        !drawerElement.contains(event.target as Node)
      ) {
        setDrawerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [drawerOpen]);
  return (
    <>
      <nav className="md:static bg-white dark:bg-blue-950 shadow-sm md:border-0 border-b border-blue-100 w-full">
        <div className="md:flex items-center mx-auto px-4 md:px-8 max-w-screen-xl">
          {/* Logo y menú móvil */}
          <div className="md:block flex justify-between items-center py-3 md:py-5">
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                className="rounded-full"
                width={30}
                height={50}
                alt="KINGO Pijamas Logo"
              />
              <strong className="font-bold text-blue-900 dark:text-blue-100 text-2xl">
                Lucy Mundo de Pijamas
              </strong>
            </div>

            <div className="md:hidden">
              <button
                className="p-2 focus:border focus:border-blue-400 rounded-md outline-none text-blue-900 dark:text-blue-100"
                onClick={() => setState(!state)}
                aria-label="Toggle menu"
              >
                {state ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8h16M4 16h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div
            className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
              state ? 'block' : 'hidden'
            }`}
          >
            <ul className="md:flex justify-center items-center md:space-x-6 space-y-8 md:space-y-0">
              {navigation.map((item, idx) => {
                return (
                  <li
                    key={idx}
                    className="font-medium text-dark hover:text-indigo-900 hover:underline"
                  >
                    <Link to={item.path}>{item.title}</Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="inline-block flex justify-center">
            <div className="flex items-center gap-4">
              {/* Username and logout before carrito button */}
              {userName && (
                <div className="flex items-center gap-2 mr-2">
                  <span className="font-semibold text-blue-900 dark:text-blue-100">
                    {userName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-800 ml-2 px-2 py-1 rounded text-white text-xs"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
              {/* Botón carrito */}
              <button
                className="relative bg-blue-900 hover:bg-blue-800 dark:bg-blue-700 dark:hover:bg-blue-600 shadow px-4 py-3 rounded-md text-white transition-colors"
                title="Carrito"
                onClick={() => setDrawerOpen(true)}
                aria-label="Abrir carrito"
              >
                <FaShoppingBag />
                {carrito && carrito.length > 0 && (
                  <span className="inline-flex top-0 right-0 absolute justify-center items-center bg-coral-500 rounded-full w-5 h-5 font-semibold text-white text-xs -translate-y-1/2 translate-x-1/2 transform">
                    {carrito?.length}
                  </span>
                )}
              </button>

              <div
                onClick={() => {
                  if (typeof setColorMode === 'function') {
                    setColorMode(colorMode === 'light' ? 'dark' : 'light');
                  }
                }}
              >
                {colorMode === 'dark' ? <MdLightMode /> : <MdDarkMode />}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
};

export default NavbarCliente;
