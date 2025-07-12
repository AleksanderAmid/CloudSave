import React from 'react';
import { FileText, FileImage, FileVideo, FileAudio, FileArchive, FileCode, File, FileSpreadsheet, Presentation as FilePresentation } from 'lucide-react';

export const FileIcon: React.FC<{ type: string; className?: string }> = ({ type, className }) => {
  const getIcon = () => {
    if (type.startsWith('image/')) {
      return <FileImage className={className} />;
    } else if (type.startsWith('video/')) {
      return <FileVideo className={className} />;
    } else if (type.startsWith('audio/')) {
      return <FileAudio className={className} />;
    } else if (type.includes('pdf') || type.includes('document')) {
      return <FileText className={className} />;
    } else if (type.includes('spreadsheet') || type.includes('excel')) {
      return <FileSpreadsheet className={className} />;
    } else if (type.includes('presentation') || type.includes('powerpoint')) {
      return <FilePresentation className={className} />;
    } else if (type.includes('zip') || type.includes('rar') || type.includes('7z')) {
      return <FileArchive className={className} />;
    } else if (type.includes('javascript') || type.includes('python') || type.includes('code')) {
      return <FileCode className={className} />;
    } else {
      return <File className={className} />;
    }
  };

  return getIcon();
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDate = (date: Date): string => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return 'Today';
  } else if (diffDays === 2) {
    return 'Yesterday';
  } else if (diffDays <= 7) {
    return `${diffDays - 1} days ago`;
  } else {
    return date.toLocaleDateString();
  }
};