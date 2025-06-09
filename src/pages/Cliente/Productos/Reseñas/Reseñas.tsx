import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface Review {
  username: string;
  rating: number; // Calificación en estrellas (1-5)
  comment: string;
}

const fakeReviews: Review[] = [
  {
    username: "Juan Pérez",
    rating: 5,
    comment: "Excelente producto, cumple con lo prometido. Muy recomendado.",
  },
  {
    username: "María López",
    rating: 4.5,
    comment: "El producto es bueno, pero la entrega tardó más de lo esperado.",
  },
  {
    username: "Carlos Gómez",
    rating: 3,
    comment: "El producto es aceptable, aunque esperaba mejor calidad.",
  },
  {
    username: "Ana Torres",
    rating: 4,
    comment: "Muy buen producto. Relación calidad-precio insuperable.",
  },
];

const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} className="text-yellow-500" />);
    } else if (rating > i - 1) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-gray-400" />);
    }
  }
  return stars;
};

const Reseñas: React.FC = () => {
  return (
    <div className="w-full mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Reseñas del Producto ({fakeReviews.length})</h2>
      <div className="space-y-6 rounded-lg shadow-sm bg-white">
        {fakeReviews.map((review, index) => (
          <div
            key={index}
            className="border-t p-3 transition"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{review.username}</h3>
              <div className="flex space-x-1">{renderStars(review.rating)}</div>
            </div>
            <p className="mt-2 text-gray-600">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reseñas;
