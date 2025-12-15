"use client";
import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  async function upload() {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(
      "http://34.121.190.37:8000/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    setLoading(false);

    if (!res.ok) {
      alert("Upload failed");
      return;
    }

    alert("Uploaded successfully");
  }

  return (
    <div style={{ padding: 40 }}>
      <input
        type="file"
        onChange={(e) =>
          setFile(e.target.files?.[0] || null)
        }
      />
      <br /><br />
      <button onClick={upload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
