import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import AuthLayout from './AuthLayout';


function LoginAdmin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || null;

  // Use environment variables for API URL
  const API_URL =
    (import.meta.env.MODE === 'production'
      ? import.meta.env.VITE_URL_BACKEND_PROD
      : import.meta.env.VITE_URL_BACKEND_LOCAL) + '/login';

  async function login(email: string, password: string) {
    const resp = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!resp.ok) {
      throw new Error('Login fallido: ' + resp.status);
    }

    const { token, rol } = await resp.json();

    // 1) Guarda el token y el rol
    localStorage.setItem('token', token); // Cambiado a 'token' para ser consistente
    localStorage.setItem('rol', rol); // Cambiado a 'rol' para ser consistente

    return { token, rol };
  }

  /*const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      //navigate('/admin/dashboard'); // Redirige a la página de inicio del cliente
      // Redirige a la página de inicio del cliente
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    }
  };
  */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      const { token, rol } = await login(email, password); // Usamos login del context

      if (token) {
        if (from) {
          navigate(from, { replace: true }); // Redirige a donde intentó ir
        } if (
          rol === 'ROLE_ADMINISTRADOR' ||
          rol === 'ROLE_GERENTE_DE_VENTA' ||
          rol === 'ROLE_COORDINADOR_DE_FACTURACION' ||
          rol === 'ROLE_PRODUCT_MANAGER'
        ) {
          navigate('/admin', { replace: true });
        } else if (rol === 'ROLE_CLIENTE') {
          navigate('/cliente', { replace: true });
        } else {
          navigate('/unauthorized', { replace: true });
        }
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    }
  };
  return (
    <AuthLayout>
      <div className="border-stroke dark:border-strokedark xl:border-l-2 w-full xl:w-1/2">
        <div className="p-4 sm:p-12.5 xl:p-17.5 w-full">
          <span className="block mb-1.5 font-medium">
            Lucy Mundo de Pijamas
          </span>
          <h2 className="mb-9 font-bold text-black sm:text-title-xl2 dark:text-white text-2xl">
            Iniciar Sesión
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2.5 font-medium text-black dark:text-white">
                Email
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresa tu correo"
                className="bg-transparent dark:bg-form-input py-4 pr-10 pl-6 border border-stroke dark:border-form-strokedark rounded-lg outline-none w-full text-black dark:text-white"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2.5 font-medium text-black dark:text-white">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6+ caracteres, 1 letra mayúscula"
                className="bg-transparent dark:bg-form-input py-4 pr-10 pl-6 border border-stroke dark:border-form-strokedark rounded-lg outline-none w-full text-black dark:text-white"
                required
              />
            </div>

            {error && <div className="mb-4 text-red-500">{error}</div>}

            <div className="mb-5">
              <input
                type="submit"
                value="Iniciar Sesión"
                className="bg-primary hover:bg-opacity-90 p-4 border border-primary rounded-lg w-full text-white transition cursor-pointer"
              />
            </div>

            <Link
              to="/cliente/reset-password"
              className="text-blue-600 hover:text-blue-900"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
export default LoginAdmin;
