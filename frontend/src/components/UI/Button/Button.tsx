import {useNavigate} from 'react-router-dom';

interface Props {
  children: React.ReactNode;
  backgroundColor?: string;
  onButtonClick?: () => void; // funcionalidad opcional
  textColor?: 'black' | 'white';
  type?: "button" | "submit" | "reset";
  to?: string; // para navegación
  disabled?: boolean;
  className?: string; // permite pasar clases personalizadas
  onClick?: () => void; // para compatibilidad con TS
}

const Button: React.FC<Props> = ({
                                   children,
                                   backgroundColor = 'blue-600',
                                   onButtonClick,
                                   textColor = 'white',
                                   type = "button",
                                   to,
                                   disabled = false,
                                   className = '',
                                   onClick,
                                 }) => {
  const navigate = useNavigate();

  const textColorClass = {
    black: 'text-black',
    white: 'text-white'
  };

  const handleClick = () => {
    if (disabled) return;
    if (onButtonClick) onButtonClick();
    if (onClick) onClick(); // permite usar onClick directamente
    if (to) navigate(to);
  };

  const baseClassName = `
  inline-flex items-center justify-center
  px-4 py-2 
  rounded-md 
  shadow-sm 
  bg-${backgroundColor} 
  ${textColorClass[textColor]}
  hover:bg-blue-700
  focus:outline-none focus:ring-2 focus:ring-offset-2
  transform transition duration-150
  active:scale-95
  text-center
  ${disabled ? 'opacity-50 cursor-not-allowed hover:bg-${backgroundColor}' : ''}
`;

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`${baseClassName} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
