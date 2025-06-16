export class Email {
  to: string;
  from: string;
  subject: string;
  template: string;
  data?: Record<string, any>;
  attachments?: Attachment[];
}

interface Attachment {
  filename: string;
  path?: string;
  content?:  string;
  contentType?: string;
  cid?: string;
}
