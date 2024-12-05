import React from "react";
import Logo from "../../../assets/Img/Logo.png";

const Navbar = () => {
  // Toggle mobile menu
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <nav className="p-4 bg-white border-b border-gray-300">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center gap-x-2 sm:items-stretch sm:justify-start">
            {/* Logo */}
            <div className="flex flex-shrink-0 items-center">
              <img src={Logo} alt="Logo" />
            </div>

            {/* Title */}
            <div className="flex items-center justify-center">
              <div className="flex flex-col">
                <p className="text-md font-medium font-serif text-violet">
                  Clínica
                </p>
                <p className="text-lg font-medium font-serif text-violet">
                  Rafael Uribe Uribe
                </p>
              </div>
            </div>
          </div>

          {/* Notification Button */}
          <div className="flex items-center">
            <button
              type="button"
              className="relative p-1.5 rounded-full text-gray-500 hover:text-violet hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <span className="sr-only">View notifications</span>
              <svg
                className="size-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>

              <span className="absolute bottom-6 right-0.5 w-1.5 h-1.5 rounded-full bg-Purple ring-1 ring-white"></span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
