import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { handleApiError } from '@/lib/api-handler';
import { HostelBookingDoc, ContactMessageDoc, ReportDoc, Inquiry, InquiryStatus } from '@/types/firestore';

function toInquiryStatus(status: string): InquiryStatus {
  return status.toUpperCase() as InquiryStatus;
}

export async function GET(_req: NextRequest) {
  try {
    const inquiries: Inquiry[] = [];

    // 1. Fetch Hostel Bookings
    const hostelBookingsSnap = await adminDb.collection('hostel_bookings').orderBy('createdAt', 'desc').get();
    if (!hostelBookingsSnap.empty) {
      const hostelBookings = hostelBookingsSnap.docs.map(doc => {
        const data = { id: doc.id, ...doc.data() } as HostelBookingDoc;
        return {
          id: data.id,
          type: 'Hostel Booking',
          title: data.propertyName,
          subtitle: data.contactPerson,
          date: data.createdAt,
          status: toInquiryStatus(data.status),
          data: data,
        } as Inquiry;
      });
      inquiries.push(...hostelBookings);
    }

    // 2. Fetch Contact Messages
    const contactMessagesSnap = await adminDb.collection('contact_messages').orderBy('createdAt', 'desc').get();
    if (!contactMessagesSnap.empty) {
      const contactMessages = contactMessagesSnap.docs.map(doc => {
        const data = { id: doc.id, ...doc.data() } as ContactMessageDoc;
        return {
          id: data.id,
          type: 'Contact Message',
          title: data.subject,
          subtitle: data.name,
          date: data.createdAt,
          status: data.status,
          data: data,
        } as Inquiry;
      });
      inquiries.push(...contactMessages);
    }

    // 3. Fetch Reports
    const reportsSnap = await adminDb.collection('reports').orderBy('createdAt', 'desc').get();
    if (!reportsSnap.empty) {
      const reports = reportsSnap.docs.map(doc => {
        const data = { id: doc.id, ...doc.data() } as ReportDoc;
        return {
          id: data.id,
          type: 'Issue Report',
          title: data.issueType,
          subtitle: data.fullName,
          date: data.createdAt,
          status: data.status,
          data: data,
        } as Inquiry;
      });
      inquiries.push(...reports);
    }

    // Sort all inquiries by date
    inquiries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json(inquiries, { status: 200 });
  } catch (error) {
    return handleApiError(error, 'GET /api/admin/inquiries');
  }
}
