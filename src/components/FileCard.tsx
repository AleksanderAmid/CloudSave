import React, { useState } from 'react';
import { FileItem } from './Dashboard';
import { FileIcon, formatFileSize, formatDate } from '../utils/fileUtils';
import { Trash2, Download, Eye, Pencil, Folder } from 'lucide-react';

interface FileCardProps {
  file: FileItem;
  onDelete: (fileId: string) => void;
  onRename: (fileId: string) => void;
  onMove: (fileId: string) => void;
}

export const FileCard: React.FC<FileCardProps> = ({ file, onDelete, onRename, onMove }) => {
  const [showActions, setShowActions] = useState(false);

  const handleDownload = () => {
    if (file.url) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      link.click();
    }
  };

  const handlePreview = () => {
    if (file.url) {
      window.open(file.url, '_blank');
    }
  };

  return (
    <div
      className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-all duration-200 cursor-pointer group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex flex-col items-center space-y-3">
        <div className="relative">
          <FileIcon type={file.type} className="w-12 h-12 text-gray-400 group-hover:text-teal-400 transition-colors duration-200" />
          {showActions && (
            <div className="absolute -top-2 -right-2 flex space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePreview();
                }}
                className="p-1 bg-gray-600 hover:bg-teal-600 rounded-full transition-colors duration-200"
              >
                <Eye className="w-3 h-3 text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload();
                }}
                className="p-1 bg-gray-600 hover:bg-blue-600 rounded-full transition-colors duration-200"
              >
                <Download className="w-3 h-3 text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(file.id);
                }}
                className="p-1 bg-gray-600 hover:bg-red-600 rounded-full transition-colors duration-200"
              >
                <Trash2 className="w-3 h-3 text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRename(file.id);
                }}
                className="p-1 bg-gray-600 hover:bg-yellow-600 rounded-full transition-colors duration-200"
              >
                <Pencil className="w-3 h-3 text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMove(file.id);
                }}
                className="p-1 bg-gray-600 hover:bg-purple-600 rounded-full transition-colors duration-200"
              >
                <Folder className="w-3 h-3 text-white" />
              </button>
            </div>
          )}
        </div>
        
        <div className="text-center w-full">
          <div className="text-sm font-medium text-white truncate" title={file.name}>
            {file.name}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {formatFileSize(file.size)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {formatDate(file.uploadDate)}
          </div>
        </div>
      </div>
    </div>
  );
};