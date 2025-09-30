"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const Card = dynamic(() => import("@/components/ui/card").then((mod) => mod.Card), { ssr: false });
const CardContent = dynamic(() => import("@/components/ui/card").then((mod) => mod.CardContent), { ssr: false });
const CardHeader = dynamic(() => import("@/components/ui/card").then((mod) => mod.CardHeader), { ssr: false });
const CardTitle = dynamic(() => import("@/components/ui/card").then((mod) => mod.CardTitle), { ssr: false });
const Progress = dynamic(() => import("@/components/ui/progress").then((mod) => mod.Progress), { ssr: false });

const Search = dynamic(() => import("lucide-react").then((m) => m.Search), { ssr: false });
const Plus = dynamic(() => import("lucide-react").then((m) => m.Plus), { ssr: false });
const Users = dynamic(() => import("lucide-react").then((m) => m.Users), { ssr: false });
const Clock = dynamic(() => import("lucide-react").then((m) => m.Clock), { ssr: false });
const DollarSign = dynamic(() => import("lucide-react").then((m) => m.DollarSign), { ssr: false });
const BookOpen = dynamic(() => import("lucide-react").then((m) => m.BookOpen), { ssr: false });
const Edit = dynamic(() => import("lucide-react").then((m) => m.Edit), { ssr: false });
const Trash2 = dynamic(() => import("lucide-react").then((m) => m.Trash2), { ssr: false });

interface CourseFromBackend {
  id: number;
  name: string;
  subject: string;
  instructorName: string;
  fee: number;
  duration: string;
  schedule: string;
  description: string;
  status?: string;
  students?: number;
  maxStudents?: number;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseFromBackend[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/api/courses`);
      if (!res.ok) throw new Error("Failed to fetch courses");

      const data = await res.json();

      // ✅ Normalize response to always be an array
      let coursesArray: CourseFromBackend[] = [];
      if (Array.isArray(data)) {
        coursesArray = data;
      } else if (Array.isArray(data.content)) {
        coursesArray = data.content;
      } else {
        console.error("Unexpected API response:", data);
        coursesArray = [];
      }

      setCourses(coursesArray);
    } catch (err: any) {
      console.error("Error fetching courses:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar className="w-64 hidden lg:block" />
        <div className="flex-1">
          <Header />

          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
                <p className="text-gray-600 mt-1">Manage your courses and curriculum</p>
              </div>
              <Button className="gap-2" onClick={() => router.push("/addCoursePage")}>
                <Plus className="h-4 w-4" />
                Add Course
              </Button>
            </div>

            {/* Search */}
            <Card>
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search courses or instructors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Loading / Error */}
            {isLoading && (
              <div className="text-center py-12">
                <p>Loading courses...</p>
              </div>
            )}
            {error && (
              <div className="text-center py-12 text-red-500">
                <p>Error: {error}</p>
                <Button onClick={fetchCourses} className="mt-4">
                  Try Again
                </Button>
              </div>
            )}

            {/* Stats */}
            {!isLoading && !error && (
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Courses</p>
                      <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Students</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {courses.reduce((sum, c) => sum + (c.students ?? 0), 0)}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <DollarSign className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">
                        Rs{" "}
                        {courses
                          .reduce((sum, c) => sum + ((c.fee ?? 0) * (c.students ?? 0)), 0)
                          .toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-orange-100 rounded-full">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Active Courses</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {courses.filter((c) => c.status === "active").length}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Courses Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {!isLoading &&
                !error &&
                Array.isArray(filteredCourses) &&
                filteredCourses.map((course) => {
                  const enrollmentPercentage =
                    course.maxStudents && course.maxStudents > 0
                      ? ((course.students ?? 0) / course.maxStudents) * 100
                      : 0;

                  return (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2">{course.name}</CardTitle>
                            <Badge
                              variant={course.status === "active" ? "default" : "secondary"}
                              className={
                                course.status === "active"
                                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                              }
                            >
                              {course.status
                                ? course.status.charAt(0).toUpperCase() + course.status.slice(1)
                                : "Unknown"}
                            </Badge>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600">{course.description}</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">Instructor:</span>
                            <span className="font-medium">{course.instructorName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">Duration:</span>
                            <span className="font-medium">{course.duration}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">Fee:</span>
                            <span className="font-medium">Rs {course.fee}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Enrollment</span>
                            <span className="font-medium">
                              {course.students ?? 0}/{course.maxStudents ?? 0}
                            </span>
                          </div>
                          <Progress
                            value={Math.min(Math.max(enrollmentPercentage, 0), 100)}
                            max={100}
                            className="h-2"
                          />
                        </div>
                        <div className="pt-2">
                          <p className="text-sm text-gray-600 mb-2">Schedule</p>
                          <p className="text-sm font-medium bg-gray-50 px-3 py-2 rounded">
                            {course.schedule}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>

            {!isLoading && !error && filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria or add a new course.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
