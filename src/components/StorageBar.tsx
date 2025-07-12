import React from "react";

interface Props {
  used: number; // MB
  quota: number; // MB
}

export const StorageBar: React.FC<Props> = ({ used, quota }) => {
  const percent = quota === 0 ? 0 : Math.min(100, (used / quota) * 100);
  return (
    <div className="w-full bg-gray-700 rounded-full h-4">
      <div
        className="bg-teal-500 h-4 rounded-full text-xs text-center text-white"
        style={{ width: `${percent}%` }}
      >
        {used.toFixed(1)} / {quota} MB
      </div>
    </div>
  );
}; 