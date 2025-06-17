import axios from 'axios';

// Use environment variables for API URL
const API_URL =
  (import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_URL_BACKEND_PROD
    : import.meta.env.VITE_URL_BACKEND_LOCAL) + '/productos/todos';

class ProductoService {
  async getAllProductos() {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching productos:', error);
      throw error;
    }
  }

  async getProductoById(id: string) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching producto with id ${id}:`, error);
      throw error;
    }
  }
}

export default new ProductoService();
