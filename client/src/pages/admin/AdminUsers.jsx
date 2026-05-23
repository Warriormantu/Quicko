import { useState, useEffect } from 'react';
import { FiSearch, FiShield, FiSlash } from 'react-icons/fi';
import AdminLayout from '../../components/layout/AdminLayout';
import { userAPI } from '../../services/api';
import { Spinner, Badge } from '../../components/ui';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [toggling, setToggling] = useState('');

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await userAPI.getAll({ page, limit: 20 });
        setUsers(data.users || []);
        setTotal(data.total || 0);
      } catch {}
      setLoading(false);
    };
    fetch();
  }, [page]);

  const handleToggleBlock = async (userId) => {
    setToggling(userId);
    try {
      const data = await userAPI.toggleBlock(userId);
      setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, isBlocked: data.user.isBlocked } : u));
      toast.success(data.message);
    } catch (e) { toast.error(e.message); }
    setToggling('');
  };

  const handleRoleChange = async (userId, role) => {
    try {
      const data = await userAPI.updateRole(userId, role);
      setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, role: data.user.role } : u));
      toast.success('Role updated');
    } catch (e) { toast.error(e.message); }
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-brand-primary">Users</h2>
            <p className="text-brand-secondary text-sm">{total} total users</p>
          </div>
        </div>

        <div className="relative max-w-xs">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={14} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="input-field pl-9 py-2 text-sm" />
        </div>

        {loading ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : (
          <div className="glass-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-brand-border/50">
                <tr className="text-brand-muted text-xs uppercase">
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left hidden sm:table-cell">Email</th>
                  <th className="px-4 py-3 text-center">Role</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/30">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-brand-border/10 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center">
                          <span className="text-brand-gold text-xs font-bold">{user.name?.[0]?.toUpperCase()}</span>
                        </div>
                        <span className="font-medium text-brand-primary">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-brand-secondary">{user.email}</td>
                    <td className="px-4 py-3 text-center">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        disabled={user.role === 'admin'}
                        className="bg-transparent text-xs border border-brand-border rounded-lg px-2 py-1 text-brand-secondary disabled:opacity-50"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={user.isBlocked ? 'danger' : 'success'}>
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleBlock(user._id)}
                          disabled={toggling === user._id}
                          className={`text-xs flex items-center gap-1 ml-auto transition-colors ${user.isBlocked ? 'text-brand-success hover:text-brand-success/80' : 'text-brand-danger hover:text-brand-danger/80'}`}
                        >
                          {toggling === user._id ? <Spinner size="sm" /> : user.isBlocked ? <><FiShield size={12} /> Unblock</> : <><FiSlash size={12} /> Block</>}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
