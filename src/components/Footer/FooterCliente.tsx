const FooterCliente = () => {
    const footerNavs = [
        { title: 'Inicio', path: '/cliente' },
        { title: 'Productos', path: '/cliente/productos' },
        { title: 'PQR', path: '/cliente/pqr' },
        { title: 'Login', path: '/cliente/login' },
    ];

    return (
        <footer className="bg-[#B695E0] text-white w-full">
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-4">
                    <img src="/logo.png" alt="Logo" className="w-16 h-16 rounded-full border-2 border-blue-100 mx-auto" />
                    <strong className="text-white text-lg block mt-2">Lucy Mundo de Pijamas</strong>
                </div>

                <ul className="flex flex-wrap justify-center mt-6 gap-6">
                    {footerNavs.map((item, idx) => (
                        <li key={idx} className="hover:text-[#F4B1C7] transition-colors">
                            <a href={item.path}>{item.title}</a>
                        </li>
                    ))}
                </ul>

                <div className="mt-8 flex flex-col sm:flex-row sm:justify-between items-center text-sm text-white">
                    <div className="text-center sm:text-left">
                        &copy; {new Date().getFullYear()} Todos los derechos reservados por <span className="font-semibold">Lucy Mundo de Pijamas</span>.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default FooterCliente;
