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
  const fileInputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    addFiles(Array.from(e.dataTransfer.files));
  };

  const handleSelectFiles = (e) => {
    if (!e.target.files) return;
    addFiles(Array.from(e.target.files));
  };

  // Add files to state without losing existing files
  const addFiles = (newFiles) => {
    setFiles((prev) => {
      const combined = [...prev];
      newFiles.forEach((file) => {
        if (!combined.find((f) => f.name === file.name && f.size === file.size)) {
          combined.push(file);
        }
      });
      return combined;
    });
  };

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  const formatBytes = (bytes) => {
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    if (!bytes) return "0 B";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
  };

  const uploadFile = async (file) => {
    try {
      // 1️⃣ Get signed URL from backend
      const res = await fetch(
        "https://zzsn3hdk-4001.inc1.devtunnels.ms/api/v1/upload/create-resumable-upload",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: file.webkitRelativePath || file.name, content_type: file.type || "application/octet-stream" }),
        }
      );

      if (!res.ok) throw new Error("Failed to get signed URL");
      const { signedUrl } = await res.json();

      // 2️⃣ Start resumable session
      const startRes = await fetch(signedUrl, {
        method: "POST",
        headers: { "Content-Type": file.type || "application/octet-stream", "x-goog-resumable": "start" },
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
          [file.name]: { percent: Math.floor((offset / file.size) * 100), speed },
        }));
      }
    } catch (err) {
      console.error(err);
      setProgress((p) => ({ ...p, [file.name]: { ...p[file.name], error: true } }));
    }
  };

  const uploadAll = async () => {
    await Promise.all(files.map(uploadFile));
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "auto", fontFamily: "sans-serif" }}>
      <h1>Upload Large Files & Folders</h1>

     <div
  onDrop={handleDrop}
  onDragOver={(e) => e.preventDefault()}
  style={{
    border: "2px dashed #888",
    borderRadius: 10,
    padding: 40,
    textAlign: "center",
    cursor: "pointer",
  }}
  onClick={() => fileInputRef.current.click()}
>
  Drag & Drop files here or click to select
</div>

<input
  type="file"
  multiple
  webkitdirectory="true"   // <- allows folder selection
  directory="true"         // <- fallback attribute
  ref={fileInputRef}
  style={{ display: "none" }}
  onChange={handleSelectFiles}
/>


      {files.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <strong>Total files:</strong> {files.length} <br />
          <strong>Total size:</strong> {formatBytes(totalSize)}
        </div>
      )}

      <button onClick={uploadAll} style={{ padding: "10px 20px", borderRadius: 5, cursor: "pointer" }}>
        Upload All
      </button>

      <div style={{ marginTop: 20 }}>
        {files.map((file) => (
          <div key={file.name} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ width: 150 }}>{file.name}</span>
              <div style={{ flex: 1, height: 15, background: "#eee", borderRadius: 5, margin: "0 10px" }}>
                <div
                  style={{
                    width: `${progress[file.name]?.percent || 0}%`,
                    height: "100%",
                    background: progress[file.name]?.error ? "red" : "#4caf50",
                    borderRadius: 5,
                  }}
                ></div>
              </div>
              <span>{progress[file.name]?.percent || 0}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
