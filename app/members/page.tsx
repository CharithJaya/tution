"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MemberCard } from "@/components/member-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, UserPlus } from "lucide-react";
import Link from "next/link";

interface MemberFromBackend {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  course: string;
  emergencyContact: string;
  address: string;
}

export default function MembersPage() {
  const router = useRouter();
  const user = getCurrentUser();
  const userIsAdmin = isAdmin();

  // Immediate redirect if not logged in or not admin
  if (!user) {
    router.push("/login");
    return null;
  }
  if (!userIsAdmin) {
    router.push("/dashboard");
    return null;
  }

  const [members, setMembers] = useState<MemberFromBackend[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8080/api/members");
      if (!response.ok) throw new Error("Failed to fetch members");
      const data: MemberFromBackend[] = await response.json();
      setMembers(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtering logic
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all"; // status not in backend
    const matchesCourse = courseFilter === "all" || member.course === courseFilter;
    return matchesSearch && matchesStatus && matchesCourse;
  });

  const uniqueCourses = Array.from(new Set(members.map((m) => m.course)));

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
                <p className="text-muted-foreground mt-1">Manage and view all registered members</p>
              </div>
              <Button asChild>
                <Link href="/add-member">
                  <UserPlus className="mr-2 h-4 w-4" /> Add Member
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
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="All Courses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {uniqueCourses.map((course) => (
                    <SelectItem key={course} value={course}>
                      {course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mb-4">
              <Button onClick={fetchMembers}>Load Members</Button>
            </div>

            {isLoading && <p className="text-center py-12">Loading members...</p>}
            {error && (
              <div className="text-center py-12 text-red-500">
                <p>Error: {error}</p>
                <Button onClick={fetchMembers} className="mt-4">
                  Try Again
                </Button>
              </div>
            )}

            {!isLoading && !error && filteredMembers.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMembers.map((member) => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    onViewDetails={() => router.push(`/members/${member.id}`)}
                    onGenerateQR={() =>
                      alert(`QR Code for ${member.fullName}: A QR code would be generated here.`)
                    }
                  />
                ))}
              </div>
            )}

            {!isLoading && !error && filteredMembers.length === 0 && (
              <p className="text-center py-12 text-muted-foreground">
                No members found matching your criteria.
              </p>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
