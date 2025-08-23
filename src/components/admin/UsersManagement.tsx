import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import API_ENDPOINTS from '@/config/api';
import { toast } from "sonner";
import { 
  Users, 
  User, 
  Mail, 
  Calendar, 
  Shield,
  FileText,
  TrendingUp,
  UserPlus,
  UserCheck,
  Trash2
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
  submission_count: number;
}

const UsersManagement = () => {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalRegularUsers: 0,
    totalSubmissions: 0,
    newUsersThisMonth: 0
  });

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;
      
      try {
        const response = await fetch(API_ENDPOINTS.ADMIN.USERS, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
          
          // Calculate stats
          const totalUsers = data.length;
          const totalAdmins = data.filter((user: User) => user.role === 'admin').length;
          const totalRegularUsers = totalUsers - totalAdmins;
          const totalSubmissions = data.reduce((sum: number, user: User) => sum + user.submission_count, 0);
          
          // Calculate new users this month
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          const newUsersThisMonth = data.filter((user: User) => {
            const userDate = new Date(user.created_at);
            return userDate.getMonth() === currentMonth && userDate.getFullYear() === currentYear;
          }).length;
          
          setStats({
            totalUsers,
            totalAdmins,
            totalRegularUsers,
            totalSubmissions,
            newUsersThisMonth
          });
        } else {
          const errorData = await response.json();
          console.error('Users fetch error:', errorData);
          toast.error('Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to fetch users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  // Delete user function
  const deleteUser = async (userId: string, userName: string) => {
    if (!token) {
      toast.error('Authentication required');
      return;
    }

    // Prevent admin from deleting themselves
    if (currentUser && currentUser.id === userId) {
      toast.error('You cannot delete your own account');
      return;
    }

    // Confirm deletion
    const confirmed = confirm(
      `Are you sure you want to delete user "${userName}"?\n\nThis will permanently delete:\n- The user account\n- All their submissions\n- All their payment records\n\nThis action cannot be undone.`
    );
    
    if (!confirmed) return;

    setDeletingUserId(userId);
    
    try {
      const response = await fetch(API_ENDPOINTS.ADMIN.DELETE_USER(userId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        toast.success(result.message || 'User deleted successfully');
        
        // Remove user from local state
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        
        // Recalculate stats
        const updatedUsers = users.filter(user => user.id !== userId);
        const totalUsers = updatedUsers.length;
        const totalAdmins = updatedUsers.filter(user => user.role === 'admin').length;
        const totalRegularUsers = totalUsers - totalAdmins;
        const totalSubmissions = updatedUsers.reduce((sum, user) => sum + user.submission_count, 0);
        
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const newUsersThisMonth = updatedUsers.filter(user => {
          const userDate = new Date(user.created_at);
          return userDate.getMonth() === currentMonth && userDate.getFullYear() === currentYear;
        }).length;
        
        setStats({
          totalUsers,
          totalAdmins,
          totalRegularUsers,
          totalSubmissions,
          newUsersThisMonth
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Network error occurred while deleting user');
    } finally {
      setDeletingUserId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadge = (role: string) => {
    if (role === 'admin') {
      return <Badge className="bg-purple-100 text-purple-800">Admin</Badge>;
    }
    return <Badge variant="outline" className="bg-gray-100 text-gray-800">User</Badge>;
  };

  const getSubmissionBadge = (count: number) => {
    if (count === 0) {
      return <Badge variant="secondary" className="bg-gray-100 text-gray-600">No Submissions</Badge>;
    } else if (count === 1) {
      return <Badge className="bg-green-100 text-green-800">{count} Submission</Badge>;
    } else {
      return <Badge className="bg-blue-100 text-blue-800">{count} Submissions</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
        <p className="text-gray-600 mt-2">Monitor all registered users and their activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center space-x-2">
              <Users size={16} />
              <span>Total Users</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.totalUsers}</div>
            <p className="text-xs text-blue-600">All registered users</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center space-x-2">
              <Shield size={16} />
              <span>Admins</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{stats.totalAdmins}</div>
            <p className="text-xs text-purple-600">Administrative users</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center space-x-2">
              <UserCheck size={16} />
              <span>Regular Users</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{stats.totalRegularUsers}</div>
            <p className="text-xs text-green-600">Standard users</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 flex items-center space-x-2">
              <FileText size={16} />
              <span>Total Submissions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{stats.totalSubmissions}</div>
            <p className="text-xs text-orange-600">All form submissions</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-pink-700 flex items-center space-x-2">
              <UserPlus size={16} />
              <span>New This Month</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-900">{stats.newUsersThisMonth}</div>
            <p className="text-xs text-pink-600">Recent registrations</p>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users size={20} />
            <span>All Users ({users.length})</span>
          </CardTitle>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            size="sm"
            className="mt-2"
          >
            Refresh Data
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No users found.</p>
              </div>
            ) : (
              users.map((user) => (
                <div key={user.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                        {getRoleBadge(user.role)}
                        {getSubmissionBadge(user.submission_count)}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Mail size={16} />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar size={16} />
                            <span>Joined: {formatDate(user.created_at)}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <FileText size={16} />
                            <span>Submissions: {user.submission_count}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <User size={16} />
                            <span>ID: {user.id}</span>
                          </div>
                        </div>
                      </div>

                      {/* Additional user info */}
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            <strong>Account Status:</strong> {user.role === 'admin' ? 'Administrator' : 'Active User'}
                          </span>
                          <span className="text-gray-600">
                            <strong>Member Since:</strong> {formatDate(user.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <div className="ml-4">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteUser(user.id, user.name)}
                        disabled={deletingUserId === user.id || (currentUser && currentUser.id === user.id)}
                        className="hover:bg-red-600 transition-colors"
                      >
                        {deletingUserId === user.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 size={16} className="mr-2" />
                            Delete User
                          </>
                        )}
                      </Button>
                      {currentUser && currentUser.id === user.id && (
                        <p className="text-xs text-gray-500 mt-1">Cannot delete own account</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersManagement;
