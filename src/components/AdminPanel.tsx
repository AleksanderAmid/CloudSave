import React, { useState, useEffect } from "react";
import { fetchUsers, addUser, updateQuota, resetUserPassword } from "../utils/api";

interface Props {
  token: string;
}

export const AdminPanel: React.FC<Props> = ({ token }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [username, setUsername] = useState("");
  const [quota, setQuota] = useState<number>(512);

  const load = async () => {
    const list = await fetchUsers(token);
    setUsers(list);
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async () => {
    if (!username) return;
    await addUser(username, quota, token);
    setUsername("");
    load();
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg text-white space-y-4">
      <h2 className="text-xl font-bold">Admin Panel</h2>
      <div className="flex space-x-2">
        <input
          className="bg-gray-700 px-3 py-2 rounded"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="bg-gray-700 px-3 py-2 rounded w-24"
          type="number"
          placeholder="Quota MB"
          value={quota}
          onChange={(e) => setQuota(Number(e.target.value))}
        />
        <button className="bg-teal-600 px-4 py-2 rounded" onClick={handleAdd}>
          Add User
        </button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-300">
            <th>ID</th>
            <th>Username</th>
            <th>Quota MB</th>
            <th>Used MB</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="text-gray-200 text-center border-t border-gray-700">
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>
                <input
                  type="number"
                  value={u.quota_mb}
                  onChange={(e) => {
                    const newVal = Number(e.target.value);
                    setUsers(users.map((usr) => (usr.id === u.id ? { ...usr, quota_mb: newVal } : usr)));
                  }}
                  onBlur={async (e) => {
                    await updateQuota(u.id, Number(e.target.value), token);
                  }}
                  className="bg-gray-600 w-24 px-2 rounded"
                />
              </td>
              <td>{u.used_mb.toFixed(1)}</td>
              <td>
                <button
                  className="bg-yellow-600 px-2 py-1 rounded mr-2"
                  onClick={async () => {
                    await resetUserPassword(u.id, token);
                    alert("Password reset. User must set a new one on next login.");
                  }}
                >
                  Reset Password
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 