import React, {useState} from 'react';
import Footerbutton from '../../assets/images/footer-button.png';
import Footerbuttonpressed from '../../assets/images/footer-button-pressed.png'
import Logo from "../../assets/images/LogoShadow.webp";

const Footer: React.FC = () => {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(!active);
  };

  return (
    <div className="relative w-full h-20 mt-4">
      {!active && (
        <div className="flex flex-col justify-center items-center w-full h-full p-4 bg-black">
          <div className="flex flex-row w-full items-center">
            <img
              src={Footerbutton}
              alt="Botón footer"
              onClick={handleClick}
              className="ml-auto cursor-pointer transition-transform duration-150 hover:opacity-80"
            />
          </div>
        </div>
      )}
      {active && (
        <div className="absolute top-0 left-0 w-full h-full bg-red-200 text-white flex flex-col p-4">
          <div className="flex flex-row w-full items-center">
            <img src={Logo} alt="Logo" className="h-14 w-14 cursor-pointer hover:opacity-80 transition-opacity"/>
            <div className="flex flex-row w-full justify-around text-gray-800">
              <p>Política de privacidad</p>
              <p>Uso y protección de datos</p>
              <p>Sobre nosotros</p>
            </div>
            <img
              src={Footerbuttonpressed}
              alt="Botón footer alternativo"
              onClick={handleClick}
              className="ml-auto cursor-pointer transition-transform duration-150 hover:opacity-80"
            />
          </div>
        </div>
      )}
    </div>

  );
};

export default Footer;
