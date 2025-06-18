import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

import AuthLayout from './AuthLayout'; // Asegúrate de importar correctamente

// Asegúrate de importar correctamente

// Asegúrate de importar correctamente

// Asegúrate de importar correctamente

// Asegúrate de importar correctamente

// Asegúrate de importar correctamente

// Asegúrate de importar correctamente

// Asegúrate de importar correctamente

// Asegúrate de importar correctamente

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  async function save(event: { preventDefault: () => void }) {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    // Use environment variables for API URL
    const API_URL =
      (import.meta.env.MODE === 'production'
        ? import.meta.env.VITE_URL_BACKEND_PROD
        : import.meta.env.VITE_URL_BACKEND_LOCAL) + '/login';
    try {
      const response = await axios.post(API_URL, {
        email,
        password,
      });

      if (response.status === 200) {
        setSuccessMessage('Inicio de sesión exitoso');
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('rol', response.data.rol);

        setTimeout(() => {
          if (response.data.rol === 'ROLE_ADMINISTRADOR') {
            window.location.href = '/admin';
          } else if (response.data.rol === 'ROLE_CLIENTE') {
            window.location.href = '/cliente';
          }
        }, 1000);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError('Error de autenticación. Verifica tus credenciales.');
      } else {
        setError('Error de red. Intenta nuevamente más tarde.');
      }
    }
  }

  /* const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      const { token, rol } = await login(email, password); // Usamos login del context

      if (token) {
        if (from) {
          navigate(from, { replace: true }); // Redirige a donde intentó ir
        } else if (rol === 'ROLE_ADMINISTRADOR') {
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
*/
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
          {successMessage && (
            <div className="mb-4 text-red-500">{successMessage}</div>
          )}

          <form onSubmit={save}>
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
            <div className="mt-4 text-center">
              <Link
                to="/cliente/registrar-cliente"
                className="ml-2 text-primary hover:underline"
              >
                ¿No tienes cuenta? Regístrate
              </Link>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Login;
