import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '杉恩科技 - 物联网智慧监测系统';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '72px',
          background: 'linear-gradient(145deg, #0a0e17 0%, #0d1a2a 50%, #0a1628 100%)',
          color: '#e2e8f0',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              border: '2px solid rgba(34, 211, 238, 0.6)',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(6, 182, 212, 0.15)',
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#22d3ee',
              }}
            />
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: 4 }}>
            杉恩科技
          </div>
        </div>

        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: 2,
            marginBottom: 24,
          }}
        >
          万物互联 · 智慧感知
        </div>

        <div
          style={{
            fontSize: 28,
            color: '#94a3b8',
            lineHeight: 1.5,
            maxWidth: 900,
          }}
        >
          物联网智慧监测系统 · 水库 · 森林 · 国土 · 环境
        </div>

        <div
          style={{
            marginTop: 48,
            display: 'flex',
            gap: 24,
            fontSize: 20,
            color: '#22d3ee',
            letterSpacing: 1,
          }}
        >
          <span>IoT Monitoring</span>
          <span style={{ color: '#334155' }}>|</span>
          <span>Shanen Tech</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
