import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom"; 
import { Menu, X } from "lucide-react";
import { useAuth } from "../Context/AuthContext"; 

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth(); 
  const navigate = useNavigate(); 

  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    logout(); 
    closeMenu(); 
    navigate("/"); 
  };

  const navLinkClasses = ({ isActive }) =>
    `text-gray-700 hover:text-green-600 transition ${
      isActive ? "font-bold border-b-2 border-green-600" : ""
    }`;

  const loginButtonClasses = ({ isActive }) =>
    `py-1 px-3 rounded border border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition ${
      isActive ? "bg-green-600 text-white font-semibold" : ""
    }`;

  const registerButtonClasses = ({ isActive }) =>
    `py-1 px-3 rounded bg-green-600 text-white hover:bg-green-700 transition ${
      isActive ? "font-bold ring-2 ring-offset-1 ring-green-600" : ""
    }`;

  // Define mobile link classes
  const mobileLinkClasses = "block py-2 w-full text-center text-gray-700 hover:text-green-600";
  const mobileRegisterButtonClasses = "block py-2 w-full text-center rounded bg-green-600 text-white hover:bg-green-700";


  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">

          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <span className="text-xl font-bold text-gray-800">Book seat</span> 
          </Link>

          {/* --- Desktop Navigation --- */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/" className={navLinkClasses}>
              Home
            </NavLink>

            {user ? (
              // Links shown when Logged IN
              <>
                <NavLink to="/book-seats" className={navLinkClasses}>
                  Book Seat
                </NavLink>

                {/* Optional: Add a Profile Link */}
                <NavLink to="/profile" className={navLinkClasses}>
                   Profile 
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="py-1 px-3 rounded text-red-600 hover:bg-red-100 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              
              <>
                 <NavLink to="/book-seats" className={navLinkClasses}>
                    Book Seat
                 </NavLink>
                 <NavLink to="/login" className={loginButtonClasses}>
                  Login
                </NavLink>
                <NavLink to="/register" className={registerButtonClasses}>
                  Register
                </NavLink>
              </>
            )}
          </div>


          {/* --- Mobile Menu Button --- */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

        </div>

        {/* --- Mobile Menu --- */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col items-center pb-4 pt-2 space-y-3">
            <NavLink to="/" className={mobileLinkClasses} onClick={closeMenu}>
              Home
            </NavLink>

            {user ? (
              // Mobile Links - Logged IN
              <>
                <NavLink to="/book-seats" className={mobileLinkClasses} onClick={closeMenu}>
                  Book Seat
                </NavLink>
                <NavLink to="/profile" className={mobileLinkClasses} onClick={closeMenu}>
                    Profile
                </NavLink>
                <button
                  onClick={handleLogout} // handleLogout already closes the menu
                  className="w-full py-2 text-center text-red-600 hover:bg-red-100 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              // Mobile Links - Logged OUT
              <>
                 <NavLink to="/book-seats" className={mobileLinkClasses} onClick={closeMenu}>
                    Book Seat
                 </NavLink>
                <NavLink to="/login" className={mobileLinkClasses} onClick={closeMenu}>
                  Login
                </NavLink>
                <NavLink to="/register" className={mobileRegisterButtonClasses} onClick={closeMenu}>
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
         

      </div>
    </nav>
  );
};

export default NavBar;