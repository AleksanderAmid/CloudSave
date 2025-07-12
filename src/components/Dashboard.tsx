import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { FileUpload } from './FileUpload';
import { FileGrid } from './FileGrid';
import { FileList } from './FileList';
import { SearchBar } from './SearchBar';
import { Grid, List } from 'lucide-react';
import { getFiles, uploadFile, deleteFile as apiDeleteFile, getUser, renameFile, moveFile } from "../utils/api";
import { StorageBar } from "./StorageBar";
import { AdminPanel } from "./AdminPanel";

interface DashboardProps {
  token: string;
  user: { username: string; role: string };
  onLogout: () => void;
}

export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  url?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ token, user, onLogout }) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFiles, setFilteredFiles] = useState<FileItem[]>([]);
  const [usage, setUsage] = useState<{ used: number; quota: number }>({ used: 0, quota: 0 });
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    async function fetchFiles() {
      const data = await getFiles(token);
      const mapped = data.map((f: any) => ({
        id: f.id.toString(),
        name: f.original_name,
        type: "unknown", // we don't store mime type; use unknown
        size: f.size_bytes,
        uploadDate: new Date(f.created_at),
        url: `${import.meta.env.VITE_API_BASE || "http://localhost:4000"}/api/files/download/${f.id}`,
      }));
      setFiles(mapped);
    }
    fetchFiles();
  }, [token]);

  useEffect(() => {
    const filtered = files.filter(file =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFiles(filtered);
  }, [files, searchQuery]);

  useEffect(() => {
    async function fetchUser() {
      const u = await getUser(token);
      setUsage({ used: u.used_mb, quota: u.quota_mb });
    }
    fetchUser();
  }, [token]);

  const handleFileUpload = async (newFiles: File[]) => {
    for (const file of newFiles) {
      await uploadFile(file, token);
    }
    const refreshed = await getFiles(token);
    const mapped = refreshed.map((f: any) => ({
      id: f.id.toString(),
      name: f.original_name,
      type: "unknown",
      size: f.size_bytes,
      uploadDate: new Date(f.created_at),
      url: `${import.meta.env.VITE_API_BASE || "http://localhost:4000"}/api/files/download/${f.id}`,
    }));
    setFiles(mapped);
    const refreshedUser = await getUser(token);
    setUsage({ used: refreshedUser.used_mb, quota: refreshedUser.quota_mb });
  };

  const handleFileDelete = async (fileId: string) => {
    await apiDeleteFile(Number(fileId), token);
    setFiles(files.filter((f) => f.id !== fileId));
  };

  const handleFileRename = async (fileId: string) => {
    const newName = prompt("Enter new name:");
    if (!newName) return;
    await renameFile(fileId, newName, token);
    const refreshed = await getFiles(token);
    const mapped = refreshed.map((f: any) => ({
      id: f.id.toString(),
      name: f.original_name,
      type: "unknown",
      size: f.size_bytes,
      uploadDate: new Date(f.created_at),
      url: `${import.meta.env.VITE_API_BASE || "http://localhost:4000"}/api/files/download/${f.id}`,
    }));
    setFiles(mapped);
  };

  const handleFileMove = async (fileId: string) => {
    const dest = prompt("Destination path (relative to your root):");
    if (!dest) return;
    await moveFile(fileId, dest, token);
    const refreshed = await getFiles(token);
    const mapped = refreshed.map((f: any) => ({
      id: f.id.toString(),
      name: f.original_name,
      type: "unknown",
      size: f.size_bytes,
      uploadDate: new Date(f.created_at),
      url: `${import.meta.env.VITE_API_BASE || "http://localhost:4000"}/api/files/download/${f.id}`,
    }));
    setFiles(mapped);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header userEmail={user.username} onLogout={onLogout} isAdmin={user.role === 'admin'} onToggleAdmin={() => setShowAdmin(!showAdmin)} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4">
          <StorageBar used={usage.used} quota={usage.quota} />
        </div>
        <div className="mb-8">
          <FileUpload onFileUpload={handleFileUpload} />
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 max-w-md">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {showAdmin && user.role === 'admin' && (
          <div className="my-4"><AdminPanel token={token} /></div>
        )}

        {filteredFiles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">
              {files.length === 0 ? 'No files uploaded yet' : 'No files match your search'}
            </div>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <FileGrid files={filteredFiles} onFileDelete={handleFileDelete} onFileRename={handleFileRename} onFileMove={handleFileMove} />
            ) : (
              <FileList files={filteredFiles} onFileDelete={handleFileDelete} onFileRename={handleFileRename} onFileMove={handleFileMove} />
            )}
          </>
        )}
      </div>
    </div>
  );
};