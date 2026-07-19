import { ImageResponse } from 'next/og';

// Apple touch icon (генерируется на build через next/og).
export const runtime = 'nodejs';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: 'linear-gradient(135deg, #14525c 0%, #2a8794 100%)',
          color: '#ffffff',
          fontSize: 96,
          fontWeight: 800,
          letterSpacing: -2,
          fontFamily: 'sans-serif',
        }}
      >
        DP
      </div>
    ),
    { ...size },
  );
}
