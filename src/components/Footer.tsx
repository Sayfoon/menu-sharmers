
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-auto bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link 
              to="/" 
              className="flex items-center"
            >
              <img 
                src="/lovable-uploads/e89218ce-4e43-4e91-ba9e-80dfa195d803.png" 
                alt="Sharmers Menus" 
                className="h-12 hover:opacity-80 transition-opacity"
              />
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Simple menu management for restaurants
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 text-sm">
            <Link 
              to="/" 
              className="text-gray-600 dark:text-gray-400 hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/login" 
              className="text-gray-600 dark:text-gray-400 hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="text-gray-600 dark:text-gray-400 hover:text-terracotta-600 dark:hover:text-terracotta-400 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-6 pt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; {currentYear} Sharmers Menus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
