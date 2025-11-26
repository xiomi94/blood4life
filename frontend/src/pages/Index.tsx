import Logo from "../assets/images/LogoShadow.webp";

function Index() {
  return (
    <div className="flex flex-col flex-grow items-center justify-center text-center px-4 sm:px-6 md:px-8">
      <img
        className="m-6 w-40 sm:w-56 md:w-72 lg:w-96 h-auto"
        src={Logo}
        alt="Logo"
      />
      <h1 className="text-h1 sm:text-h2 md:text-h1 lg:text-display text-gray-800">
        Blood4Life
      </h1>
    </div>
  );
}

export default Index;