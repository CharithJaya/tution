"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MemberCard } from "@/components/member-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, UserPlus } from "lucide-react";
import Link from "next/link";

interface Member {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  course: string;
  emergencyContact: string;
  address: string;
}

const dummyMembers: Member[] = [
  { id: 1, fullName: "John Doe", email: "john@example.com", phone: "1234567890", course: "Mathematics", emergencyContact: "9876543210", address: "123 Main St" },
  { id: 2, fullName: "Jane Smith", email: "jane@example.com", phone: "0987654321", course: "Physics", emergencyContact: "1234567890", address: "456 Elm St" },
  { id: 3, fullName: "Alice Brown", email: "alice@example.com", phone: "5555555555", course: "Chemistry", emergencyContact: "5555555555", address: "789 Oak St" },
];

export default function MembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>(dummyMembers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [courseFilter, setCourseFilter] = useState<string>("all");

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all"; // Assuming dummy data has no status
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

            {filteredMembers.length > 0 ? (
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
            ) : (
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
