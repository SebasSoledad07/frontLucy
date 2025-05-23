import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout'; // Asegúrate de importar correctamente
function LoginAdmin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || null;
  async function login(email: string, password: string) {
    const resp = await fetch('http://13.56.234.70:8080/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!resp.ok) {
      throw new Error('Login fallido: ' + resp.status);
    }

    const { token, rol } = await resp.json();

    // 1) Guarda el token y el rol
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('userRole', rol);

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
  return (
    <AuthLayout>
      <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
        <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
          <span className="mb-1.5 block font-medium">
            Lucy Mundo de Pijamas
          </span>
          <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
            Iniciar Sesión
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Email
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ingresa tu correo"
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
                required
              />
            </div>

            <div className="mb-6">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6+ caracteres, 1 letra mayúscula"
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
                required
              />
            </div>

            {error && <div className="mb-4 text-red-500">{error}</div>}

            <div className="mb-5">
              <input
                type="submit"
                value="Iniciar Sesión"
                className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
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
