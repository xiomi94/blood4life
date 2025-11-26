import ButtonFooter from '../../UI/ButtonFooter/ButtonFooter'

function Footer() {

  return(
    <div className="w-full mx-auto">
      <footer className="p-4 rounded-lg md:flex md:items-center md:justify-between md:p-6 bg-gray-100">
        <p className="text-sm text-gray-500 sm:text-center text-gray-600">© 2025. Todos los derechos reservados.
        </p>
        <div className="flex flex-wrap items-center mt-3 sm:mt-0">
            <ButtonFooter className="mr-4 text-sm text-gray-500 hover:underline md:mr-6 text-gray-600">Sobre nosotros</ButtonFooter>
            <ButtonFooter className="mr-4 text-sm text-gray-500 hover:underline md:mr-6 text-gray-600">Política de privacidad</ButtonFooter>
        </div>
      </footer>
    </div>
  );
}

export default Footer;