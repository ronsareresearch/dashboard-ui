"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Mail, Lock, Plus, XCircle } from "lucide-react";
import { AUTH_SERVER } from "@/app/constant/constant";

const API_BASE_URL = AUTH_SERVER;

const defaultPermissions = {
  main: { home: false, whatsapp: false, knowledge_base: false },
  customer: { immigration_services: false },
  emails: { inbox: false },
  documents: { forms: false, vault: false, search: false },
  user_management: { general: false, settings: false },
  resources: { docs: false, marketing_material: false, holidays: false },
};

const mergePermissions = (defaults, userPerms) => {
  const merged = { ...defaults };
  Object.keys(userPerms || {}).forEach((section) => {
    merged[section] = { ...defaults[section], ...userPerms[section] };
  });
  return merged;
};

const CreateUser = ({ show, onClose, userData, editUser }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user",
    access: "active",
    permissions: defaultPermissions,
    external_emails: [],
  });

  const [loading, setLoading] = useState(false);

  // ✅ Autofill on edit
  useEffect(() => {
    if (editUser && userData) {
      setFormData({
        email: userData.email || "",
        password: "",
        role: userData.role || "user",
        access: userData.access || "active",
        permissions: mergePermissions(
          defaultPermissions,
          userData.permissions
        ),
        external_emails: userData.external_emails || [],
      });
    } else {
      setFormData({
        email: "",
        password: "",
        role: "user",
        access: "active",
        permissions: defaultPermissions,
        external_emails: [],
      });
    }
  }, [editUser, userData]);

  if (!show) return null;

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const togglePermission = (section, key) =>
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [section]: {
          ...prev.permissions[section],
          [key]: !prev.permissions[section][key],
        },
      },
    }));

  const addExternalEmail = () =>
    setFormData((prev) => ({
      ...prev,
      external_emails: [...prev.external_emails, ""],
    }));

  const handleExternalEmailChange = (index, value) => {
    const updated = [...formData.external_emails];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, external_emails: updated }));
  };

  const removeExternalEmail = (index) => {
    const updated = [...formData.external_emails];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, external_emails: updated }));
  };

  // ✅ MAIN SUBMIT HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editUser) {
        // ✅ UPDATE USER
        await axios.put(
          `${API_BASE_URL}/users/update/${formData.email}`,
          {
            role: formData.role,
            access: formData.access,
            permissions: formData.permissions,
            external_emails: formData.external_emails,
          },
          { withCredentials: true }
        );
      } else {
        // ✅ CREATE USER
        await axios.post(
          `${API_BASE_URL}/register`,
          formData,
          { withCredentials: true }
        );
      }

      onClose(); // close modal after success
    } catch (err) {
      console.error("User save error:", err);
      alert(err?.response?.data?.detail || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl border shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {editUser ? "Edit User" : "Create User"}
              </h3>
              <p className="text-sm text-gray-500">
                {editUser ? "Modify existing user" : "Add new user"}
              </p>
            </div>
          </div>

          <button onClick={onClose}>
            <XCircle className="w-7 h-7 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                disabled={!!editUser}
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 border rounded-lg px-3 py-2"
                required
              />
            </div>
          </div>

          {/* PASSWORD */}
          {!editUser && (
            <div>
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 border rounded-lg px-3 py-2"
                  required
                />
              </div>
            </div>
          )}

          {/* ROLE & ACCESS */}
          <div className="grid grid-cols-2 gap-4">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
            >
              <option value="user">User</option>
              <option value="finance">Finance</option>
              <option value="moderator">Moderator</option>
            </select>

            <select
              name="access"
              value={formData.access}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
            >
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
              <option value="restricted">Restricted</option>
            </select>
          </div>

          {/* PERMISSIONS */}
          <div>
            <h4 className="font-semibold mb-2">Permissions</h4>
            {Object.keys(formData.permissions).map((section) => (
              <div key={section} className="border p-3 rounded-lg mb-3">
                <h5 className="capitalize font-medium">{section}</h5>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {Object.keys(formData.permissions[section]).map((key) => (
                    <label key={key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.permissions[section][key]}
                        onChange={() => togglePermission(section, key)}
                      />
                      {key.replace(/_/g, " ")}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* EXTERNAL EMAILS */}
          <div>
            <h4 className="font-semibold mb-2">External Emails</h4>

            {formData.external_emails.map((email, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  value={email}
                  onChange={(e) =>
                    handleExternalEmailChange(idx, e.target.value)
                  }
                  className="w-full border rounded px-3 py-2"
                />
                <button
                  type="button"
                  onClick={() => removeExternalEmail(idx)}
                  className="px-3 bg-red-600 text-white rounded"
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addExternalEmail}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Add Email
            </button>
          </div>

          {/* SUBMIT */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {loading
                ? "Saving..."
                : editUser
                ? "Update User"
                : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
