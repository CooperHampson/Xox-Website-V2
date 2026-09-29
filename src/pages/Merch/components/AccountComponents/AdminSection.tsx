import { useState } from 'react';
import { getAdminUsers, updateAdminUserRole, deactivateAdminUser, activateAdminUser, updateAdminUsername, updateAdminPassword, type AdminUser } from '../../../../api/adminApi';
import AdminMerchSection from './AdminMerchSection';
import './AdminSection.css';

export function AdminSection() {
  const [showUsers, setShowUsers] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showMerch, setShowMerch] = useState(false);

  async function handleManageUsers() {
    setShowUsers(true);
    setShowMerch(false);
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

  async function handleUsernameChange() {
    if (!selectedUser) return;

    setError('');

    try {
      const updatedUser = await updateAdminUsername(
        selectedUser.id,
        usernameInput,
      );

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === updatedUser.id
            ? { ...user, ...updatedUser }
            : user,
        ),
      );

      setSelectedUser((currentUser) =>
        currentUser
          ? { ...currentUser, ...updatedUser }
          : currentUser,
      );

      setUsernameInput(updatedUser.username);
    } catch {
      setError('Failed to update username.');
    }
  }

  async function handlePasswordChange() {
    if (!selectedUser) return;

    setError('');

    if (passwordInput.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    try {
      const updatedUser = await updateAdminPassword(
        selectedUser.id,
        passwordInput,
      );

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === updatedUser.id
            ? { ...user, ...updatedUser }
            : user,
        ),
      );

      setSelectedUser((currentUser) =>
        currentUser
          ? { ...currentUser, ...updatedUser }
          : currentUser,
      );

      setPasswordInput('');
    } catch {
      setError('Failed to change user password.');
    }
  }

  return (
    <section>

      <div className="admin-section-container">
        <p className="admin-info-title">Admin</p>

        <div className="admin-section-inner-cont">
          <button
            type="button"
            onClick={handleManageUsers}
            className="manage-users-button"
          >
            Manage Users
          </button>

          <button
            type="button"
            onClick={() => {
              setShowUsers(false);
              setSelectedUser(null);
              setError('');
              setShowMerch(true);
            }}
            className="manage-merch-button"
          >
            Manage Merch
          </button>

          {showUsers && (
            <div>
              <p className="area-title">Users</p>

              {loading && <p>Loading users...</p>}

              {error && <p>{error}</p>}

              {!loading && !error && (
                <>
                  <div className="user-table-container">
                    <table className="user-table">
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
                                onClick={() => { setSelectedUser(user); setUsernameInput(user.username); setPasswordInput(''); }}
                                className="ut-view-button"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {selectedUser && (
                    <div>
                      <p className="area-title">User Details</p>

                      <p className="user-details-text">
                        <strong>ID:</strong> {selectedUser.id}
                      </p>

                      <div>
                        <label className="user-details-label">
                          <strong>Username:</strong>{' '}
                          <input
                            type="text"
                            value={usernameInput}
                            onChange={(event) => setUsernameInput(event.target.value)}
                            className="ud-input"
                          />
                        </label>

                        <button
                          type="button"
                          onClick={handleUsernameChange}
                          disabled={usernameInput === selectedUser.username}
                          className="ud-button"
                        >
                          Save Username
                        </button>
                      </div>

                      <p className="user-details-text">
                        <strong>Email:</strong> {selectedUser.email}
                      </p>

                      <div className="user-details-div">
                        <strong>Role:</strong>{' '}
                        <div className="role-select-container">
                          <div className="role-dropdown">
                            <button
                              type="button"
                              className="role-dropdown-trigger"
                            >
                              {selectedUser.role === 'USER'
                                ? 'User'
                                : selectedUser.role === 'MODERATOR'
                                  ? 'Moderator'
                                  : 'Admin'}
                            </button>

                            <ul className="role-dropdown-menu">
                              <ul>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRoleChange('USER')
                                  }
                                  className={
                                    selectedUser.role === 'USER'
                                      ? 'active'
                                      : ''
                                  }
                                >
                                  User
                                </button>
                              </ul>

                              <ul>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRoleChange('MODERATOR')
                                  }
                                  className={
                                    selectedUser.role === 'MODERATOR'
                                      ? 'active'
                                      : ''
                                  }
                                >
                                  Moderator
                                </button>
                              </ul>

                              <ul>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRoleChange('ADMIN')
                                  }
                                  className={
                                    selectedUser.role === 'ADMIN'
                                      ? 'active'
                                      : ''
                                  }
                                >
                                  Admin
                                </button>
                              </ul>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <p className="user-details-text">
                        <strong>Status:</strong>{' '}
                        {selectedUser.isActive ? 'Active' : 'Inactive'}
                      </p>

                      <button type="button" onClick={handleStatusChange} className="deactivate-button">
                        {selectedUser.isActive ? 'Deactivate User' : 'Activate User'}
                      </button>

                      <p className="user-details-text">
                        <strong>Created:</strong>{' '}
                        {new Date(selectedUser.createdAt).toLocaleString()}
                      </p>

                      <p className="user-details-text">
                        <strong>Username last changed:</strong>{' '}
                        {selectedUser.usernameUpdatedAt
                          ? new Date(
                            selectedUser.usernameUpdatedAt,
                          ).toLocaleString()
                          : 'Never'}
                      </p>

                      <p className="user-details-text">
                        <strong>Email last changed:</strong>{' '}
                        {selectedUser.emailUpdatedAt
                          ? new Date(
                            selectedUser.emailUpdatedAt,
                          ).toLocaleString()
                          : 'Never'}
                      </p>

                      <div>
                        <p className="user-details-text"><strong>Password:</strong></p>

                        <p className="user-details-text">
                          <strong>Last changed:</strong>{' '}
                          {selectedUser.passwordUpdatedAt
                            ? new Date(
                              selectedUser.passwordUpdatedAt,
                            ).toLocaleString()
                            : 'Never'}
                        </p>

                        <input
                          type="password"
                          placeholder="New password"
                          value={passwordInput}
                          onChange={(event) =>
                            setPasswordInput(event.target.value)
                          }
                          className="pw-input"
                        />

                        <button
                          type="button"
                          onClick={handlePasswordChange}
                          disabled={!passwordInput}
                          className="ud-button"
                        >
                          Set New Password
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedUser(null)}
                        className="close-button"
                      >
                        Close
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {showMerch && <AdminMerchSection />}
        </div>
      </div>
    </section>
  );
}