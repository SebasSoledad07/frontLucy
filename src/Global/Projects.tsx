
import itsolutionsLogo from '../images/logo/itsolutions-nyc.png';

const projects = [
  {
    name: 'IT Solutions NYC',
    url: 'https://www.itsolutions-nyc.com/',
    description:
      'Our official website where we showcase our range of IT services and innovative solutions to meet various business needs.',
    logo: itsolutionsLogo,
  },
  {
    name: 'Excel Specialist',
    url: 'https://shop.itsolutions-nyc.com/excel-specialist',
    description:
      'A platform offering specialized Excel services, tools, and products to streamline data management and analytics for businesses.',
    logo: 'https://shop.itsolutions-nyc.com/mailgo.svg',
  },
  {
    name: 'Via Partners',
    url: 'https://www.viapartners.cl/',
    description:
      'A strategic partner website designed to provide consultancy and support for various business solutions in the Chilean market.',
    logo: 'https://www.viapartners.cl/viapartners.svg',
  },
];

const Projects = () => {
  return (
    <div className="p-4">
      <div className="h-72 overflow-y-auto flex flex-col-reverse gap-8">
        {projects.map((project, index) => (
          <div
            key={index}
            className="transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
          >
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="bg-white p-6 rounded-lg border border-blue-100 hover:border-coral-300 transition-colors duration-300">
                <img
                  src={project.logo}
                  alt={`${project.name} Logo`}
                  className="w-36 h-36 mx-auto object-contain p-2 group-hover:opacity-90 transition-opacity"
                />
                <p className="text-lg font-bold text-blue-900 text-center group-hover:text-coral-500 transition-colors duration-300 mt-4">
                  {project.name}
                </p>
                <p className="mt-2 text-blue-800 text-center text-sm">
                  {project.description}
                </p>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
