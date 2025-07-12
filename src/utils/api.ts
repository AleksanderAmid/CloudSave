const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export interface LoginResponse {
  token?: string;
  role?: string;
  quota_mb?: number;
  used_mb?: number;
  firstTime?: boolean;
  error?: string;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function setPassword(username: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/api/auth/set-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function getFiles(token: string) {
  const res = await fetch(`${API_BASE}/api/files`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function uploadFile(file: File, token: string) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_BASE}/api/files/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  return res.json();
}

export async function deleteFile(id: number, token: string) {
  const res = await fetch(`${API_BASE}/api/files/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function getUser(token: string) {
  const res = await fetch(`${API_BASE}/api/user/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function renameFile(id: string | number, newName: string, token: string) {
  const res = await fetch(`${API_BASE}/api/files/${id}/rename`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ newName }),
  });
  return res.json();
}

export async function moveFile(id: string | number, destPath: string, token: string) {
  const res = await fetch(`${API_BASE}/api/files/${id}/move`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ destPath }),
  });
  return res.json();
}

// Admin APIs
export async function fetchUsers(token: string) {
  const res = await fetch(`${API_BASE}/api/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function addUser(username: string, quota_mb: number, token: string) {
  const res = await fetch(`${API_BASE}/api/admin/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username, quota_mb }),
  });
  return res.json();
}

export async function updateQuota(id: number, quota_mb: number, token: string) {
  const res = await fetch(`${API_BASE}/api/admin/users/${id}/quota`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ quota_mb }),
  });
  return res.json();
}

export async function resetUserPassword(id: number, token: string) {
  const res = await fetch(`${API_BASE}/api/admin/users/${id}/reset-password`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
} 