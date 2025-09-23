import { ImageResponse } from 'next/og'
 
export const size = {
  width: 192,
  height: 192,
}
export const contentType = 'image/png'
 
export default function Icon192() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 76,
          background: '#000000',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '24px',
          fontWeight: 'bold',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '-3px',
        }}
      >
        SS
      </div>
    ),
    {
      ...size,
    }
  )
}
