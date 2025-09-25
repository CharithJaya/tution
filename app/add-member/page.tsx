"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";

interface MemberPayload {
  fullName: string;
  email: string;
  phone: string;
  course: string;
  emergencyContact: string;
  address: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  course: string;
  address: string;
  emergencyContact: string;
}

interface Course {
  id: number;
  name: string;
  subject: string;
  instructorName: string;
  fee: number;
  schedule: string;
  duration: string;
  description: string;
  createdAt: string;
}

export default function AddMemberPage() {
  const router = useRouter();
  const user = getCurrentUser();
  const userIsAdmin = isAdmin();
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    course: "",
    address: "",
    emergencyContact: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  // Redirect check
  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (!userIsAdmin) {
      router.push("/dashboard");
    } else {
      setIsLoading(false);
    }
  }, [user, userIsAdmin, router]);

  // Fetch courses from Next.js API proxy
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses");
        if (!res.ok) throw new Error("Failed to fetch courses");
        const data = await res.json();
        setCourses(data.content || []);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Could not load courses",
          variant: "destructive",
        });
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchCourses();
  }, [toast]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: MemberPayload = {
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        course: formData.course,
        emergencyContact: formData.emergencyContact,
        address: formData.address,
      };

      const response = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to register member");
      }

      const newMember = await response.json();
      toast({
        title: "Member added successfully",
        description: `${newMember.fullName} has been registered.`,
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        course: "",
        address: "",
        emergencyContact: "",
      });

      router.push("/members");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add member. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar className="w-64 hidden lg:block" />
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Add New Member</h1>
              <p className="text-muted-foreground mt-1">
                Register a new student in the tuition system
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Member Registration
                  </CardTitle>
                  <CardDescription>
                    Fill in the member details to create a new account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          placeholder="Enter full name"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          placeholder="Enter email address"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          placeholder="Enter phone number"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="course">Course *</Label>
                        <Select
                          value={formData.course}
                          onValueChange={(value) =>
                            handleInputChange("course", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                coursesLoading
                                  ? "Loading courses..."
                                  : "Select a course"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {courses.map((course) => (
                              <SelectItem
                                key={course.id}
                                value={course.name}
                              >
                                {course.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact">
                          Emergency Contact
                        </Label>
                        <Input
                          id="emergencyContact"
                          value={formData.emergencyContact}
                          onChange={(e) =>
                            handleInputChange(
                              "emergencyContact",
                              e.target.value
                            )
                          }
                          placeholder="Enter emergency contact number"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        placeholder="Enter full address"
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1"
                      >
                        {isSubmitting ? "Adding Member..." : "Add Member"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/members")}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
