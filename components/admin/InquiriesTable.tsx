'use client';

import React, { useState } from 'react';
import { Inquiry, InquiryStatus } from '@/types/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Phone, MapPin, User, Tag, Clock, Building, AlertTriangle } from 'lucide-react';

interface InquiriesTableProps {
  inquiries: Inquiry[];
  onUpdate: () => void;
}

const typeInfo: Record<Inquiry['type'], { icon: React.ElementType; color: string }> = {
  'Hostel Booking': { icon: Building, color: 'text-blue-500' },
  'Contact Message': { icon: Mail, color: 'text-green-500' },
  'Issue Report': { icon: AlertTriangle, color: 'text-red-500' },
};

const statusColors: Record<InquiryStatus, string> = {
  PENDING: 'bg-yellow-500',
  CONTACTED: 'bg-blue-500',
  ONBOARDED: 'bg-green-500',
  REJECTED: 'bg-red-500',
  NEW: 'bg-purple-500',
  OPEN: 'bg-orange-500',
  CLOSED: 'bg-gray-500',
  RESOLVED: 'bg-green-500',
};

export function InquiriesTable({ inquiries, onUpdate }: InquiriesTableProps) {
  const [updating, setUpdating] = useState<string | null>(null);

  const handleStatusChange = async (inquiry: Inquiry, status: InquiryStatus) => {
    setUpdating(inquiry.id);
    try {
      const response = await fetch(`/api/admin/inquiries/${inquiry.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, type: inquiry.type }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      onUpdate();
    } catch (error) {
      console.error('Failed to update status', error);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inquiries.map((inquiry) => {
            const Icon = typeInfo[inquiry.type].icon;
            const color = typeInfo[inquiry.type].color;

            return (
              <TableRow key={inquiry.id}>
                <TableCell>
                  <Badge variant="outline" className={`flex items-center gap-1.5 ${color} border-current`}>
                    <Icon className="h-3.5 w-3.5" />
                    <span className="font-semibold">{inquiry.type}</span>
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div>
                      <div className="font-bold">{inquiry.title}</div>
                      <div className="text-xs text-gray-500">{inquiry.subtitle}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    {format(new Date(inquiry.date), 'PPpp')}
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    value={inquiry.status}
                    onValueChange={(value) => handleStatusChange(inquiry, value as InquiryStatus)}
                    disabled={updating === inquiry.id}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${statusColors[inquiry.status]}`} />
                          {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(statusColors).map((status) => (
                        <SelectItem key={status} value={status}>
                          <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${statusColors[status as InquiryStatus]}`} />
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
