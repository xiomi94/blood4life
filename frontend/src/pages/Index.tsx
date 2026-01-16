import Logo from "../assets/images/LogoShadow.webp";
import HeroImage from "../assets/images/blood_donation_hero.png";

function Index() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full p-4 sm:p-8">

        {/* Header Section */}
        <div className="text-center mb-12">
          <img
            className="h-20 w-auto mx-auto mb-4"
            src={Logo}
            alt="Blood4Life Logo"
          />
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
            Blood4Life
          </h1>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Text Content */}
          <div className="space-y-6 text-lg text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
            <p className="indent-8">
              Creemos que donar sangre debería ser un proceso sencillo, accesible y bien organizado.
              Nuestra plataforma nace con un objetivo claro: conectar a personas solidarias con hospitales que necesitan donaciones, facilitando la comunicación y la participación en campañas de donación de sangre.
            </p>

            <p className="indent-8">
              Actuamos como un punto de encuentro digital entre hospitales y donantes. Los centros sanitarios pueden publicar sus campañas activas, informar sobre sus necesidades y gestionar citas, mientras que los donantes pueden inscribirse fácilmente, consultar campañas disponibles o concertar una cita en el hospital que prefieran.
            </p>

            <p className="indent-8">
              Nuestro compromiso es mejorar la eficiencia del proceso de donación, reducir la falta de información y fomentar una cultura de solidaridad continua. Cada donación cuenta, y creemos que la tecnología puede marcar la diferencia cuando se pone al servicio de la salud y la sociedad.
            </p>
          </div>

          {/* Hero Image */}
          <div className="flex justify-center">
            <img
              src={HeroImage}
              alt="Donación de sangre y conexión"
              className="w-full max-w-md h-auto object-contain rounded-2xl drop-shadow-xl dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-transform duration-500"
            />
          </div>
        </div>

        {/* Footer Slogan */}
        <div className="mt-16 text-center border-t border-gray-200 dark:border-gray-700 pt-8">
          <p className="text-2xl font-semibold text-red-600 dark:text-red-500 italic">
            "Porque donar sangre salva vidas,<br />
            nosotros ponemos la conexión."
          </p>
        </div>

      </div>
    </div>
  );
}

export default Index;