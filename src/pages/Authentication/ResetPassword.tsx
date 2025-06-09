import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import axios from 'axios';
import Loader from '../../common/Loader';


const MAX_ATTEMPTS = 5;
const MIN_PASSWORD_LENGTH = 4;

const ResetPassword: React.FC = () => {
  const BASE_URL = import.meta.env.VITE_URL_BACKEND_LOCAL;
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [uuid, setUuid] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sendEmail, setSendEmail] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const handleSubmitSendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const usuario = {
        email: email.toUpperCase(),
      };
      setLoading(true);
      const emailResponse = await axios.post(
        `${BASE_URL}usuario/email/cambio`,
        usuario,
      );
      console.log(emailResponse);
      if (emailResponse.data.success) {
        setSendEmail(true);
        setUuid(emailResponse.data.data);
      } else {
        setErrorMessage(emailResponse.data.msg);
      }
    } catch (error) {
      console.error('Error al enviar el email:', error);
      setErrorMessage('Error al enviar el email');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitValidateCode = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setErrorMessage('');
    // Verificar si se alcanzó el máximo de intentos
    if (attempts >= MAX_ATTEMPTS) {
      setErrorMessage('Máximo de intentos alcanzado');
      return;
    }

    // Validar contraseñas iguales y longitud mínima
    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setErrorMessage(
        `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`,
      );
      return;
    }

    try {
      // Simular el envío del código con la contraseña
      console.log('Código y contraseña válidos:', { code, password });

      const usuario = {
        codigoCambio: code,
        password,
        uuid,
        email,
      };
      console.log(usuario);
      setAttempts(attempts + 1);

      // Mostrar mensaje de error si se alcanzan los intentos
      if (attempts + 1 >= MAX_ATTEMPTS) {
        setErrorMessage('Máximo de intentos alcanzado');
      }
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}usuario/codigo/cambio`,
        usuario,
      );
      console.log(response);
      if (response.data.success) {
        alert('Contraseña cambiada con éxito');
        navigate('/cliente/login');
      } else {
        setErrorMessage(response.data.msg);
      }
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {loading && <Loader />}
      <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
        <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
          <span className="mb-1.5 block font-medium">Lucy Mundo de Pijamas</span>
          <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
            Recuperar Contraseña
          </h2>
          {!sendEmail ? (
            <form onSubmit={handleSubmitSendEmail}>
              <p>Ingrese su email, se enviará un código de 6 dígitos.</p>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ingrese su  email"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    required
                  />
                </div>
              </div>
              {errorMessage && (
                <p className="text-red-500 mb-3">{errorMessage}</p>
              )}
              <div className="mb-5">
                <input
                  type="submit"
                  value="Enviar email"
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                />
              </div>
              
            </form>
          ) : (
            <form onSubmit={handleSubmitValidateCode}>
              <p>
                Ingrese el código de 6 dígitos que recibiste al email {email}
              </p>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Código
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={code}
                    minLength={6}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Ingrese el código"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Repetir Contraseña
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              <div className="mb-5 mt-4">
                <input
                  type="submit"
                  value="Restablecer Contraseña"
                  className={`w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition ${
                    attempts >= MAX_ATTEMPTS
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-opacity-90'
                  }`}
                  disabled={attempts >= MAX_ATTEMPTS}
                />
              </div>
            </form>
          )}
          <div className="mt-6 text-center">
            <p>
              <Link to="/cliente/login" className="text-primary">
                ¿Iniciar sesión?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
