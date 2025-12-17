// "use client";
// import { useState } from "react";

// export default function UploadPage() {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);

//   async function upload() {
//     if (!file) return;

//     setLoading(true);
//     const formData = new FormData();
//     formData.append("file", file);

//     const res = await fetch(
//       "https://9648b3f0142f.ngrok-free.app/upload",
//       {
//         method: "POST",
//         body: formData,
//       }
//     );

//     setLoading(false);

//     if (!res.ok) {
//       alert("Upload failed");
//       return;
//     }

//     alert("Uploaded successfully");
//   }

//   return (
//     <div style={{ padding: 40 }}>
//       <input
//         type="file"
//         onChange={(e) =>
//           setFile(e.target.files?.[0] || null)
//         }
//       />
//       <br /><br />
//       <button onClick={upload} disabled={loading}>
//         {loading ? "Uploading..." : "Upload"}
//       </button>
//     </div>
//   );
// }


// -----------------------------



// "use client";

// import { useState } from "react";

// export default function UploadPage() {
//   const [progress, setProgress] = useState({});
//   const [logs, setLogs] = useState([]);

//   const log = (msg) =>
//     setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

//   async function uploadFile(file) {
//     log(`Requesting resumable URL for ${file.name}`);

//     // 1️⃣ Ask backend for signed URL
//     const res = await fetch("https://zzsn3hdk-4001.inc1.devtunnels.ms/api/v1/api/v1/upload/create-resumable-upload", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         filename: file.name,
//         content_type: file.type || "application/octet-stream",
//       }),
//     });

//     if (!res.ok) throw new Error("Failed to get signed URL");

//     const { signedUrl } = await res.json();

//     // 2️⃣ Start resumable session
//     const startRes = await fetch(signedUrl, {
//       method: "POST",
//       headers: {
//         "Content-Type": file.type || "application/octet-stream",
//         "x-goog-resumable": "start",
//       },
//     });

//     const uploadUrl = startRes.headers.get("Location");
//     if (!uploadUrl) throw new Error("Failed to start resumable upload");

//     log(`Resumable session started for ${file.name}`);

//     // 3️⃣ Upload in chunks
//     const chunkSize = 8 * 1024 * 1024; // 8MB
//     let offset = 0;

//     while (offset < file.size) {
//       const chunk = file.slice(offset, offset + chunkSize);
//       const end = Math.min(offset + chunkSize, file.size) - 1;

//       const uploadRes = await fetch(uploadUrl, {
//         method: "PUT",
//         headers: {
//           "Content-Length": String(chunk.size),
//           "Content-Range": `bytes ${offset}-${end}/${file.size}`,
//         },
//         body: chunk,
//       });

//       if (![200, 201, 308].includes(uploadRes.status)) {
//         throw new Error(`Upload failed at ${offset}`);
//       }

//       offset += chunk.size;

//       setProgress((p) => ({
//         ...p,
//         [file.name]: Math.floor((offset / file.size) * 100),
//       }));
//     }

//     log(`✅ Uploaded ${file.name}`);
//   }

//   async function uploadAll(e) {
//     if (!e.target.files) return;
//     const files = Array.from(e.target.files);

//     for (const file of files) {
//       await uploadFile(file);
//     }
//   }

//   return (
//     <div style={{ padding: 30 }}>
//       <h1>Large File Upload (30GB+)</h1>

//       <input type="file" multiple onChange={uploadAll} />

//       <div style={{ marginTop: 20 }}>
//         {Object.entries(progress).map(([name, p]) => (
//           <div key={name}>
//             {name}: {p}%
//           </div>
//         ))}
//       </div>

//       <pre style={{ marginTop: 20, background: "#111", color: "#0f0", padding: 10 }}>
//         {logs.join("\n")}
//       </pre>
//     </div>
//   );
// }

"use client";

import { useState, useRef } from "react";

export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState({});
  const [status, setStatus] = useState({});
  const fileInputRef = useRef();

  const BATCH_SIZE = 2 * 1024 * 1024 * 1024; // 2 GB

  // Handle drag & drop
  const handleDrop = (e) => {
    e.preventDefault();
    addFiles(Array.from(e.dataTransfer.files));
  };

  // Handle file/folder selection
  const handleSelectFiles = (e) => {
    if (!e.target.files) return;
    addFiles(Array.from(e.target.files));
  };

  // Add new files, preserve folder structure
  const addFiles = (newFiles) => {
    setFiles((prev) => {
      const combined = [...prev];
      newFiles.forEach((file) => {
        const pathKey = file.webkitRelativePath || file.name;
        if (!combined.find((f) => (f.webkitRelativePath || f.name) === pathKey)) {
          combined.push(file);
          setStatus((s) => ({ ...s, [pathKey]: "pending" }));
        }
      });
      return combined;
    });
  };

  // Format file size
  const formatBytes = (bytes) => {
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    if (!bytes) return "0 B";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
  };

  // Upload single file
  const uploadFile = async (file) => {
    const pathKey = file.webkitRelativePath || file.name;
    try {
      setStatus((s) => ({ ...s, [pathKey]: "uploading" }));

      // 1️⃣ Get signed URL from backend
      const res = await fetch(
        "https://zzsn3hdk-4001.inc1.devtunnels.ms/api/v1/upload/create-resumable-upload",
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
      if (!uploadUrl) throw new Error("Failed to start resumable upload");

      // 3️⃣ Upload in chunks
      const chunkSize = 16 * 1024 * 1024; // 16 MB
      let offset = 0;
      const startTime = Date.now();

      while (offset < file.size) {
        const chunk = file.slice(offset, offset + chunkSize);
        const end = Math.min(offset + chunkSize, file.size) - 1;

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
    } catch (err) {
      console.error(err);
      setStatus((s) => ({ ...s, [pathKey]: "error" }));
      setProgress((p) => ({ ...p, [pathKey]: { ...p[pathKey], error: true } }));
    }
  };

  // Upload all pending/error files in 2GB batches
  const uploadAll = async () => {
    let batch = [];
    let batchSize = 0;

    for (const file of files) {
      const pathKey = file.webkitRelativePath || file.name;
      if (status[pathKey] === "pending" || status[pathKey] === "error") {
        if (batchSize + file.size > BATCH_SIZE && batch.length > 0) {
          await Promise.all(batch.map(uploadFile));
          batch = [];
          batchSize = 0;
        }
        batch.push(file);
        batchSize += file.size;
      }
    }

    if (batch.length > 0) {
      await Promise.all(batch.map(uploadFile));
    }
  };

  // Re-upload failed files only
  const reUploadFailed = async () => {
    const failedFiles = files.filter(
      (file) => status[file.webkitRelativePath || file.name] === "error"
    );
    if (failedFiles.length === 0) return;
    await Promise.all(failedFiles.map(uploadFile));
  };

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  const failedCount = files.filter(
    (file) => status[file.webkitRelativePath || file.name] === "error"
  ).length;

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
            <div>
              <strong>Total files:</strong> {files.length}
            </div>
            <div>
              <strong>Total size:</strong> {formatBytes(totalSize)}
            </div>
          </div>
        )}

        <div className="flex space-x-2 mb-4">
          <button
            onClick={uploadAll}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Upload All
          </button>
          <button
            onClick={reUploadFailed}
            className={`px-4 py-2 rounded-md text-white transition ${
              failedCount > 0 ? "bg-yellow-500 hover:bg-yellow-600" : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={failedCount === 0}
          >
            Re-upload Failed {failedCount > 0 && `(${failedCount})`}
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {files.map((file) => {
            const pathKey = file.webkitRelativePath || file.name;
            return (
              <div
                key={pathKey}
                className="p-2 border border-gray-200 rounded-lg bg-gray-50 shadow-sm"
              >
                <div className="flex items-center">
                  {/* File name with ellipsis */}
                  <span
                    className="w-[300px] truncate font-medium text-gray-800 text-sm"
                    title={pathKey}
                  >
                    {pathKey}
                  </span>

                  {/* Progress bar */}
                  <div className="flex-1 h-2 bg-gray-200 rounded mx-2 overflow-hidden">
                    <div
                      className={`h-full rounded transition-all duration-300 ${
                        status[pathKey] === "done"
                          ? "bg-green-500"
                          : status[pathKey] === "error"
                          ? "bg-red-500"
                          : "bg-blue-500"
                      }`}
                      style={{ width: `${progress[pathKey]?.percent || 0}%` }}
                    />
                  </div>

                  {/* Status / percent */}
                  <span className="w-12 text-right text-xs">
                    {status[pathKey] === "done"
                      ? "✔️"
                      : status[pathKey] === "error"
                      ? "❌"
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
