import React from 'react';
import { FileItem } from './Dashboard';
import { FileIcon, formatFileSize, formatDate } from '../utils/fileUtils';
import { Trash2, Download, Pencil, Folder } from 'lucide-react';

interface FileListProps {
  files: FileItem[];
  onFileDelete: (fileId: string) => void;
  onFileRename: (fileId: string) => void;
  onFileMove: (fileId: string) => void;
}

export const FileList: React.FC<FileListProps> = ({ files, onFileDelete, onFileRename, onFileMove }) => {
  const handleDownload = (file: FileItem) => {
    if (file.url) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      link.click();
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Modified
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {files.map((file) => (
              <tr key={file.id} className="hover:bg-gray-700/50 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FileIcon type={file.type} className="w-8 h-8 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-white">{file.name}</div>
                      <div className="text-sm text-gray-400">{file.type}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {formatFileSize(file.size)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {formatDate(file.uploadDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDownload(file)}
                      className="p-1 hover:bg-gray-600 rounded transition-colors duration-200"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onFileDelete(file.id)}
                      className="p-1 hover:bg-red-600 rounded transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onFileRename(file.id)}
                      className="p-1 hover:bg-yellow-600 rounded transition-colors duration-200"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onFileMove(file.id)}
                      className="p-1 hover:bg-purple-600 rounded transition-colors duration-200"
                    >
                      <Folder className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};