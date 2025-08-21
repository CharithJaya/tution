import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Member } from '@/lib/types';
import { Mail, Phone, Calendar, MapPin, User, QrCode } from 'lucide-react';

interface MemberCardProps {
  member: Member;
  onViewDetails?: () => void;
  onGenerateQR?: () => void;
}

export function MemberCard({ member, onViewDetails, onGenerateQR }: MemberCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={member.profilePicture} alt={member.name} />
            <AvatarFallback>
              {member.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-lg">{member.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                {member.status}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{member.email}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{member.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Joined: {new Date(member.joinDate).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <p className="font-medium text-sm">{member.course}</p>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onViewDetails} className="flex-1">
            <User className="h-4 w-4 mr-2" />
            Details
          </Button>
          <Button variant="outline" size="sm" onClick={onGenerateQR}>
            <QrCode className="h-4 w-4 mr-2" />
            QR
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}