import { useEffect, useState } from "react";
import { createUser, deleteUser, getAllUsers, updateUser } from "../../api/userApi";

function AddUser() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editRole, setEditRole] = useState("");

  const addUser = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await createUser(name, password, email, role);
      setMessage({ type: "success", text: "User created successfully!" });
      setName(""); setPassword(""); setEmail(""); setRole("");
    } catch (error) {
      setMessage({ type: "error", text: "Failed to create user. Please try again." });
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getUser = async () => {
    setUsersLoading(true);
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      setUsersError("Failed to load users. Please try again.");
      console.log(error);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => { getUser(); }, []);

  const delUser = async (email: string) => {
    try {
      await deleteUser(email);
      getUser();
    } catch (error) {
      console.log(error);
    }
  };

  const updUser = async (email: string, data: any) => {
    try {
      await updateUser(email, data);
      setSelectedUser(null);
      getUser();
    } catch (error) {
      console.log(error);
    }
  };

  const getInitials = (name: string) =>
    name ? name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() : "?";

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

  const labelClass = "flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5";

  const roleBadge: Record<string, string> = {
    ADMIN:    "bg-blue-50 text-blue-700 border border-blue-100",
    EMPLOYEE: "bg-green-50 text-green-700 border border-green-100",
  };

  const avatarColor: Record<string, string> = {
    ADMIN:    "bg-blue-100 text-blue-700",
    EMPLOYEE: "bg-green-100 text-green-700",
  };

  const roleIcon: Record<string, string> = {
    ADMIN:    "ti-shield",
    EMPLOYEE: "ti-user",
  };

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-10">
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-7 w-full max-w-md">

            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                  <i className="ti ti-user-edit text-blue-700 text-sm" aria-hidden="true" />
                </div>
                Edit user
              </h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition"
                aria-label="Close"
              >
                <i className="ti ti-x text-sm" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-4">
              {[
                { label: "Full name",      icon: "ti-user",     type: "text",     value: editName,     onChange: setEditName,     placeholder: "" },
                { label: "Email address",  icon: "ti-mail",     type: "email",    value: editEmail,    onChange: setEditEmail,    placeholder: "" },
                { label: "Password",       icon: "ti-lock",     type: "password", value: editPassword, onChange: setEditPassword, placeholder: "Leave blank to keep unchanged" },
              ].map(({ label, icon, type, value, onChange, placeholder }) => (
                <div key={label}>
                  <label className={labelClass}>
                    <i className={`ti ${icon}`} aria-hidden="true" /> {label}
                  </label>
                  <input
                    type={type} value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={inputClass}
                  />
                </div>
              ))}
              <div>
                <label className={labelClass}>
                  <i className="ti ti-shield" aria-hidden="true" /> Role
                </label>
                <select value={editRole} onChange={(e) => setEditRole(e.target.value)} className={inputClass + " cursor-pointer"}>
                  <option value="">Select role</option>
                  <option value="ADMIN">Admin</option>
                  <option value="EMPLOYEE">Employee</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-7 pt-6 border-t border-gray-100">
              <button
                onClick={() => setSelectedUser(null)}
                className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg px-4 py-2.5 hover:bg-gray-50 transition"
              >
                <i className="ti ti-x text-xs" aria-hidden="true" /> Cancel
              </button>
              <button
                onClick={() => updUser(selectedUser.email, { name: editName, email: editEmail, password: editPassword, role: editRole })}
                className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg px-4 py-2.5 transition"
              >
                <i className="ti ti-check text-xs" aria-hidden="true" /> Update user
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-7 pb-5 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <i className="ti ti-user-plus text-gray-400 text-xl" aria-hidden="true" />
          Create user
        </h1>
        <p className="text-sm text-gray-500 mt-1">Add a new team member and assign their role</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-7 max-w-lg shadow-sm">
        {message && (
          <div className={`mb-5 flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm border ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-600"
          }`}>
            <i className={`ti ${message.type === "success" ? "ti-circle-check" : "ti-alert-circle"} flex-shrink-0`} aria-hidden="true" />
            {message.text}
          </div>
        )}

        <div className="space-y-4">
          {[
            { label: "Full name",     icon: "ti-user",  type: "text",     value: name,     onChange: setName,     placeholder: "Enter name"     },
            { label: "Email address", icon: "ti-mail",  type: "email",    value: email,    onChange: setEmail,    placeholder: "Enter email"    },
            { label: "Password",      icon: "ti-lock",  type: "password", value: password, onChange: setPassword, placeholder: "Enter password" },
          ].map(({ label, icon, type, value, onChange, placeholder }) => (
            <div key={label}>
              <label className={labelClass}>
                <i className={`ti ${icon}`} aria-hidden="true" /> {label}
              </label>
              <input
                type={type} value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={inputClass}
              />
            </div>
          ))}
          <div>
            <label className={labelClass}>
              <i className="ti ti-shield" aria-hidden="true" /> Role
            </label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className={inputClass + " cursor-pointer"}>
              <option value="">Select role</option>
              <option value="ADMIN">Admin</option>
              <option value="EMPLOYEE">Employee</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-6 border-t border-gray-100">
          <button
            onClick={addUser} disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <i className={`ti ${loading ? "ti-loader-2 animate-spin" : "ti-user-plus"} text-sm`} aria-hidden="true" />
            {loading ? "Creating…" : "Create user"}
          </button>
          <button
            onClick={() => { setName(""); setPassword(""); setEmail(""); setRole(""); setMessage(null); }}
            className="flex items-center justify-center gap-1.5 px-5 py-2.5 border border-gray-200 text-gray-500 text-sm rounded-lg hover:bg-gray-50 transition-colors"
          >
            <i className="ti ti-eraser text-sm" aria-hidden="true" /> Clear
          </button>
        </div>
      </div>

      <div className="mb-6 pb-5 border-b border-gray-200 mt-12">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <i className="ti ti-users text-gray-400 text-xl" aria-hidden="true" />
          All users
        </h2>
        <p className="text-sm text-gray-500 mt-1">Manage your team members</p>
      </div>

      {usersLoading && (
        <div className="flex items-center justify-center gap-2.5 text-gray-400 text-sm py-16">
          <div className="w-4 h-4 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
          Loading users…
        </div>
      )}

      {usersError && !usersLoading && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
          <span className="flex items-center gap-2">
            <i className="ti ti-alert-circle" aria-hidden="true" /> {usersError}
          </span>
          <button onClick={getUser} className="text-red-600 underline hover:text-red-800 ml-4 font-medium">Retry</button>
        </div>
      )}

      {!usersLoading && !usersError && users.length === 0 && (
        <div className="text-center py-20">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <i className="ti ti-users text-gray-400 text-xl" aria-hidden="true" />
          </div>
          <p className="text-sm font-medium text-gray-500">No users found</p>
          <p className="text-xs text-gray-400 mt-1">Create a user above to get started</p>
        </div>
      )}

      {!usersLoading && !usersError && users.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5"><i className="ti ti-user text-xs" aria-hidden="true" />Name</span>
                </th>
                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5"><i className="ti ti-mail text-xs" aria-hidden="true" />Email</span>
                </th>
                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5"><i className="ti ti-shield text-xs" aria-hidden="true" />Role</span>
                </th>
                <th className="px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5"><i className="ti ti-settings text-xs" aria-hidden="true" />Action</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${avatarColor[user.role] ?? "bg-gray-100 text-gray-600"}`}>
                        {getInitials(user.name || "")}
                      </div>
                      <span className="font-medium text-gray-800">{user.name || "—"}</span>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <i className="ti ti-mail text-sm text-gray-400" aria-hidden="true" />
                      {user.email || "—"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${roleBadge[user.role] ?? "bg-gray-100 text-gray-600 border border-gray-200"}`}>
                      <i className={`ti ${roleIcon[user.role] ?? "ti-user"} text-xs`} aria-hidden="true" />
                      {user.role?.charAt(0) + user.role?.slice(1).toLowerCase()}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => delUser(user.email)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <i className="ti ti-trash text-xs" aria-hidden="true" /> Delete
                      </button>
                      <button
                        onClick={() => { setSelectedUser(user); setEditName(user.name); setEditEmail(user.email); setEditPassword(""); setEditRole(user.role); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <i className="ti ti-pencil text-xs" aria-hidden="true" /> Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AddUser;