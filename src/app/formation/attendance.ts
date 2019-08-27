import { Session } from './formation';

export class AttendanceReport {
  programId: number;
  sectionId: number;
  sessions: Session[];
  attendance: AttendanceRecord[];
}

export class AttendanceRecord {
  enrolleeId: number;
  enrolleeName: string;
  sessionAttendance: any;
}

export class SessionAttendance {
  programId: number;
  sectionId: number;
  sessionId: number;
  enrolleeAttendance: any;
}