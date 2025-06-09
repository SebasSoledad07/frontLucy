import React, { useRef, useState } from 'react';
import { useClienteContext } from '../../../Context/ClienteContext';
import PageTitle from '../../../components/PageTitle';

interface Pregunta {
  id: number;
  pregunta: string;
  respuesta: string;
}
[];

const FaqsCard: React.FC<Pregunta> = ({ pregunta, respuesta }) => {
  const answerElRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState(false);
  const [answerH, setAnswerH] = useState('0px');

  const handleOpenAnswer = () => {
    if (answerElRef.current) {
      const answerElH = answerElRef.current.scrollHeight;
      setState(!state);
      setAnswerH(`${state ? 0 : answerElH + 20}px`);
    }
  };

  return (
    <div>
      <PageTitle title="Lucy Mundo de Pijamas | Preguntas Frecuentes" />
      <div
        className="space-y-3 mt-5 overflow-hidden border-b"
        onClick={handleOpenAnswer}
      >
        <h4 className="cursor-pointer pb-5 flex items-center justify-between text-lg text-gray-700 font-medium">
          {pregunta}
          {state ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          )}
        </h4>
        <div
          ref={answerElRef}
          className="duration-300"
          style={state ? { height: answerH } : { height: '0px' }}
        >
          <div>
            <p className="text-gray-500">{respuesta}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Faqs: React.FC = () => {
  const { preguntas } = useClienteContext();
  console.log(preguntas);
  return (
    <section className="leading-relaxed max-w-screen-xl mt-12 mx-auto px-4 md:px-8">
      <div className="space-y-3 text-center">
        <h1 className="text-3xl text-gray-800 font-semibold">
          Preguntas frecuentes
        </h1>
        {/* <p className="text-gray-600 max-w-lg mx-auto text-lg">
          Respondimos todas las preguntas frecuentes. ¿Aún tienes dudas? No
          dudes en contactarnos.
        </p> */}
      </div>
      <div className="mt-14 max-w-2xl mx-auto">
        {preguntas && preguntas.length > 0 ? (
          preguntas.map((item) => (
            <FaqsCard
              key={item.id}
              id={item.id || 0}
              pregunta={item.pregunta}
              respuesta={item.respuesta}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center">
            No hay preguntas frecuentes disponibles.
          </p>
        )}
      </div>
    </section>
  );
};

export default Faqs;
