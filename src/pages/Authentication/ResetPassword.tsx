import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';

import Loader from '../../common/Loader';
import AuthLayout from './AuthLayout';

const MAX_ATTEMPTS = 5;
const MIN_PASSWORD_LENGTH = 4;

const ResetPassword: React.FC = () => {
  const BASE_URL =
    import.meta.env.MODE === 'production'
      ? import.meta.env.VITE_URL_BACKEND_PROD
      : import.meta.env.VITE_URL_BACKEND_LOCAL;
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<'request' | 'verify' | 'reset'>('request');
  const [attempts, setAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Step 1: Request password reset (send email)
  const handleSubmitRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/password-reset/request`,
        {
          email: email.trim(),
        },
      );
      // If backend returns 202, continue to code step
      if (response.status === 202) {
        setStep('verify');
      } else {
        setErrorMessage('Error al enviar el email');
      }
    } catch (error) {
      setErrorMessage('Error al enviar el email');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify code
  const handleSubmitVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/password-reset/verify`,
        {
          email: email.trim(),
          codigo: codigo.trim(),
        },
      );
      // If backend returns 200, continue to change password
      if (response.status === 200) {
        setStep('reset');
      } else {
        setErrorMessage(response.data?.msg || 'Código incorrecto');
      }
    } catch (error) {
      setErrorMessage('Error al verificar el código');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password
  const handleSubmitReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    if (attempts >= MAX_ATTEMPTS) {
      setErrorMessage('Máximo de intentos alcanzado');
      return;
    }
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
    setLoading(true);
    try {
      setAttempts(attempts + 1);
      if (attempts + 1 >= MAX_ATTEMPTS) {
        setErrorMessage('Máximo de intentos alcanzado');
      }
      const response = await axios.post(
        `${BASE_URL}/api/auth/password-reset/reset`,
        {
          email: email.trim(),
          codigo: codigo.trim(),
          newPassword: password,
        },
      );
      // If backend returns 200 or 204, go back to /cliente/login
      if (response.status === 200 || response.status === 204) {
        navigate('/cliente/login');
      } else {
        setErrorMessage(response.data?.msg || 'Error al cambiar la contraseña');
      }
    } catch (error: any) {
      // If error is due to OPTIONS 200, treat as success
      if (
        error?.response?.status === 200 &&
        error?.response?.config?.method === 'options'
      ) {
        navigate('/cliente/login');
      } else {
        setErrorMessage('Error al cambiar la contraseña');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {loading && <Loader />}
      <div className="border-stroke dark:border-strokedark xl:border-l-2 w-full xl:w-1/2">
        <div className="p-4 sm:p-12.5 xl:p-17.5 w-full">
          <span className="block mb-1.5 font-medium">
            Lucy Mundo de Pijamas
          </span>
          <h2 className="mb-3 font-bold text-black sm:text-title-xl2 dark:text-white text-2xl">
            Recuperar Contraseña
          </h2>
          {step === 'request' && (
            <form onSubmit={handleSubmitRequest}>
              <p>Ingrese su email, se enviará un código de 6 dígitos.</p>
              <div className="mb-4">
                <label className="block mb-2.5 font-medium text-black dark:text-white">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ingrese su  email"
                    className="bg-transparent dark:bg-form-input focus-visible:shadow-none py-4 pr-10 pl-6 border border-stroke focus:border-primary dark:focus:border-primary dark:border-form-strokedark rounded-lg outline-none w-full text-black dark:text-white"
                    required
                  />
                </div>
              </div>
              {errorMessage && (
                <p className="mb-3 text-red-500">{errorMessage}</p>
              )}
              <div className="mb-5">
                <input
                  type="submit"
                  value="Enviar email"
                  className="bg-primary hover:bg-opacity-90 p-4 border border-primary rounded-lg w-full text-white transition cursor-pointer"
                />
              </div>
            </form>
          )}
          {step === 'verify' && (
            <form onSubmit={handleSubmitVerify}>
              <p>
                Ingrese el código de 6 dígitos que recibiste al email {email}
              </p>
              <div className="mb-4">
                <label className="block mb-2.5 font-medium text-black dark:text-white">
                  Código
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={codigo}
                    minLength={6}
                    onChange={(e) => setCodigo(e.target.value)}
                    placeholder="Ingrese el código"
                    className="bg-transparent dark:bg-form-input focus-visible:shadow-none py-4 pr-10 pl-6 border border-stroke focus:border-primary dark:focus:border-primary dark:border-form-strokedark rounded-lg outline-none w-full text-black dark:text-white"
                    required
                  />
                </div>
              </div>
              {errorMessage && (
                <p className="mb-3 text-red-500">{errorMessage}</p>
              )}
              <div className="mt-4 mb-5">
                <input
                  type="submit"
                  value="Verificar código"
                  className="bg-primary hover:bg-opacity-90 p-4 border border-primary rounded-lg w-full text-white transition cursor-pointer"
                />
              </div>
            </form>
          )}
          {step === 'reset' && (
            <form onSubmit={handleSubmitReset}>
              <p>Ingrese su nueva contraseña</p>
              <div className="mb-4">
                <label className="block mb-2.5 font-medium text-black dark:text-white">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingrese su nueva contraseña"
                    className="bg-transparent dark:bg-form-input focus-visible:shadow-none py-4 pr-10 pl-6 border border-stroke focus:border-primary dark:focus:border-primary dark:border-form-strokedark rounded-lg outline-none w-full text-black dark:text-white"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block mb-2.5 font-medium text-black dark:text-white">
                  Repetir Contraseña
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-ingrese su nueva contraseña"
                    className="bg-transparent dark:bg-form-input focus-visible:shadow-none py-4 pr-10 pl-6 border border-stroke focus:border-primary dark:focus:border-primary dark:border-form-strokedark rounded-lg outline-none w-full text-black dark:text-white"
                  />
                </div>
              </div>
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              <div className="mt-4 mb-5">
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
