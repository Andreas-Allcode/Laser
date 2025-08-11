
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  Target,
  LayoutDashboard,
  Database,
  Users,
  Settings,
  Bell,
  Zap,
  ChevronDown,
  LogOut,
  UserCircle,
  ArrowLeftRight,
  Landmark,
  BookCopy,
  FileText,
  ShieldCheck,
  Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const navigationItems = [
  { title: "Dashboard", url: createPageUrl("Dashboard"), icon: LayoutDashboard },
  { title: "Command Center", url: createPageUrl("CommandCenter"), icon: Target },
  { title: "Portfolio Management", url: createPageUrl("PortfolioManagement"), icon: Database },
  { title: "Account Management", url: createPageUrl("AccountManagement"), icon: Users },
  { title: "Buy Back Center", url: createPageUrl("BuyBackCenter"), icon: ArrowLeftRight },
  { title: "Remit Center", url: createPageUrl("RemitCenter"), icon: Landmark },
  { title: "Notification Center", url: createPageUrl("NotificationCenter"), icon: Bell },
  { title: "Letter Management", url: createPageUrl("LetterManagement"), icon: FileText },
  { title: "Change Log", url: createPageUrl("ChangeLog"), icon: BookCopy },
  { title: "Data Integrity", url: createPageUrl("DataIntegrity"), icon: ShieldCheck },
  { title: "Style Guide", url: createPageUrl("StyleGuide"), icon: Palette },
  { title: "Admin Center", url: createPageUrl("AdminCenter"), icon: Settings },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="bg-card border-r">
          <SidebarHeader className="p-4 border-b">
            <Link to={createPageUrl('Dashboard')} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-semibold tracking-normal text-primary">LASER</h1>
            </Link>
          </SidebarHeader>

          <SidebarContent className="p-2">
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.url || (item.url !== createPageUrl("Dashboard") && location.pathname.startsWith(item.url));
                return (
                  <SidebarMenuItem key={item.title}>
                    <Link to={item.url}>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className={`w-full justify-start gap-2 text-base font-normal h-10 ${isActive ? 'text-primary-foreground' : 'text-foreground'}`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </Button>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t">
            <div className="p-3 rounded-lg bg-background border">
                <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-foreground">System Status</span>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-green-600 font-semibold">Online</span>
                    </div>
                </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="flex items-center justify-between border-b p-4 bg-card">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="p-2 rounded-lg md:hidden" />
              <h1 className="text-2xl font-semibold text-foreground">{currentPageName || 'Dashboard'}</h1>
            </div>
            <div className="flex items-center gap-4">
               <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-primary text-primary-foreground">3</Badge>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 p-2">
                     <UserCircle className="w-8 h-8 text-primary"/>
                     <div className="hidden md:block text-left">
                       <p className="font-medium text-sm text-foreground">{user?.email}</p>
                       <p className="text-xs text-muted-foreground">User</p>
                     </div>
                     <ChevronDown className="w-4 h-4 hidden md:block text-muted-foreground"/>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator/>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator/>
                  <DropdownMenuItem 
                    className="text-red-600 focus:text-red-700 focus:bg-red-50"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-4 h-4 mr-2"/>
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <div className="flex-1 overflow-auto p-6 bg-background">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
