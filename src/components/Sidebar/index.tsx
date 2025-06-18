import { AiOutlineDashboard, AiOutlineUser, AiFillDropboxSquare, } from 'react-icons/ai';
import { FaFileInvoiceDollar, FaQuestionCircle } from 'react-icons/fa';
import { Link, NavLink, useLocation } from 'react-router-dom';
// src/components/Sidebar.tsx
import React, { useEffect, useRef, useState } from 'react';
import { BiSolidReport } from 'react-icons/bi';

import { useUserContext } from '../../Context/UserContext';
import SidebarLinkGroup from './SidebarLinkGroup';
import Brand from '../../Global/Brand';


interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

interface RouteItem {
  to: string;
  icon: any;
  label: string;
  subRoutes?: RouteItem[];
}

const routesSidebar: RouteItem[] = [
  {
    to: '/admin',
    icon: AiOutlineDashboard,
    label: 'Inicio',
  },
  { to: '/admin/vendedores', icon: AiOutlineUser, label: 'Vendedores' },

  { to: '/admin/stock', icon: AiFillDropboxSquare, label: 'Stock' },
  { to: '/admin/pedidos', icon: FaFileInvoiceDollar, label: 'Pedidos' },
  { to: '/admin/estadisticas', icon: BiSolidReport, label: 'Estadisticas' },

  // {
  //   to: '/admin/ui',
  //   icon: AiFillDropboxSquare,
  //   label: 'Pedidos',
  //   subRoutes: [
  //     { to: '/admin/pedidos/confirmar', icon: null, label: 'Alerts' },
  //     { to: '/admin/ui/buttons', icon: null, label: 'Buttons' },
  //   ],
  // },
];
const routesSidebarVendedor: RouteItem[] = [
  {
    to: '/vendedor',
    icon: AiOutlineDashboard,
    label: 'Inicio',
  },

  { to: '/vendedor/stock', icon: AiFillDropboxSquare, label: 'Stock' },
  { to: '/vendedor/pedidos', icon: FaFileInvoiceDollar, label: 'Pedidos' },

  // {
  //   to: '/admin/ui',
  //   icon: AiOutlineSetting,
  //   label: 'UI Elements',
  //   subRoutes: [
  //     { to: '/admin/ui/alerts', icon: null, label: 'Alerts' },
  //     { to: '/admin/ui/buttons', icon: null, label: 'Buttons' },
  //   ],
  // },
];

const IconLink = ({
  to,
  icon: Icon,
  children,
}: {
  to: string;
  icon: any;
  children: React.ReactNode;
}) => {
  const { pathname } = useLocation();
  return (
    <NavLink
      to={to}
      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
        pathname === to && 'bg-graydark dark:bg-meta-4'
      }`}
    >
      {Icon && <Icon className="fill-current" size={18} />}
      {children}
    </NavLink>
  );
};

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { modulo } = useUserContext();
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [sidebarOpen, setSidebarOpen]);

  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [sidebarOpen, setSidebarOpen]);

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  const routesFiltered =
    modulo === 'vendedor' ? routesSidebarVendedor : routesSidebar;

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-[#B695E0] duration-300 ease-linear lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Brand y botón de cerrar */}
      <div className="flex justify-between items-center gap-2 px-6 py-5.5 lg:py-6.5 border-[#F4B1C7] border-b">
        <Link to={'/' + modulo}>
          <Brand dark={true} />
        </Link>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="lg:hidden block text-[#3A3A3A] hover:text-[#FFFFFF] transition-colors"
        >
          {/* Ícono de cerrar */}
          ...
        </button>
      </div>

      {/* Navegación */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mt-3 lg:mt-1 px-4 lg:px-6 py-4">
          <div>
            <h3 className="mb-4 ml-4 font-semibold text-[#7A5B47] text-sm uppercase tracking-wider">
              MENÚ
            </h3>

            <ul className="flex flex-col gap-1.5 mb-6">
              {routesFiltered.map((route) =>
                route.subRoutes ? (
                  <SidebarLinkGroup
                    key={route.to}
                    activeCondition={
                      pathname === route.to || pathname.includes(route.to)
                    }
                  >
                    {(handleClick, open) => (
                      <React.Fragment>
                        <div
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                          className="hover:bg-[#B199E1] rounded-lg transition-colors"
                        >
                          <IconLink to="#" icon={route.icon}>
                            <span className="text-[#3A3A3A] group-hover:text-white">
                              {route.label}
                            </span>
                            {/* Flecha */}
                            ...
                          </IconLink>
                        </div>
                        <div
                          className={`translate transform overflow-hidden ${
                            !open && 'hidden'
                          }`}
                        >
                          <ul className="flex flex-col gap-1.5 mt-2 mb-5.5 pl-6">
                            {route?.subRoutes?.map((subRoute) => (
                              <li key={subRoute.to}>
                                <NavLink
                                  to={subRoute.to}
                                  className={({ isActive }) =>
                                    `group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out hover:text-white ${
                                      isActive
                                        ? 'bg-[#F4B1C7] text-white'
                                        : 'text-[#F4B1C7] hover:bg-[#FFE482]'
                                    }`
                                  }
                                >
                                  {subRoute.label}
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </React.Fragment>
                    )}
                  </SidebarLinkGroup>
                ) : (
                  <li key={route.to}>
                    <NavLink
                      to={route.to}
                      className={({ isActive }) =>
                        `flex items-center gap-3.5 rounded-lg py-2 px-4 font-medium duration-300 ease-in-out ${
                          isActive
                            ? 'bg-[#F4B1C7] text-white'
                            : 'text-[#3A3A3A] hover:bg-[#79D6D4] hover:text-white'
                        }`
                      }
                    >
                      {route.icon && (
                        <span className="text-lg">
                          <route.icon />
                        </span>
                      )}
                      <span>{route.label}</span>
                    </NavLink>
                  </li>
                ),
              )}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
