"use client"

import { motion } from "framer-motion"

export function StorageMeter({ used, total }: { used: number; total: number }) {
  const percentage = (used / total) * 100

  return (
    <div>
      <div className="flex justify-between items-end mb-1">
        <span className="text-sm font-medium text-white">Storage</span>
        <span className="text-xs text-gray-400">
          {used}GB / {total}GB
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5 relative overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2.5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "circOut" }}
        />
      </div>
    </div>
  )
}
