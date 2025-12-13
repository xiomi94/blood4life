import { useNavigate } from "react-router";

interface Props {
  children: React.ReactNode;
  variant?: "blue" | "red" | "green" | "gray";
  onButtonClick?: () => void;
  textColor?: "black" | "white";
  type?: "button" | "submit" | "reset";
  to?: string;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  'aria-label'?: string;
  'aria-busy'?: boolean;
}

const Button: React.FC<Props> = ({
  children,
  variant = "blue",
  onButtonClick,
  textColor = "white",
  type = "button",
  to,
  disabled = false,
  className = "",
  onClick,
  'aria-label': ariaLabel,
  'aria-busy': ariaBusy,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (disabled) return;
    if (onButtonClick) onButtonClick();
    if (onClick) onClick();
    if (to) navigate(to);
  };

  // 🎨 Variantes seguras para Tailwind
  const colorVariants: Record<string, string> = {
    blue: "bg-blue-600 hover:bg-blue-700",
    red: "bg-red-600 hover:bg-red-700",
    green: "bg-green-600 hover:bg-green-700",
    gray: "bg-gray-500 hover:bg-gray-600",
  };

  const textColorClasses = {
    black: "text-black",
    white: "text-white",
  };

  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed"
    : "";

  const baseStyles = `
    inline-flex items-center justify-center
    px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3
    rounded-md shadow-sm
    text-body-sm md:text-body font-poppins font-medium
    transition-all duration-150 transform active:scale-95
  `;

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      aria-busy={ariaBusy}
      className={`
        ${baseStyles}
        ${colorVariants[variant]}
        ${textColorClasses[textColor]}
        ${disabledStyles}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
