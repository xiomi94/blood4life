import React, {useState} from 'react';
import Logo from "../../../assets/images/LogoShadow.webp";

const Footer: React.FC = () => {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(!active);
  };

  return (
    <div className="relative top-0 left-0 w-full h-full bg-red-200 text-white flex flex-col mt-4">
      {!active && (
        <div className="flex flex-row justify-center items-center pl-8 pr-8 pt-4 pb-4 bg-gray-100">
          <div className="h-14 w-14" />
          <div
            className="flex flex-row w-full items-center"
            onClick={handleClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              width="32px"
              height="32px"
              viewBox="0 0 32 32"
              version="1.1"
              className="ml-auto cursor-pointer"
            >
              <g id="surface1">
                <path
                  style={{
                    stroke: 'none',
                    fillRule: 'nonzero',
                    fill: 'rgb(99.607843%,79.215688%,79.215688%)',
                    fillOpacity: 1
                  }}
                  d="M 16 0 C 7.164062 0 0 7.164062 0 16 C 0 24.835938 7.164062 32 16 32 C 24.835938 32 32 24.835938 32 16 C 32 7.164062 24.835938 0 16 0 Z M 18.808594 23.34375 C 18.160156 24.0625 17.789062 24.492188 17.09375 25.160156 C 16.035156 26.167969 14.835938 26.4375 13.902344 25.441406 C 12.558594 24.003906 13.964844 19.640625 14 19.476562 C 14.253906 18.316406 14.753906 15.996094 14.753906 15.996094 C 14.753906 15.996094 13.667969 16.660156 13.023438 16.898438 C 12.546875 17.070312 12.007812 16.84375 11.875 16.382812 C 11.753906 15.957031 11.851562 15.683594 12.113281 15.394531 C 12.757812 14.675781 13.128906 14.25 13.828125 13.582031 C 14.886719 12.570312 16.085938 12.300781 17.019531 13.296875 C 18.363281 14.734375 17.371094 17.09375 17.023438 18.765625 C 16.992188 18.933594 16.164062 22.742188 16.164062 22.742188 C 16.164062 22.742188 17.253906 22.078125 17.898438 21.84375 C 18.375 21.667969 18.914062 21.898438 19.046875 22.355469 C 19.167969 22.785156 19.070312 23.054688 18.808594 23.34375 Z M 17.074219 11.007812 C 15.582031 11.140625 14.265625 10.035156 14.132812 8.539062 C 14.003906 7.046875 15.105469 5.734375 16.601562 5.601562 C 18.09375 5.472656 19.410156 6.578125 19.539062 8.070312 C 19.667969 9.5625 18.566406 10.878906 17.074219 11.007812 Z M 17.074219 11.007812 "
                />
              </g>
            </svg>
          </div>
        </div>
      )}
      {active && (
        <div className="relative top-0 left-0 w-full h-full bg-red-200 text-white flex flex-col pl-8 pr-8 pt-4 pb-4">
          <div className="flex flex-row w-full items-center">
            <img src={Logo} alt="Logo" className="h-14 w-14 cursor-pointer hover:opacity-80 transition-opacity"/>
            <div className="flex flex-row w-full justify-around text-gray-800">
              <p>Política de privacidad</p>
              <p>Uso y protección de datos</p>
              <p>Sobre nosotros</p>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 32 32"
              version="1.1"
              onClick={handleClick}
              className="w-8 h-8 min-w-8 min-h-8 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity drop-shadow"
            >
              <g id="surface1">
                <path
                  style={{
                    stroke: 'none',
                    fillRule: 'nonzero',
                    fill: 'rgb(100%,100%,100%)',
                    fillOpacity: 1
                  }}
                  d="M 16 0 C 7.164062 0 0 7.164062 0 16 C 0 24.835938 7.164062 32 16 32 C 24.835938 32 32 24.835938 32 16 C 32 7.164062 24.835938 0 16 0 Z M 18.808594 23.34375 C 18.160156 24.0625 17.789062 24.492188 17.09375 25.160156 C 16.035156 26.167969 14.835938 26.4375 13.902344 25.441406 C 12.558594 24.003906 13.964844 19.640625 14 19.476562 C 14.253906 18.316406 14.753906 15.996094 14.753906 15.996094 C 14.753906 15.996094 13.667969 16.660156 13.023438 16.898438 C 12.546875 17.070312 12.007812 16.84375 11.875 16.382812 C 11.753906 15.957031 11.851562 15.683594 12.113281 15.394531 C 12.757812 14.675781 13.128906 14.25 13.828125 13.582031 C 14.886719 12.570312 16.085938 12.300781 17.019531 13.296875 C 18.363281 14.734375 17.371094 17.09375 17.023438 18.765625 C 16.992188 18.933594 16.164062 22.742188 16.164062 22.742188 C 16.164062 22.742188 17.253906 22.078125 17.898438 21.84375 C 18.375 21.667969 18.914062 21.898438 19.046875 22.355469 C 19.167969 22.785156 19.070312 23.054688 18.808594 23.34375 Z M 17.074219 11.007812 C 15.582031 11.140625 14.265625 10.035156 14.132812 8.539062 C 14.003906 7.046875 15.105469 5.734375 16.601562 5.601562 C 18.09375 5.472656 19.410156 6.578125 19.539062 8.070312 C 19.667969 9.5625 18.566406 10.878906 17.074219 11.007812 Z M 17.074219 11.007812 "
                />
              </g>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default Footer;