import { Link } from "react-router-dom";

export const NavLinks = () => {
  return (
    <div className="hidden md:flex items-center space-x-6">
      <Link
        to="/solutions"
        className="text-gray-600 hover:text-[#8B5CF6] transition-colors duration-200"
      >
        Solutions
      </Link>
      <Link
        to="/address-validation"
        className="text-gray-600 hover:text-[#8B5CF6] transition-colors duration-200"
      >
        Address Validation
      </Link>
      <Link
        to="/learn-more"
        className="text-gray-600 hover:text-[#8B5CF6] transition-colors duration-200"
      >
        Learn More
      </Link>
    </div>
  );
};