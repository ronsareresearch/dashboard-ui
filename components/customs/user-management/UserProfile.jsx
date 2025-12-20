"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { AUTH_SERVER, EMAIL_SERVER } from "@/app/constant/constant";
import {
  Search,
  Plus,
  Edit,
  User,
  Shield,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  RefreshCw,
  List
} from "lucide-react";
import ShowExternalEmails from "./ShowExternalEmails";
import CreateUser from "./CreteUser";

const API_BASE_URL = AUTH_SERVER;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const UserProfile = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedAccess, setSelectedAccess] = useState("all");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    role: "user",
    access: "active",
    permissions: {
      main: { home: false, whatsapp: false, knowledge_base: false },
      customer: { immigration_services: false },
      emails: { inbox: false },
      documents: { forms: false, vault: false, search: false },
      user_management: { general: false, settings: false },
      resources: { docs: false, marketing_material: false, holidays: false },
    },
    external_emails: [],
    phone_number: "",
  });
  const [isGmailList, setIsGmailList] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users");
      setUsers(res.data.users);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => setSearch(e.target.value);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase());
    const matchesRole = selectedRole === "all" || u.role === selectedRole;
    const matchesAccess =
      selectedAccess === "all" || u.access === selectedAccess;
    return matchesSearch && matchesRole && matchesAccess;
  });

  const openCreateModal = () => {
    setEditUser(null);
    setFormData({
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      role: "user",
      access: "active",
      permissions: {
        main: { home: false, whatsapp: false, knowledge_base: false },
        customer: { immigration_services: false },
        emails: { inbox: false },
        documents: { forms: false, vault: false, search: false },
        user_management: { general: false, settings: false },
        resources: { docs: false, marketing_material: false, holidays: false },
      },
      external_emails: [],
      phone_number: "",
    });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditUser(user);
    setFormData({
      email: user.email,
      password: "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      role: user.role,
      access: user.access,
      permissions: user.permissions,
      external_emails: user.external_emails,
      phone_number: user.phone_number || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editUser) {
        await api.put(`/users/update/${editUser.email}`, formData);
      } else {
        await api.post("/register", formData);
      }
      await fetchUsers();
      setShowModal(false);
    } catch (err) {
      console.error("Error saving user:", err);
      alert(err?.response?.data?.detail || "Failed to save user.");
    }
  };

  const getAccessIcon = (access) => {
    switch (access) {
      case "active":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "blocked":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "restricted":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <Shield className="w-5 h-5 text-purple-500" />;
      case "user":
        return <User className="w-5 h-5 text-blue-500" />;
      default:
        return <User className="w-5 h-5 text-gray-400" />;
    }
  };

  const addEmail = () => {
    window.location.href = `${EMAIL_SERVER}/auth/google`;
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          User Management
        </h1>
        <p className="text-gray-600">
          Manage user accounts, roles, and access permissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {/* Total Users */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <User className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter((u) => u.access === "active").length}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>

        {/* Admins */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Admins</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter((u) => u.role === "admin").length}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Shield className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Restricted */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Restricted</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter((u) => u.access === "restricted").length}
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Add Gmail */}
        <button
          className="relative flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg bg-yellow-100/50 border border-gray-300 hover:shadow-md hover:bg-gray-50 transition-all text-gray-900 text-sm font-bold"
          onClick={addEmail}
        >
          {/* Google Icon */}
          <svg
            className="w-4 h-4"
            viewBox="0 0 533.5 544.3"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M533.5 278.4c0-17.6-1.6-34.5-4.7-51H272v96.6h146.9c-6.3 33.7-25.1 62.3-53.6 81.5v67.6h86.7c50.6-46.6 79.5-115.2 79.5-194.7z"
              fill="#4285F4"
            />
            <path
              d="M272 544.3c72.6 0 133.6-24.1 178.1-65.6l-86.7-67.6c-24.1 16.2-55 25.8-91.4 25.8-70 0-129.4-47.2-150.6-110.3H33.5v69.3c44.2 87 134.7 148.4 238.5 148.4z"
              fill="#34A853"
            />
            <path
              d="M121.5 320.6c-10.3-30.9-10.3-64.8 0-95.7v-69.3H33.5c-40.5 79-40.5 173.4 0 252.4l88-87.4z"
              fill="#FBBC05"
            />
            <path
              d="M272 107.5c37.6-.6 71.2 13 97.6 38.2l73-73C405.1 24.1 344.1 0 272 0 168.2 0 77.7 61.4 33.5 148.4l88 69.3C142.6 154.7 202 107.5 272 107.5z"
              fill="#EA4335"
            />
          </svg>

          Add Gmail

          {/* Eye / List Icon in Top-Right */}
          <span
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            onClick={(e) => {
              e.stopPropagation();
              setIsGmailList(true);
            }}
          >
            <List className="w-3.5 h-3.5" />
          </span>
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users by email or role..."
              value={search}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-sm"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={selectedAccess}
                onChange={(e) => setSelectedAccess(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
                <option value="restricted">Restricted</option>
              </select>
            </div>

            <button
              onClick={fetchUsers}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>

            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create User
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading users...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                    onClick={() => openEditModal(u)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="shrink-0 h-10 w-10 bg-linear-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
                          <Mail className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{u.email}</div>
                          <div className="text-sm text-gray-500">ID: {u.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(u.role)}
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize">
                          {u.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getAccessIcon(u.access)}
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            u.access === "active"
                              ? "bg-green-100 text-green-800"
                              : u.access === "blocked"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          } capitalize`}
                        >
                          {u.access}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(u);
                        }}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <CreateUser
          show={showModal}
          onClose={() => setShowModal(false)}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          editUser={editUser}
          userData={formData}
        />
      )}

      {/* Gmail List Modal */}
      {isGmailList && (
        <ShowExternalEmails
          setIsGmailList={setIsGmailList}
        />
      )}
    </div>
  );
};

export default UserProfile;
