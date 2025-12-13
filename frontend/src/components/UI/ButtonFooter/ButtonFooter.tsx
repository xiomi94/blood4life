import { useNavigate } from 'react-router';

interface Props {
  children: React.ReactNode;
  onButtonClick?: () => void;
  to?: string;
  className?: string;
  onClick?: () => void;
}

const FooterLink: React.FC<Props> = ({
  children,
  onButtonClick,
  to,
  className = '',
  onClick,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onButtonClick) onButtonClick();
    if (onClick) onClick();
    if (to) navigate(to);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const footerLinkStyle = `
    text-gray-700 
    hover:text-gray-900 
    hover:underline
    transition-colors duration-200
    cursor-pointer
    bg-transparent
    border-none
    p-0
    font-inherit
  `;

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`${footerLinkStyle} ${className}`}
    >
      {children}
    </button>
  );
};

export default FooterLink;