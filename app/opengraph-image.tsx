import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Ptes 반려동물 입양 신청 관리 서비스'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
          background:
            'linear-gradient(135deg, rgb(249, 115, 22) 0%, rgb(251, 146, 60) 50%, rgb(253, 186, 116) 100%)',
          color: 'white',
          fontFamily: 'Pretendard, Apple SD Gothic Neo, Segoe UI, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 40, fontWeight: 700 }}>
          Ptes
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.2 }}>입양 가능한 친구들을 만나보세요</div>
          <div style={{ fontSize: 34, opacity: 0.95 }}>반려동물 조회부터 입양 신청까지 한 번에 관리</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 26, opacity: 0.9 }}>
          <span>Ptes</span>
          <span>https://ptes.vercel.app</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
