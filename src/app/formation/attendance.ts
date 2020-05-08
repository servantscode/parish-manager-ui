import { Session } from 'sc-common';

export class AttendanceReport {
  programId: number;
  classroomId: number;
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
  classroomId: number;
  sessionId: number;
  enrolleeAttendance: any;
}