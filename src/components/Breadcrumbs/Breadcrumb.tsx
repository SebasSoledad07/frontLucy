import { Link } from 'react-router-dom';
import { useUserContext } from '../../Context/UserContext';
interface BreadcrumbProps {
  pageName: string;
  lastPage:string;
}
const Breadcrumb = ({ pageName , lastPage  }: BreadcrumbProps) => {
  const {modulo} = useUserContext();
    // Función para capitalizar la primera letra
    const capitalizeFirstLetter = (str: string) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };
  
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {pageName}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" to={`/${modulo}/${lastPage}`}>
             {capitalizeFirstLetter(lastPage)} /
            </Link>
          </li>
          <li className="font-medium text-primary">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
