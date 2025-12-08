"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { AUTH_SERVER } from "@/app/constant/constant";
import {
  Search,
  Plus,
  Edit,
  User,
  Shield,
  Lock,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  RefreshCw
} from "lucide-react";
import CreteUser from "./CreteUser";

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
    role: "user",
    access: "active",
    permissions: {},
    external_emails: [],
  });

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
    const matchesSearch = u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase());
    const matchesRole = selectedRole === "all" || u.role === selectedRole;
    const matchesAccess = selectedAccess === "all" || u.access === selectedAccess;
    return matchesSearch && matchesRole && matchesAccess;
  });

  const openCreateModal = () => {
    setEditUser(null);
    setFormData({
      email: "",
      password: "",
      role: "user",
      access: "active",
      permissions: {},
      external_emails: [],
    });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setEditUser(user);
    setFormData({
      email: user.email,
      password: "",
      role: user.role,
      access: user.access,
      permissions: user.permissions,
      external_emails: user.external_emails,
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
      case "active": return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "blocked": return <XCircle className="w-5 h-5 text-red-500" />;
      case "restricted": return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default: return <CheckCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin": return <Shield className="w-5 h-5 text-purple-500" />;
      case "user": return <User className="w-5 h-5 text-blue-500" />;
      default: return <User className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600">Manage user accounts, roles, and access permissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.access === "active").length}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Admins</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.role === "admin").length}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Shield className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Restricted</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.access === "restricted").length}
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </div>
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
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${u.access === "active"
                            ? "bg-green-100 text-green-800"
                            : u.access === "blocked"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          } capitalize`}>
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
        <CreteUser
          show={showModal}
          onClose={() => setShowModal(false)}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          editUser={editUser}
          userData={formData}
        />
      )}
    </div>
  );
};

export default UserProfile;