import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0e17',
          borderRadius: 4,
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            border: '2px solid rgba(34, 211, 238, 0.7)',
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(6, 182, 212, 0.2)',
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#22d3ee',
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
