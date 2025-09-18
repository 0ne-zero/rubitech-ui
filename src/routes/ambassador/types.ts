
export type KYCStatus = 'draft' | 'submitted' | 'review' | 'approved' | 'rejected';
export type Teen = {
  id: string; name: string; dob: string; city: string; region: string; school: string;
  guardian: string; guardianPhone: string; talent: string; proofLink: string; proofFile?: File | null; consent: boolean;
  status: 'draft' | 'submitted' | 'review' | 'approved' | 'rejected'; note?: string
};

export type RequestRow = {
  id: string; status: 'submitted' | 'review' | 'approved' | 'rejected' | 'delivered'; quantity: number; teens: number; createdAt: string; shipmentId?: string;
};

export type ShipmentRow = {
  id: string; trackingNumber: string; carrier?: string; address?: string; history: { label: string; at: string }[];
};
