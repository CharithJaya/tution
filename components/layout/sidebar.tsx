"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  Users,
  QrCode,
  UserPlus,
  BarChart3,
 // Calendar,
  CalendarDays, 
  Settings,
  BookOpen,
  Clock,
} from 'lucide-react';
import { isAdmin } from '@/lib/auth';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const userIsAdmin = isAdmin();

  const adminNavItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/members', icon: Users, label: 'Members' },
  { href: '/attendance', icon: Clock, label: 'Attendance' },
  { href: '/qr-scanner', icon: QrCode, label: 'QR Scanner' },
  { href: '/add-member', icon: UserPlus, label: 'Add Member' },
  { href: '/courses', icon: BookOpen, label: 'Courses' },
  { href: '/analytics', icon: BarChart3, label: 'Analytics' },
  //{ href: '/calendar', icon: Calendar, label: 'Calendar' },
  { href: '/event', icon: CalendarDays, label: 'Event' }, // ✅ updated icon
  { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  const studentNavItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/my-attendance', icon: Clock, label: 'My Attendance' },
    { href: '/my-courses', icon: BookOpen, label: 'My Courses' },
    { href: '/qr-code', icon: QrCode, label: 'My QR Code' },
    { href: '/profile', icon: Users, label: 'Profile' },
  ];

  const navItems = userIsAdmin ? adminNavItems : studentNavItems;

  return (
    <div className={cn("flex flex-col h-full bg-card border-r", className)}>
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-primary">TuitionApp</h2>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-accent",
                isActive
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t">
        <p className="text-xs text-muted-foreground">
          {userIsAdmin ? 'Admin Dashboard' : 'Student Portal'}
        </p>
      </div>
    </div>
  );
}