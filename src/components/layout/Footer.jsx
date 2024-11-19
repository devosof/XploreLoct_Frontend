import React from 'react';
import { Menu, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-green-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Menu className="w-8 h-8" />
              <span className="text-xl font-bold">XploreLoct</span>
            </Link>
            <p className="text-green-100 text-sm">
              Discover amazing events happening around you. Connect with people who share your interests.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-green-100 hover:text-white text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-green-100 hover:text-white text-sm">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-green-100 hover:text-white text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-green-100 hover:text-white text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-green-100 hover:text-white text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-green-100">
                <Mail className="w-4 h-4" />
                <span className="text-sm">support@xplorelct.com</span>
              </li>
              <li className="flex items-center space-x-2 text-green-100">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-green-800 text-center text-sm text-green-100">
          <p>&copy; {new Date().getFullYear()} XploreLoct. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}