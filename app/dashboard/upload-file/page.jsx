"use client";

import TopBar from "@/components/customs/top-bar/Topbar";
import { useState, useRef, useEffect } from "react";

// Helper to recursively traverse folders
const traverseFileTree = async (entry, path = "") => {
  return new Promise((resolve) => {
    if (entry.isFile) {
      entry.file((file) => {
        resolve([{ file, relativePath: path + file.name }]);
      });
    } else if (entry.isDirectory) {
      const dirReader = entry.createReader();
      dirReader.readEntries(async (entries) => {
        const filesArrays = await Promise.all(
          entries.map((en) => traverseFileTree(en, path + entry.name + "/"))
        );
        resolve(filesArrays.flat());
      });
    }
  });
};

export default function UploadPage() {
  const [files, setFiles] = useState([]); // {file, relativePath}
  const [progress, setProgress] = useState({});
  const [status, setStatus] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState(new Set());
  const fileInputRef = useRef();

  const CHUNK_SIZE = 16 * 1024 * 1024; // 16 MB
  const MAX_RETRIES = 5;
  const CONCURRENCY = 5;

  // Add files without duplicating uploaded ones
  const addFiles = (newFiles) => {
    setFiles((prev) => {
      const combined = [...prev];
      newFiles.forEach(({ file, relativePath }) => {
        if (!combined.find((f) => f.relativePath === relativePath) && !uploadedFiles.has(relativePath)) {
          combined.push({ file, relativePath });
          setStatus((s) => ({ ...s, [relativePath]: "not_uploaded" }));
        }
      });
      return combined;
    });
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const items = Array.from(e.dataTransfer.items);
    let allFiles = [];

    for (const item of items) {
      const entry = item.webkitGetAsEntry();
      if (entry) {
        const filesFromEntry = await traverseFileTree(entry);
        allFiles = allFiles.concat(filesFromEntry);
      }
    }

    addFiles(allFiles);
  };

  const handleSelectFiles = (e) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files).map((f) => ({ file: f, relativePath: f.name }));
    addFiles(selected);
  };

  const uploadFile = async ({ file, relativePath }) => {
    const pathKey = relativePath || file.name;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        setStatus((s) => ({ ...s, [pathKey]: "uploading" }));

        const res = await fetch("https://b69bfe9602b5.ngrok-free.app/upload/create-resumable-upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: pathKey,
            content_type: file.type || "application/octet-stream",
          }),
        });

        if (!res.ok) throw new Error("Failed to get signed URL");
        const { signedUrl } = await res.json();

        const startRes = await fetch(signedUrl, {
          method: "POST",
          headers: {
            "Content-Type": file.type || "application/octet-stream",
            "x-goog-resumable": "start",
          },
        });

        const uploadUrl = startRes.headers.get("Location");
        if (!uploadUrl) throw new Error("Failed to start upload");

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

          // ✅ Update progress immutably for this file only
          setProgress((prev) => ({
            ...prev,
            [pathKey]: { percent: Math.floor((offset / file.size) * 100), speed },
          }));
        }

        setStatus((s) => ({ ...s, [pathKey]: "done" }));
        setUploadedFiles((prev) => new Set(prev).add(pathKey));
        return;
      } catch (err) {
        console.warn(`${pathKey} attempt ${attempt} failed`, err);
        if (attempt === MAX_RETRIES) setStatus((s) => ({ ...s, [pathKey]: "not_uploaded" }));
      }
    }
  };

  const startUpload = async () => {
    const queue = files.filter((f) => !uploadedFiles.has(f.relativePath));
    const workers = new Array(CONCURRENCY).fill(null).map(async () => {
      while (queue.length > 0) {
        const file = queue.shift();
        if (!file) continue;
        await uploadFile(file);
      }
    });
    await Promise.all(workers);

    const remaining = files.filter((f) => status[f.relativePath] === "not_uploaded");
    if (remaining.length > 0) {
      await Promise.all(remaining.map(uploadFile));
    }
  };

  useEffect(() => {
    if (files.length > 0) startUpload();
  }, [files]);

  const notUploadedCount = files.filter((f) => status[f.relativePath] === "not_uploaded").length;

  return (
<div className="bg-white">
  <TopBar />
  <div className="min-h-screen flex items-center justify-center">
  <div className="p-5 w-full max-w-[800px] font-sans">
    <h1 className="text-2xl font-bold mb-4 text-center">
      Upload Large Files & Folders
    </h1>

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
      <>
        <div className="mb-4 text-sm text-gray-700">
          <div><strong>Total files:</strong> {files.length}</div>
          <div><strong>Not uploaded:</strong> {notUploadedCount}</div>
        </div>

        {/* SCROLLABLE FILE LIST */}
        <div className="mt-5 space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {files.map(({ file, relativePath }, index) => {
            const currentStatus = status[relativePath];
            return (
              <div
                key={relativePath}
                className={`p-2 border rounded-lg shadow-sm ${
                  currentStatus === "done"
                    ? "bg-green-50 border-green-300"
                    : currentStatus === "not_uploaded"
                    ? "bg-red-50 border-red-300"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center">
                  <span
                    className="w-[300px] truncate font-medium text-gray-800 text-sm"
                    title={relativePath}
                  >
                    {index + 1}. {relativePath}
                  </span>

                  <div className="flex-1 h-2 bg-gray-200 rounded mx-2 overflow-hidden">
                    <div
                      className={`h-full ${
                        currentStatus === "done"
                          ? "bg-green-500"
                          : currentStatus === "not_uploaded"
                          ? "bg-red-500"
                          : "bg-blue-500"
                      }`}
                      style={{ width: `${progress[relativePath]?.percent || 0}%` }}
                    />
                  </div>

                  <span className="w-20 text-right text-xs">
                    {currentStatus === "done"
                      ? "✔️"
                      : currentStatus === "not_uploaded"
                      ? "Not Uploaded"
                      : `${progress[relativePath]?.percent || 0}%`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </>
    )}
  </div>
</div>
</div>

  );
}
