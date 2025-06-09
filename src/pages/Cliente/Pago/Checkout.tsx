import { useEffect, useState } from 'react';
import axios from 'axios';
import MetodoPago from './MetodosPago/MetodoPago';
import Productos from './Productos/Productos';
import MetodoEnvio from './MetodosEnvio/MetodoEnvio';
import { useClienteContext } from '../../../Context/ClienteContext';
import Loader from '../../../common/Loader';
import ListaExperiencias from './Experiencias/ListaExperiencias';
import { useNavigate } from 'react-router-dom';

interface Department {
  id: number;
  name: string;
}

interface City {
  id: number;
  name: string;
}

const Checkout = () => {
  const BASE_URL = import.meta.env.VITE_URL_BACKEND_LOCAL;
  const [departments, setDepartments] = useState<Department[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const { carrito, vaciarCarrito} = useClienteContext();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // Fetch departments from API-Colombia
    axios
      .get('https://api-colombia.com/api/v1/Department')
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => {
        console.error('Error fetching departments:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      // Fetch cities based on selected department
      axios
        .get(
          `https://api-colombia.com/api/v1/Department/${selectedDepartment}/cities`,
        )
        .then((response) => {
          setCities(response.data);
        })
        .catch((error) => {
          console.error('Error fetching cities:', error);
        });
    } else {
      setCities([]);
    }
  }, [selectedDepartment]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Recopilar datos del formulario
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const departmentId = parseInt(data.department as string, 10);
    const departamento =
      departments?.find((department) => department.id === departmentId)?.name ||
      '';
    // Convertir los datos en un objeto de tipos correctos
    const formValues = {
      email: data.email ,
      nombre: data.first_name ,
      apellido: data.last_name ,
      documento: data.id_number ,
      departamento: departamento,
      ciudad: data.city ,
      direccion: data.address ,
      apartamento: data.apartment ,
      celular: data.phone ,
      postalCode: data.postal_code ,
      metodoPago: data.payment ,
    };

    console.log('Formulario enviado:', formValues);
    const productos = carrito?.map((item) => ({
      producto: { id: item.id },
      cantidad: item.cantidad,
    }));
    console.log(productos);
    const factura = {
      metodoPago: data.payment ,
      productos: productos,
      cliente: formValues,
    };
    console.log(factura);
    saveFactura(factura as any);

    
    // Aquí puedes enviar los datos al servidor usando axios u otro método
  };
  const navigate = useNavigate();
  const saveFactura = async (factura: any ) => {
    try {
      setLoading(true)
      const headers = {
        'Content-Type': 'application/json',
      };
      // Solicitud para obtener los productos
      const facturaResponse = await axios.post(`${BASE_URL}factura/cliente/save`, factura, {
        headers,
      });
      console.log(facturaResponse)
      if(facturaResponse.data.success){
        alert('Pedido pagado exitosamente');
        vaciarCarrito();
        navigate('/cliente/pedido/'+facturaResponse.data.data.ref);
        
      }else {
        alert(facturaResponse.data.msg);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="grid sm:grid-cols-2 gap-2 bg-white dark:bg-slate-900 ">
      {/* Primera columna: Formulario */}
      {loading && <Loader/>}
      <div
        style={{
          overflowY: 'auto',
          maxHeight: '750px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <form className="max-w-xl mx-auto " onSubmit={handleSubmit}>
          <h1 className="text-2xl font-bold mb-4">Contacto</h1>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="email"
              name="email"
              id="email"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="email"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0"
            >
              Correo Electrónico
            </label>
          </div>
          <h1 className="text-2xl font-bold mb-4">Entrega</h1>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="country"
              id="country"
              value="Colombia"
              readOnly
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent   border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            />
            <label
              htmlFor="country"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0"
            >
              País / Región
            </label>
          </div>

          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="text"
                name="first_name"
                id="first_name"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="first_name"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0"
              >
                Nombre
              </label>
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="text"
                name="last_name"
                id="last_name"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="last_name"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0"
              >
                Apellidos
              </label>
            </div>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="id_number"
              id="id_number"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="id_number"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0"
            >
              Cédula o NIT
            </label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <select
              name="department"
              id="department"
              className="block py-2.5 px-0 w-full text-sm text-gray-900   dark:bg-slate-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              required
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="" disabled selected>
                Selecciona un departamento
              </option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <select
              name="city"
              id="city"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 dark:bg-slate-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              required
            >
              <option value="" disabled selected>
                Selecciona una ciudad
              </option>
              {cities.map((city) => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="address"
              id="address"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="address"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0"
            >
              Dirección
            </label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="apartment"
              id="apartment"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="apartment"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0"
            >
              Casa, apartamento, etc. (opcional)
            </label>
          </div>
          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="tel"
                name="phone"
                id="phone"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="phone"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0"
              >
                Teléfono
              </label>
            </div>
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="text"
                name="postal_code"
                id="postal_code"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />
              <label
                htmlFor="postal_code"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0"
              >
                Código postal (opcional)
              </label>
            </div>
          </div>
          <MetodoEnvio />
          <MetodoPago />
          <div className="relative z-0 w-full mb-5 mt-3 group">
            <button
              type="submit"
              className="text-white w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              PAGAR AHORA
            </button>
          </div>
        </form>
      </div>
      {/* Segunda columna: Espacio adicional */}
     <div>
     <Productos />
      
      <ListaExperiencias />
     </div>
    </div>
  );
};

export default Checkout;
