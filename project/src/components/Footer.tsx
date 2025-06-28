import React from 'react';
import { Bus, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Bus className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">RuralBus</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Making rural transportation accessible and reliable. Track your bus in real-time 
              and never miss your ride again.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-sm text-gray-300">
                <Phone className="h-4 w-4 mr-2" />
                <span>1-800-RURAL-BUS</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="/tracker" className="text-gray-300 hover:text-white transition-colors">Live Tracker</a></li>
              <li><a href="/schedule" className="text-gray-300 hover:text-white transition-colors">Bus Schedule</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">FAQs</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Route Maps</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Emergency Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            © 2025 RuralBus. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Mail className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-300">info@ruralbus.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;