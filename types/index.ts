export type UserRole = 'adopter' | 'promoter';

export type AdoptionStatus = '입양 가능' | '입양 완료' | '검토 중';

export interface Profile {
  id: string;
  role: UserRole;
  display_name: string;
  phone?: string;
  created_at?: string;
}

export type ApplicationStatus = '접수' | '검토 중' | '승인' | '거절';

export interface Animal {
  id: string;
  name: string;
  type: string;
  breed?: string;
  age: string;
  gender: '남' | '여' | '모름';
  size?: string;
  location?: string;
  description: string;
  image_url: string;
  adoption_status: AdoptionStatus;
  promoter_id?: string;  // 등록한 홍보자 ID
  created_at?: string;
}

export interface Application {
  id: string;
  animal_id: string;
  applicant_id?: string;  // 신청자 사용자 ID (로그인한 경우)
  applicant_name: string;
  phone: string;
  email: string;
  reason: string;
  status: ApplicationStatus;
  created_at: string;
}
