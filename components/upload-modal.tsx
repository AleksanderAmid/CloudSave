"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Upload, File, ImageIcon, Video, Music, FileText, Archive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface UploadModalProps {
  isOpen: boolean
  onClose: () => void
}

const fileTypeIcons = {
  image: ImageIcon,
  video: Video,
  audio: Music,
  document: FileText,
  archive: Archive,
  other: File,
}

const getFileType = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase()
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension || "")) return "image"
  if (["mp4", "avi", "mov", "wmv", "flv"].includes(extension || "")) return "video"
  if (["mp3", "wav", "flac", "aac"].includes(extension || "")) return "audio"
  if (["pdf", "doc", "docx", "txt", "rtf"].includes(extension || "")) return "document"
  if (["zip", "rar", "7z", "tar"].includes(extension || "")) return "archive"
  return "other"
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files)
      setSelectedFiles((prev) => [...prev, ...files])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setSelectedFiles((prev) => [...prev, ...files])
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    setUploading(true)
    // Simulate upload process
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setUploading(false)
    setSelectedFiles([])
    onClose()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="w-full max-w-2xl bg-gray-900/95 border-gray-700 text-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold">Upload Files</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  <X className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Drop Zone */}
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-gray-600 hover:border-blue-500 hover:bg-blue-500/5"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Drop files here or click to browse</p>
                  <p className="text-gray-400 text-sm mb-4">Support for all file types</p>
                  <input type="file" multiple onChange={handleFileSelect} className="hidden" id="file-upload" />
                  <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      Choose Files
                    </label>
                  </Button>
                </div>

                {/* Selected Files */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-medium text-white">Selected Files ({selectedFiles.length})</h3>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {selectedFiles.map((file, index) => {
                        const fileType = getFileType(file.name)
                        const IconComponent = fileTypeIcons[fileType]
                        return (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                            <IconComponent className="h-5 w-5 text-blue-500 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">{file.name}</p>
                              <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFile(index)}
                              className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={selectedFiles.length === 0 || uploading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {uploading
                      ? "Uploading..."
                      : `Upload ${selectedFiles.length} file${selectedFiles.length !== 1 ? "s" : ""}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
