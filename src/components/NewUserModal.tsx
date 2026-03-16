import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { WorkspaceUser } from '../types';

interface NewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Partial<WorkspaceUser>, password?: string) => void;
  editingUser?: WorkspaceUser | null;
  isAdmin?: boolean;
  tenants?: any[];
  activeTenantId?: string;
}

export function NewUserModal({ isOpen, onClose, onSave, editingUser, isAdmin, tenants, activeTenantId }: NewUserModalProps) {
  const [formData, setFormData] = useState<Partial<WorkspaceUser>>({
    name: '',
    email: '',
    role: 'staff',
    status: 'active',
    tenantId: activeTenantId || '1'
  });
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (editingUser) {
      setFormData(editingUser);
      setPassword('');
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'staff',
        status: 'active',
        tenantId: activeTenantId || '1'
      });
      setPassword('');
    }
  }, [editingUser, isOpen, activeTenantId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold">{editingUser ? 'Edit User' : 'New User'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              placeholder="Enter user name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              placeholder="Enter user email"
              disabled={!!editingUser}
            />
          </div>

          {!editingUser && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                placeholder="Enter password"
              />
            </div>
          )}
          
          {isAdmin && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tenant</label>
              <select
                value={formData.tenantId || '1'}
                onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              >
                {tenants?.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <select
              value={formData.role || 'staff'}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="staff">Staff</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              value={formData.status || 'active'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-xl transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData, password)}
            className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl transition-colors font-medium"
          >
            {editingUser ? 'Save Changes' : 'Create User'}
          </button>
        </div>
      </div>
    </div>
  );
}
