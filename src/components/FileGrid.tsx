import React from 'react';
import { FileItem } from './Dashboard';
import { FileCard } from './FileCard';

interface FileGridProps {
  files: FileItem[];
  onFileDelete: (fileId: string) => void;
  onFileRename: (fileId: string) => void;
  onFileMove: (fileId: string) => void;
}

export const FileGrid: React.FC<FileGridProps> = ({ files, onFileDelete, onFileRename, onFileMove }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {files.map((file) => (
        <FileCard key={file.id} file={file} onDelete={onFileDelete} onRename={onFileRename} onMove={onFileMove} />
      ))}
    </div>
  );
};