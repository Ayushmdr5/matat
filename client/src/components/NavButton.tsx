import { Link } from "react-router-dom";

interface NavButtonProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const NavButton = ({ to, children, className = "" }: NavButtonProps) => {
  return (
    <Link
      to={to}
      className={`bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition duration-200 ${className}`}
    >
      {children}
    </Link>
  );
};

export default NavButton;
