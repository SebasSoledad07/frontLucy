import axios from 'axios';

// Import the Producto type
const API_URL = 'http://localhost:8080/api/productos/todos';

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
