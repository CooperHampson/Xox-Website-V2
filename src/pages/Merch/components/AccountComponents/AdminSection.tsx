import { useState } from 'react';
import { getAdminUsers, updateAdminUserRole, deactivateAdminUser, activateAdminUser, type AdminUser } from '../../../../api/adminApi';

export function AdminSection() {
  const [showUsers, setShowUsers] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleManageUsers() {
    setShowUsers(true);
    setSelectedUser(null);
    setError('');
    setLoading(true);

    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(role: AdminUser['role']) {
    if (!selectedUser) return;

    setError('');

    try {
      const updatedUser = await updateAdminUserRole(
        selectedUser.id,
        role,
      );

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === updatedUser.id ? { ...user, ...updatedUser } : user,
        ),
      );

      setSelectedUser((currentUser) =>
        currentUser
          ? { ...currentUser, ...updatedUser }
          : currentUser,
      );
    } catch {
      setError('Failed to update user role.');
    }
  }

  async function handleStatusChange() {
    if (!selectedUser) return;

    setError('');

    try {
      const updatedUser = selectedUser.isActive
        ? await deactivateAdminUser(selectedUser.id)
        : await activateAdminUser(selectedUser.id);

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === updatedUser.id ? { ...user, ...updatedUser } : user,
        ),
      );

      setSelectedUser((currentUser) =>
        currentUser
          ? { ...currentUser, ...updatedUser }
          : currentUser,
      );
    } catch {
      setError(
        selectedUser.isActive
          ? 'Failed to deactivate user.'
          : 'Failed to activate user.',
      );
    }
  }

  return (
    <section>
      <h2>Admin</h2>

      <button type="button" onClick={handleManageUsers}>
        Manage Users
      </button>

      <button type="button">
        Manage Merch
      </button>

      {showUsers && (
        <div>
          <h3>Users</h3>

          {loading && <p>Loading users...</p>}

          {error && <p>{error}</p>}

          {!loading && !error && (
            <>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </td>
                      <td>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => setSelectedUser(user)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {selectedUser && (
                <div>
                  <h3>User Details</h3>

                  <p>
                    <strong>ID:</strong> {selectedUser.id}
                  </p>

                  <p>
                    <strong>Username:</strong> {selectedUser.username}
                  </p>

                  <p>
                    <strong>Email:</strong> {selectedUser.email}
                  </p>

                  <label>
                    <strong>Role:</strong>{' '}
                    <select
                      value={selectedUser.role}
                      onChange={(event) =>
                        handleRoleChange(event.target.value as AdminUser['role'])
                      }
                    >
                      <option value="USER">User</option>
                      <option value="MODERATOR">Moderator</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </label>

                  <p>
                    <strong>Status:</strong>{' '}
                    {selectedUser.isActive ? 'Active' : 'Inactive'}
                  </p>

                  <button type="button" onClick={handleStatusChange}>
                    {selectedUser.isActive ? 'Deactivate User' : 'Activate User'}
                  </button>

                  <p>
                    <strong>Created:</strong>{' '}
                    {new Date(selectedUser.createdAt).toLocaleString()}
                  </p>

                  <p>
                    <strong>Username last changed:</strong>{' '}
                    {selectedUser.usernameUpdatedAt
                      ? new Date(
                        selectedUser.usernameUpdatedAt,
                      ).toLocaleString()
                      : 'Never'}
                  </p>

                  <p>
                    <strong>Email last changed:</strong>{' '}
                    {selectedUser.emailUpdatedAt
                      ? new Date(
                        selectedUser.emailUpdatedAt,
                      ).toLocaleString()
                      : 'Never'}
                  </p>

                  <p>
                    <strong>Password last changed:</strong>{' '}
                    {selectedUser.passwordUpdatedAt
                      ? new Date(
                        selectedUser.passwordUpdatedAt,
                      ).toLocaleString()
                      : 'Never'}
                  </p>

                  <button
                    type="button"
                    onClick={() => setSelectedUser(null)}
                  >
                    Close
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}