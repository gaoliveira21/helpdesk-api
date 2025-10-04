export interface SendEmailInput {
  to: string | string[];
  subject: string;
  body: string;
}

export interface EmailSender {
  sendEmail(input: SendEmailInput): Promise<void>;
}
