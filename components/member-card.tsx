import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Phone, User, QrCode } from 'lucide-react';

// Backend entity interface
export interface MemberFromBackend {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  course: string;
  emergencyContact: string;
  address: string;
  // Add later: joinDate, status, profilePicture
}

interface MemberCardProps {
  member: MemberFromBackend;
  onViewDetails?: () => void;
  onGenerateQR?: () => void;
}

export function MemberCard({ member, onViewDetails, onGenerateQR }: MemberCardProps) {
  const status = 'active'; 
  const joinDate = 'N/A'; 

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback>
              {member.fullName 
                ? member.fullName.split(' ').map(n => n[0]).join('') 
                : 'NA'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-lg">{member.fullName || 'Unnamed Member'}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={status === 'active' ? 'default' : 'secondary'}>
                {status}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{member.email || 'No email provided'}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{member.phone || 'No phone provided'}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>Joined: {joinDate}</span> 
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <p className="font-medium text-sm">{member.course || 'No course info'}</p>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onViewDetails || (() => {})} className="flex-1">
            <User className="h-4 w-4 mr-2" />
            Details
          </Button>
          <Button variant="outline" size="sm" onClick={onGenerateQR || (() => {})}>
            <QrCode className="h-4 w-4 mr-2" />
            QR
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
