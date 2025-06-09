import { useEffect, useState } from 'react';
import { FaShoppingBag } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useColorMode from '../../hooks/useColorMode';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { useClienteContext } from '../../Context/ClienteContext';
import Drawer from './Drawer';

const NavbarCliente = () => {
  const [state, setState] = useState(false);
 
  const { carrito,  drawerOpen,
    setDrawerOpen} = useClienteContext();
  // Replace javascript:void(0) path with your path
  const navigation = [
    { title: 'Inicio', path: '/cliente' },
    { title: 'Productos', path: '/cliente/productos' },
    { title: 'PQR', path: '/cliente/pqr' },
    { title: 'Login', path: '/cliente/login' },
  ];
  const [colorMode, setColorMode] = useColorMode();
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
      <nav className="bg-white w-full border-b border-blue-100 shadow-sm md:border-0 md:static dark:bg-blue-950">
        <div className="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-8">
          {/* Logo y menú móvil */}
          <div className="flex items-center justify-between py-3 md:py-5 md:block">
            <div className="flex items-center gap-2">
              <img
                src="/logo.png"
                className="rounded-full"
                width={30}
                height={50}
                alt="KINGO Pijamas Logo"
              />
              <strong className="font-bold text-blue-900 text-2xl dark:text-blue-100">
               Lucy Mundo de Pijamas
              </strong>
            </div>

            <div className="md:hidden">
              <button
                className="text-blue-900 outline-none p-2 rounded-md focus:border-blue-400 focus:border dark:text-blue-100"
                onClick={() => setState(!state)}
                aria-label="Toggle menu"
              >
                {state ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
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
                    className="h-6 w-6"
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
            <ul className="justify-center items-center space-y-8 md:flex md:space-x-6 md:space-y-0">
              {navigation.map((item, idx) => {
                return (
                  <li
                    key={idx}
                    className="text-dark  hover:text-indigo-900 font-medium hover:underline"
                  >
                    <Link to={item.path}>{item.title}</Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="inline-block flex justify-center">
            <div className="flex items-center gap-4">
              {/* Botón carrito */}
              <button
                className="bg-blue-900 text-white rounded-md shadow py-3 px-4 hover:bg-blue-800 relative transition-colors dark:bg-blue-700 dark:hover:bg-blue-600"
                title="Carrito"
                onClick={() => setDrawerOpen(true)}
                aria-label="Abrir carrito"
              >
                <FaShoppingBag />
                {carrito && carrito.length > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-coral-500 rounded-full transform translate-x-1/2 -translate-y-1/2">
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
