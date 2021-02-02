export interface attachmentsInterface {
    attachments: attachmentsItemInterface[];
}

export interface attachmentsItemInterface {
    filename: string;
    type: string;
    content: any;
    cid: string;
    // disposition: string;
    // path: string;
}
