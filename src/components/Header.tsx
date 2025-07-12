import React from 'react';
import { HardDrive, LogOut, User, Shield } from 'lucide-react';

interface HeaderProps {
  userEmail: string;
  onLogout: () => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userEmail, onLogout, isAdmin, onToggleAdmin }) => {
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <HardDrive className="h-8 w-8 text-teal-500" />
              <span className="ml-2 text-xl font-bold text-white">CloudDrive</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-300">
              <User className="h-5 w-5" />
              <span className="text-sm hidden sm:inline">{userEmail}</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm hidden sm:inline">Logout</span>
            </button>
            {isAdmin && (
              <button
                onClick={onToggleAdmin}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-all duration-200"
              >
                <Shield className="h-4 w-4" />
                <span className="text-sm hidden sm:inline">Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};