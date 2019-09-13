export class EmailConfig {
  requireAuth: boolean;
  useSsl: boolean;
  useTls: boolean;
  smtpHost: string;
  smtpPort: number;

  sendFromUser: string;
  emailAccount: string;
  accountPassword: string;
}
