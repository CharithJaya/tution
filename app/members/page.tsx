"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { MemberCard } from '@/components/member-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockMembers } from '@/lib/mock-data';
import { Member } from '@/lib/types';
import { Search, Filter, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function MembersPage() {
  const router = useRouter();
  const user = getCurrentUser();
  const userIsAdmin = isAdmin();
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (!userIsAdmin) {
      router.push('/dashboard');
    }
  }, [user, userIsAdmin, router]);

  useEffect(() => {
    let filtered = mockMembers;

    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.course.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(member => member.status === statusFilter);
    }

    if (courseFilter !== 'all') {
      filtered = filtered.filter(member => member.course === courseFilter);
    }

    setMembers(filtered);
  }, [searchTerm, statusFilter, courseFilter]);

  if (!user || !userIsAdmin) return null;

  const uniqueCourses = Array.from(new Set(mockMembers.map(m => m.course)));

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar className="w-64 hidden lg:block" />
        
        <div className="flex-1">
          <Header />
          
          <main className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">Members</h1>
                <p className="text-muted-foreground mt-1">
                  Manage and view all registered members
                </p>
              </div>
              <Button asChild>
                <Link href="/add-member">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Member
                </Link>
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members by name, email, or course..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {uniqueCourses.map(course => (
                    <SelectItem key={course} value={course}>{course}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  onViewDetails={() => {
                    // Navigate to member detail page
                    router.push(`/members/${member.id}`);
                  }}
                  onGenerateQR={() => {
                    // Show QR code modal or navigate to QR page
                    alert(`QR Code for ${member.name}: ${member.qrCode}`);
                  }}
                />
              ))}
            </div>

            {members.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No members found matching your criteria.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}