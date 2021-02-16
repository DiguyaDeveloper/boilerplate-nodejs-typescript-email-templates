export interface AttachmentsInterface {
  attachments: AttachmentsItemInterface[];
}

export interface AttachmentsItemInterface {
  filename: string;
  type: string;
  content: any;
  cid: string;
  // disposition: string;
  // path: string;
}
