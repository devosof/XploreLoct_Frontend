import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Plus, LogIn, LogOut, Compass, X } from "lucide-react";
import useAuth from "../../hooks/useAuth";

export default function Header() {
  const { isAuthenticated, user, logout, isOrganizer } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="flex items-center">
              <div className="relative flex items-center justify-center w-10 h-10">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-800 rounded-lg transform group-hover:rotate-12 transition-transform duration-300"></div>
                <Compass className="w-6 h-6 text-white relative z-10 transform group-hover:rotate-[360deg] transition-transform duration-500" />
              </div>
              <div className="ml-2 flex items-baseline">
                <span className="text-2xl font-extrabold bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent">
                  Xplore
                </span>
                <span className="text-2xl font-bold text-gray-800 relative">
                  Loct
                  <span className="absolute -top-1 -right-2 w-2 h-2 bg-green-500 rounded-full"></span>
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {isOrganizer && (
                  <Link
                    to="/events/create"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-800 hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-800 bg-green-50 hover:bg-green-100"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 hover:opacity-80"
                >
                  <img
                    className="h-8 w-8 rounded-full"
                    src={
                      user?.avatar_url ||
                      `https://ui-avatars.com/api/?name=${user?.username}`
                    }
                    alt={user?.username}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">
                      {user?.username}
                    </span>
                    {user?.role?.length > 0 && (
                      <span className="text-xs text-gray-500">
                        {user.role.join(", ")}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-800 bg-green-50 hover:bg-green-100"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile Navigation Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-2 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50"
                >
                  <img
                    className="h-8 w-8 rounded-full"
                    src={
                      user?.avatar_url ||
                      `https://ui-avatars.com/api/?name=${user?.username}`
                    }
                    alt={user?.username}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">
                      {user?.username}
                    </span>
                    {user?.role?.length > 0 && (
                      <span className="text-xs text-gray-500">
                        {user.role.join(", ")}
                      </span>
                    )}
                  </div>
                </Link>
                {isOrganizer && (
                  <Link
                    to="/events/create"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4 inline mr-2" />
                    Create Event
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <LogOut className="w-4 h-4 inline mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <LogIn className="w-4 h-4 inline mr-2" />
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
