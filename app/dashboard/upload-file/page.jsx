"use client";

import { useState, useRef, useEffect } from "react";

export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState({});
  const [status, setStatus] = useState({});
  const fileInputRef = useRef();

  const CHUNK_SIZE = 16 * 1024 * 1024; // 16 MB
  const MAX_RETRIES = 5;
  const CONCURRENCY = 5; // number of files uploading in parallel

  // Add files
  const addFiles = (newFiles) => {
    setFiles((prev) => {
      const combined = [...prev];
      newFiles.forEach((file) => {
        const pathKey = file.webkitRelativePath || file.name;
        if (!combined.find((f) => (f.webkitRelativePath || f.name) === pathKey)) {
          combined.push(file);
          setStatus((s) => ({ ...s, [pathKey]: "not_uploaded" }));
        }
      });
      return combined;
    });
  };

  // Drag & drop
  const handleDrop = (e) => {
    e.preventDefault();
    addFiles(Array.from(e.dataTransfer.files));
  };

  // File select
  const handleSelectFiles = (e) => {
    if (!e.target.files) return;
    addFiles(Array.from(e.target.files));
  };

  const formatBytes = (bytes) => {
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    if (!bytes) return "0 B";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
  };

  // Upload a single file chunked
  const uploadFile = async (file) => {
    const pathKey = file.webkitRelativePath || file.name;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        setStatus((s) => ({ ...s, [pathKey]: "uploading" }));

        // 1️⃣ Get signed URL
        const res = await fetch(
          "https://37b884c18b27.ngrok-free.app/upload/create-resumable-upload",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filename: pathKey,
              content_type: file.type || "application/octet-stream",
            }),
          }
        );

        if (!res.ok) throw new Error("Failed to get signed URL");
        const { signedUrl } = await res.json();

        // 2️⃣ Start resumable upload
        const startRes = await fetch(signedUrl, {
          method: "POST",
          headers: {
            "Content-Type": file.type || "application/octet-stream",
            "x-goog-resumable": "start",
          },
        });

        const uploadUrl = startRes.headers.get("Location");
        if (!uploadUrl) throw new Error("Failed to start upload");

        // 3️⃣ Upload chunks with concurrency (parallel chunks)
        let offset = 0;
        const startTime = Date.now();

        while (offset < file.size) {
          const chunk = file.slice(offset, offset + CHUNK_SIZE);
          const end = Math.min(offset + CHUNK_SIZE, file.size) - 1;

          const uploadRes = await fetch(uploadUrl, {
            method: "PUT",
            headers: {
              "Content-Length": String(chunk.size),
              "Content-Range": `bytes ${offset}-${end}/${file.size}`,
            },
            body: chunk,
          });

          if (![200, 201, 308].includes(uploadRes.status)) {
            throw new Error(`Upload failed at ${offset}`);
          }

          offset += chunk.size;
          const elapsed = (Date.now() - startTime) / 1000;
          const speed = offset / elapsed;

          setProgress((p) => ({
            ...p,
            [pathKey]: { percent: Math.floor((offset / file.size) * 100), speed },
          }));
        }

        setStatus((s) => ({ ...s, [pathKey]: "done" }));
        return;
      } catch (err) {
        console.warn(`${pathKey} attempt ${attempt} failed`, err);
        if (attempt === MAX_RETRIES) setStatus((s) => ({ ...s, [pathKey]: "not_uploaded" }));
      }
    }
  };

  // Smart parallel uploader
  const startUpload = async () => {
    const queue = [...files];

    const workers = new Array(CONCURRENCY).fill(null).map(async () => {
      while (queue.length > 0) {
        const file = queue.shift();
        if (!file) continue;
        await uploadFile(file);
      }
    });

    await Promise.all(workers);

    // Retry any failed files
    const remaining = files.filter((f) => status[f.webkitRelativePath || f.name] === "not_uploaded");
    if (remaining.length > 0) {
      console.log(`Retrying remaining ${remaining.length} files`);
      await Promise.all(remaining.map(uploadFile));
    }
  };

  useEffect(() => {
    if (files.length > 0) startUpload();
  }, [files]);

  const notUploadedCount = files.filter((f) => status[f.webkitRelativePath || f.name] === "not_uploaded").length;

  return (
    <div className="flex items-center justify-center py-10">
      <div className="p-5 w-full max-w-[800px] font-sans">
        <h1 className="text-2xl font-bold mb-4">Upload Large Files & Folders</h1>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current.click()}
          className="border-2 border-dashed border-gray-400 rounded-lg p-10 text-center cursor-pointer mb-4 hover:bg-gray-50 transition"
        >
          Drag & Drop files/folders here or click to select
        </div>

        <input
          type="file"
          multiple
          webkitdirectory="true"
          directory="true"
          ref={fileInputRef}
          className="hidden"
          onChange={handleSelectFiles}
        />

        {files.length > 0 && (
          <div className="mb-4 text-sm text-gray-700">
            <div><strong>Total files:</strong> {files.length}</div>
            <div><strong>Not uploaded:</strong> {notUploadedCount}</div>
          </div>
        )}

        <div className="mt-5 space-y-3">
          {files.map((file, index) => {
            const pathKey = file.webkitRelativePath || file.name;
            const currentStatus = status[pathKey];
            return (
              <div
                key={pathKey}
                className={`p-2 border rounded-lg shadow-sm ${
                  currentStatus === "done"
                    ? "bg-green-50 border-green-300"
                    : currentStatus === "not_uploaded"
                    ? "bg-red-50 border-red-300"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center">
                  <span className="w-[300px] truncate font-medium text-gray-800 text-sm" title={pathKey}>
                    {index + 1}. {pathKey}
                  </span>
                  <div className="flex-1 h-2 bg-gray-200 rounded mx-2 overflow-hidden">
                    <div
                      className={`h-full rounded transition-all duration-300 ${
                        currentStatus === "done"
                          ? "bg-green-500"
                          : currentStatus === "not_uploaded"
                          ? "bg-red-500"
                          : "bg-blue-500"
                      }`}
                      style={{ width: `${progress[pathKey]?.percent || 0}%` }}
                    />
                  </div>
                  <span className="w-20 text-right text-xs">
                    {currentStatus === "done"
                      ? "✔️"
                      : currentStatus === "not_uploaded"
                      ? "Not Uploaded"
                      : `${progress[pathKey]?.percent || 0}%`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
