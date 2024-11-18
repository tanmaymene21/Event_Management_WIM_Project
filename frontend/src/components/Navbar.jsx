import { Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import { navItems } from '../constants';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    setMobileDrawerOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80">
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center flex-shrink-0">
            <img className="h-10 w-10 mr-2" src={logo} alt="Logo" />
            <span className="text-xl tracking-tight">Event Master</span>
          </Link>

          <ul className="hidden lg:flex ml-14 space-x-12">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link to={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex justify-center space-x-12 items-center">
            {user ? (
              <div className="flex items-center space-x-6" ref={dropdownRef}>
                <Link
                  to="/events/create"
                  className="py-2 px-3 rounded-md bg-gradient-to-r from-orange-500 to-orange-800"
                >
                  Create Event
                </Link>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="py-2 px-3 border rounded-md"
                >
                  Profile
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 top-14 w-48 rounded-lg bg-neutral-900 border border-neutral-700 shadow-lg py-1">
                    <Link
                      to="/myevents"
                      className="block px-4 py-2 hover:bg-neutral-800"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      My Events
                    </Link>
                    <Link
                      to="/myregistrations"
                      className="block px-4 py-2 hover:bg-neutral-800"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      My Registrations
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-red-400 hover:bg-neutral-800"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="py-2 px-3 border rounded-md">
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="py-2 px-3 rounded-md bg-gradient-to-r from-orange-500 to-orange-800"
                >
                  Create an account
                </Link>
              </>
            )}
          </div>

          <div className="lg:hidden md:flex flex-col justify-end">
            <button onClick={toggleNavbar}>
              {mobileDrawerOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {mobileDrawerOpen && (
          <div className="fixed inset-0 top-[72px] bg-neutral-900 p-12 flex flex-col justify-start items-center lg:hidden">
            <ul className="mb-8">
              {navItems.map((item, index) => (
                <li key={index} className="py-4 text-center">
                  <Link
                    to={item.href}
                    onClick={() => setMobileDrawerOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {user ? (
              <div className="flex flex-col space-y-4 w-full max-w-xs">
                <Link
                  to="/events/create"
                  className="w-full py-2 px-3 rounded-md bg-gradient-to-r from-orange-500 to-orange-800 text-center"
                  onClick={() => setMobileDrawerOpen(false)}
                >
                  Create Event
                </Link>
                <Link
                  to="/myevents"
                  className="w-full py-2 px-3 border rounded-md text-center"
                  onClick={() => setMobileDrawerOpen(false)}
                >
                  My Events
                </Link>
                <Link
                  to="/myregistrations"
                  className="w-full py-2 px-3 border rounded-md text-center"
                  onClick={() => setMobileDrawerOpen(false)}
                >
                  My Registrations
                </Link>
                <button
                  className="w-full py-2 px-3 rounded-md text-red-400 border border-red-400 text-center"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-4 w-full max-w-xs">
                <Link
                  to="/login"
                  className="w-full py-2 px-3 border rounded-md text-center"
                  onClick={() => setMobileDrawerOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="w-full py-2 px-3 rounded-md bg-gradient-to-r from-orange-500 to-orange-800 text-center"
                  onClick={() => setMobileDrawerOpen(false)}
                >
                  Create an account
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
