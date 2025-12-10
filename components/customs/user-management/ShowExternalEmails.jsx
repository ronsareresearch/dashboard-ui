"use client";

import React, { useState, useEffect } from "react";
import { XCircle, Mail, Trash2 } from "lucide-react";
import { emailApi } from "@/app/lib/apis";

const ShowExternalEmails = ({ setIsGmailList }) => {
  const [externalEmailOptions, setExternalEmailOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchExternalEmails = async () => {
      try {
        setLoading(true);
        const res = await emailApi.get("/get-external-emails");
        setExternalEmailOptions(res.data?.external_emails || []);
      } catch (err) {
        console.error("Failed to load external emails:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExternalEmails();
  }, []);

  // ✅ DELETE HANDLER

  const handleDelete = async (emailId) => {
  try {
    setDeletingId(emailId);

    await emailApi.delete(`/delete-email/${encodeURIComponent(emailId)}`);

    setExternalEmailOptions((prev) =>
      prev.filter((email) => email !== emailId)
    );
  } catch (err) {
    console.error("Failed to delete email:", err);
    alert("Failed to delete email");
  } finally {
    setDeletingId(null);
  }
};



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={() => setIsGmailList(false)}
      />

      <div className="relative bg-white rounded-2xl border shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
        
        {/* ✅ HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold">Active External Emails</h3>
            <p className="text-sm text-gray-500">
              Connected Gmail accounts
            </p>
          </div>

          <button onClick={() => setIsGmailList(false)}>
            <XCircle className="w-7 h-7 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* ✅ CONTENT */}
        <div className="space-y-3">
          {/* ✅ Loading State */}
          {loading && (
            <div className="text-center py-10 text-gray-500">
              Loading external emails...
            </div>
          )}

          {/* ✅ Empty State */}
          {!loading && externalEmailOptions.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No external emails found.
            </div>
          )}

          {/* ✅ Render List */}
          {!loading &&
            externalEmailOptions.map((item) => (
              <div
                key={item}
                className="flex items-center justify-between px-4 py-3 border rounded-xl hover:bg-gray-50 transition"
              >
                {/* ✅ LEFT SIDE */}
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Mail className="w-5 h-5 text-yellow-600" />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">
                      {item}
                    </p>
                    <p className="text-xs text-gray-500">
                      Connected
                    </p>
                  </div>
                </div>

                {/* ✅ RIGHT SIDE DELETE ICON */}
                <button
                  onClick={() => handleDelete(item)}
                  disabled={deletingId === item}
                  className="p-2 rounded-lg hover:bg-red-50 transition"
                >
                  <Trash2
                    className={`w-5 h-5 ${
                      deletingId === item
                        ? "text-gray-400"
                        : "text-red-500 hover:text-red-600"
                    }`}
                  />
                </button>
              </div>
            ))}
        </div>

      </div>
    </div>
  );
};

export default ShowExternalEmails;
