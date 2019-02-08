export class AvailabilityResponse {
  availability: AvailabilityWindow[];
  resourceType: string;
  resourceId: number;
  available: boolean;
}

export class AvailabilityWindow {
  startTime: Date;
  endTime: Date;
}
