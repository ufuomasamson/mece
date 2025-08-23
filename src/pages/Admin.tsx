import { useState } from "react";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  MessageSquare, 
  Settings, 
  Image, 
  PenTool,
  LogOut,
  Menu,
  X,
  CreditCard,
  Share2,
  QrCode
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Admin Dashboard Components
import DashboardHome from "@/components/admin/DashboardHome";
import ContentManagement from "@/components/admin/ContentManagement";
import BlogManagement from "@/components/admin/BlogManagement";
import SubmissionsManagement from "@/components/admin/SubmissionsManagement";
import PaystackIntegration from "@/components/admin/PaystackIntegration";
import UsersManagement from "@/components/admin/UsersManagement";
import SocialMediaManagement from "@/components/admin/SocialMediaManagement";
import QRCodeManagement from "@/components/admin/QRCodeManagement";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "content", label: "Content Management", icon: PenTool },
    { id: "blog", label: "Blog Management", icon: FileText },
    { id: "submissions", label: "Submissions", icon: FileText },
    { id: "users", label: "Users", icon: Users },
    { id: "paystack", label: "Paystack Integration", icon: CreditCard },
    { id: "social-media", label: "Social Media", icon: Share2 },
    { id: "qr-codes", label: "QR Codes", icon: QrCode },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardHome />;
      case "content":
        return <ContentManagement />;
      case "blog":
        return <BlogManagement />;
      case "submissions":
        return <SubmissionsManagement />;
      case "users":
        return <UsersManagement />;
      case "paystack":
        return <PaystackIntegration />;
      case "social-media":
        return <SocialMediaManagement />;
      case "qr-codes":
        return <QRCodeManagement />;
      case "settings":
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Settings className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Settings</h2>
            </div>
            <div className="p-6 bg-gradient-to-br from-white/90 via-primary/10 to-secondary/10 backdrop-blur-md rounded-xl border-2 border-primary/30 shadow-xl">
              <p className="text-gray-800 font-medium">Settings page coming soon...</p>
            </div>
          </div>
        );
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/15 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-secondary/25 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-40 right-1/3 w-28 h-28 bg-primary/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>
      {/* Mobile Header */}
      <div className="lg:hidden bg-gradient-to-r from-white/90 via-primary/10 to-secondary/10 backdrop-blur-md border-b border-primary/30 p-4 flex items-center justify-between shadow-xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="hover:bg-gradient-to-r hover:from-primary/20 hover:to-secondary/20 text-primary hover:text-primary-foreground transition-all duration-300"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Admin Dashboard</h1>
      </div>

      <div className="flex relative z-10">
        {/* Sidebar */}
        <div className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-primary/20 via-secondary/15 to-accent/10 backdrop-blur-md border-r border-primary/30 shadow-2xl transition-transform duration-300 ease-in-out lg:transition-none`}>
          <div className="flex flex-col h-full">
            {/* Logo Section */}
            <div className="p-6 border-b border-primary/30 bg-gradient-to-r from-primary/30 via-secondary/25 to-accent/20 shadow-lg">
              <div className="flex items-center space-x-3">
                <img 
                  src="/images/mece-logo.png" 
                  alt="MECE Logo" 
                  className="h-10 w-auto"
                />
                <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Admin Panel</h2>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4 space-y-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-primary via-secondary to-accent text-white shadow-xl shadow-primary/40 border-2 border-white/20'
                        : 'text-gray-800 hover:bg-gradient-to-r hover:from-primary/20 hover:via-secondary/15 hover:to-accent/10 hover:text-primary border-2 border-transparent hover:border-primary/30 hover:shadow-lg'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Logout Section */}
            <div className="p-4 border-t border-primary/30 bg-gradient-to-r from-destructive/20 via-red-100 to-pink-100 shadow-lg">
              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-white hover:bg-gradient-to-r hover:from-destructive hover:to-red-500 border-destructive/40 hover:border-destructive/60 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <LogOut size={20} className="mr-3" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="p-6 bg-gradient-to-br from-white/80 via-primary/5 to-secondary/5 backdrop-blur-md rounded-2xl m-4 shadow-2xl border border-primary/20">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-gradient-to-br from-primary/30 via-secondary/25 to-accent/30 backdrop-blur-md z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Admin;
