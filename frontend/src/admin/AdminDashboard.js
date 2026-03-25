

import React, { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    const res = await fetch("https://ai-flow-app-nz0f.onrender.com/api/admin/history");
    const data = await res.json();
    setUsers(data);
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete user?")) return;

    await fetch(`https://ai-flow-app-nz0f.onrender.com/api/admin/user/${id}`, {
      method: "DELETE",
    });

    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* 🔵 Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-black text-white p-5">
        <h2 className="text-2xl font-bold mb-6">⚡ Admin</h2>
        <p className="mb-3">📊 Dashboard</p>
        <p>👤 Users</p>
      </div>

      {/* 🟢 Main */}
      <div className="flex-1 p-4 md:p-8">
        
        {/* 🔝 Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-3">
          <h1 className="text-2xl font-bold">📊 Admin Dashboard</h1>

          <input
            type="text"
            placeholder="Search user..."
            className="px-4 py-2 border rounded-lg w-full md:w-80"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* 👤 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((user) => (
            <div
              key={user.user_id}
              className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>

              <div className="mt-3 text-sm">
                <p>🧠 Prompts: {user.total_prompts}</p>
                <p>
                  ⏱{" "}
                  {user.last_activity
                    ? new Date(user.last_activity).toLocaleString("en-IN", {
  timeZone: "Asia/Kolkata",
  dateStyle: "medium",
  timeStyle: "short",
})
                    : "No activity"}
                </p>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setSelectedUser(user)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 rounded px-3 py-1"
                >
                  👁 View
                </button>

                <button
                  onClick={() => deleteUser(user.user_id)}
                  className="flex-1 bg-red-500 text-white hover:bg-red-600 rounded px-3 py-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-xl p-6">
            
            <h2 className="text-xl font-bold mb-4">
              {selectedUser.name} Activity
            </h2>

            {selectedUser.history.length === 0 && (
              <p>No history</p>
            )}

            {selectedUser.history.map((item, i) => (
              <div
                key={i}
                className="border-b py-3 text-sm"
              >
                <p><b>Prompt:</b> {item.prompt}</p>
                <p><b>Response:</b> {item.response}</p>
                <p className="text-gray-500">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
            ))}

            <button
              onClick={() => setSelectedUser(null)}
              className="mt-4 bg-black text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}