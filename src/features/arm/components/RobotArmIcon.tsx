import type { FC } from 'react'

// Biểu tượng cánh tay robot cơ khí công nghiệp với khớp xoay và ngàm kẹp
export const RobotArmIcon: FC = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Bệ đỡ chân đế robot */}
    <path d="M2 21h12" />
    <rect x="4" y="17" width="8" height="4" rx="1" fill="currentColor" fillOpacity="0.2" />

    {/* Trục khớp xoay đế và cánh tay dưới */}
    <circle cx="8" cy="15" r="2" fill="currentColor" />
    <line x1="9.5" y1="13.5" x2="13.5" y2="8.5" strokeWidth="2.5" />

    {/* Khớp khuỷu tay và cánh tay vươn trên */}
    <circle cx="14.5" cy="7.5" r="2" fill="currentColor" />
    <line x1="16" y1="6.5" x2="19" y2="4.5" strokeWidth="2.5" />

    {/* Khớp cổ tay và ngàm gắp hai ngón */}
    <circle cx="19.5" cy="4" r="1.2" fill="currentColor" />
    <path d="M18 1.5c1.5 0 3 .5 4 2" />
    <path d="M20 6.5c1-.5 2-1.5 2-3" />
  </svg>
)
