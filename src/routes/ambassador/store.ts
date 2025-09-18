
import React from 'react';
import type { Teen, RequestRow, ShipmentRow, KYCStatus } from './types';

export type Profile = {
  name: string; nationalId: string; dob: string; city: string; region: string; org: string;
  email: { value: string; verified: boolean };
  phone: { value: string; verified: boolean };
  notify: { email: boolean; sms: boolean };
  kyc: { status: KYCStatus; front: File | null; back: File | null; selfie: File | null; note: string };
};

export function useAmbassadorData() {
  const [profile, setProfile] = React.useState<Profile>({
    name: 'زهرا محمدی', nationalId: '0012345678', dob: '1383-03-21', city: 'تهران', region: 'استان تهران', org: 'Rubitech',
    email: { value: 'zahra@example.com', verified: true }, phone: { value: '+989121234567', verified: true },
    notify: { email: true, sms: true },
    kyc: { status: 'approved', front: null, back: null, selfie: null, note: '' }
  });

  const [teenagers, setTeenagers] = React.useState<Teen[]>([
    { id: 'T-2001', name: 'سارا احمدی', dob: '1388-07-12', city: 'اصفهان', region: 'اصفهان', school: 'فرزانگان ۲', guardian: 'مینا احمدی', guardianPhone: '09131234567', talent: 'رباتیک', proofLink: '', consent: true, status: 'approved' },
    { id: 'T-2002', name: 'علی رستمی', dob: '1387-11-29', city: 'تهران', region: 'تهران', school: 'سمپاد علامه حلی', guardian: 'حسین رستمی', guardianPhone: '09121234567', talent: 'برنامه‌نویسی', proofLink: 'https://code.ir/ali', consent: true, status: 'approved' },
    { id: 'T-2003', name: 'نرگس کاوه', dob: '1389-02-15', city: 'شیراز', region: 'فارس', school: 'فرزانگان ۱', guardian: 'لیلا کاوه', guardianPhone: '09171234567', talent: 'هوش مصنوعی', proofLink: '', consent: true, status: 'review' },
    { id: 'T-2004', name: 'رضا نوروزی', dob: '1388-10-03', city: 'تبریز', region: 'آذربایجان شرقی', school: 'شهید باکری', guardian: 'محمد نوروزی', guardianPhone: '09141234567', talent: 'الکترونیک', proofLink: '', consent: true, status: 'submitted' },
    { id: 'T-2005', name: 'مهدی سعیدی', dob: '1387-06-20', city: 'کرج', region: 'البرز', school: 'شهید بهشتی', guardian: 'الهام سعیدی', guardianPhone: '09351234567', talent: 'برنامه‌نویسی', proofLink: '', consent: true, status: 'review' },
  ]);

  const [packages, setPackages] = React.useState<RequestRow[]>([
    { id: "د-۱", status: "approved", quantity: 2, teens: 2, createdAt: "1404/06/21", shipmentId: "س-۱" },
  ]);


  return { profile, setProfile, teenagers, setTeenagers, packages: packages, setPackages };
}
