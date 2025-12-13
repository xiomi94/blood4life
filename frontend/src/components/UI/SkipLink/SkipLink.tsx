// components/UI/SkipLink/SkipLink.tsx

interface SkipLinkProps {
  href?: string;
  children?: React.ReactNode;
}

const SkipLink: React.FC<SkipLinkProps> = ({ 
  href = "#main-content", 
  children = "Saltar al contenido principal" 
}) => {
  return (
    <a href={href} className="skip-link">
      {children}
    </a>
  );
};

export default SkipLink;
