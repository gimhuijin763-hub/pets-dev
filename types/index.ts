export type AdoptionStatus = '입양 가능' | '입양 완료' | '검토 중';

export type ApplicationStatus = '접수' | '검토 중' | '승인' | '거절';

export interface Animal {
  id: string;
  name: string;
  type: string;
  age: string;
  gender: '남' | '여';
  description: string;
  image_url: string;
  adoption_status: AdoptionStatus;
}

export interface Application {
  id: string;
  animal_id: string;
  applicant_name: string;
  phone: string;
  email: string;
  reason: string;
  status: ApplicationStatus;
  created_at: string;
}
