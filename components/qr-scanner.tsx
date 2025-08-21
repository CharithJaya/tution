"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Camera, X, CheckCircle, AlertCircle } from 'lucide-react';
import { mockMembers, mockAttendance } from '@/lib/mock-data';
import { Member, AttendanceRecord } from '@/lib/types';

interface QRScannerProps {
  onScanResult?: (data: string) => void;
}

export function QRScanner({ onScanResult }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  // Mock QR scanner - in real app, you'd use react-qr-scanner or similar
  const startScanning = () => {
    setIsScanning(true);
    setMessage('');
    
    // Simulate QR code detection after 2 seconds
    setTimeout(() => {
      // Mock scan result - randomly select a member's QR code
      const randomMember = mockMembers[Math.floor(Math.random() * mockMembers.length)];
      handleScanResult(randomMember.qrCode);
    }, 2000);
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  const handleScanResult = (data: string) => {
    setScanResult(data);
    setIsScanning(false);
    
    // Find member by QR code
    const foundMember = mockMembers.find(m => m.qrCode === data);
    
    if (foundMember) {
      setMember(foundMember);
      processAttendance(foundMember);
      onScanResult?.(data);
    } else {
      setMessage('Invalid QR code. Member not found.');
      setMessageType('error');
    }
  };

  const processAttendance = (member: Member) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    // Check if member already checked in today
    const existingAttendance = mockAttendance.find(
      a => a.memberId === member.id && a.date === today
    );
    
    if (existingAttendance && !existingAttendance.checkOutTime) {
      // Check out
      existingAttendance.checkOutTime = now;
      const checkInTime = new Date(`${today} ${existingAttendance.checkInTime}`);
      const checkOutTime = new Date(`${today} ${now}`);
      existingAttendance.duration = Math.round((checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60));
      
      setMessage(`${member.name} checked out successfully at ${now}`);
      setMessageType('success');
    } else if (existingAttendance && existingAttendance.checkOutTime) {
      setMessage(`${member.name} has already completed attendance for today`);
      setMessageType('info');
    } else {
      // Check in
      const newAttendance: AttendanceRecord = {
        id: Date.now().toString(),
        memberId: member.id,
        memberName: member.name,
        checkInTime: now,
        date: today,
        status: 'present',
      };
      
      mockAttendance.push(newAttendance);
      setMessage(`${member.name} checked in successfully at ${now}`);
      setMessageType('success');
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setMember(null);
    setMessage('');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          QR Code Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isScanning && !scanResult && (
          <div className="text-center space-y-4">
            <div className="w-48 h-48 mx-auto border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center">
              <Camera className="h-16 w-16 text-muted-foreground" />
            </div>
            <Button onClick={startScanning} className="w-full">
              Start Scanning
            </Button>
          </div>
        )}

        {isScanning && (
          <div className="text-center space-y-4">
            <div className="w-48 h-48 mx-auto bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center animate-pulse">
              <div className="w-32 h-32 border-2 border-primary rounded-lg flex items-center justify-center">
                <Camera className="h-8 w-8 text-primary animate-pulse" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Position QR code within the frame
            </p>
            <Button onClick={stopScanning} variant="outline" className="w-full">
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
        )}

        {scanResult && member && (
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Member Found</span>
              </div>
              <div className="space-y-1 text-sm">
                <p><strong>Name:</strong> {member.name}</p>
                <p><strong>Course:</strong> {member.course}</p>
                <p><strong>Status:</strong> {member.status}</p>
              </div>
            </div>
            
            {message && (
              <div className={`p-3 rounded-lg flex items-center gap-2 ${
                messageType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
                messageType === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
                'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {messageType === 'success' && <CheckCircle className="h-4 w-4" />}
                {messageType === 'error' && <AlertCircle className="h-4 w-4" />}
                {messageType === 'info' && <AlertCircle className="h-4 w-4" />}
                <span className="text-sm">{message}</span>
              </div>
            )}
            
            <Button onClick={resetScanner} className="w-full">
              Scan Another
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}