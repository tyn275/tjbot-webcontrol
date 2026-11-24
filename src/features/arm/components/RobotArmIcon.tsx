import type { FC } from 'react'

// Biểu tượng cánh tay robot cơ khí công nghiệp với khớp xoay tròn và ngàm gắp đôi
export const RobotArmIcon: FC = () => (
  <svg width="34" height="34" viewBox="36 40 330 262" fill="currentColor">
    {/* Đế chân cánh tay robot */}
    <rect x="158" y="258" width="96" height="36" rx="1" />

    {/* Cánh tay dưới (ống nối xiên 45 độ từ đế lên khớp tròn) */}
    <polygon points="107,197 146,158 226,258 168,258" />

    {/* Cánh tay trên (thân nối từ khớp tròn tới cổ tay) */}
    <polygon points="115,119 248,77 261,116 128,158" />

    {/* Khớp cổ tay (vòng đệm cổ tay nhô đều 2 bên) */}
    <polygon points="246,70 264,65 274,127 256,132" />

    {/* Khớp tròn lớn (vành ngoài + rãnh hở tròn trong suốt + tâm tròn đặc) */}
    <path
      fillRule="evenodd"
      d="M 93,101 A 47,47 0 1 1 92.99,101 Z M 93,112 A 36,36 0 1 0 93.01,112 Z"
    />
    <circle cx="93" cy="148" r="19.5" />

    {/* Ngàm kẹp hai ngón gắp vươn về bên phải */}
    <polygon points="264,66 286,48 352,69 349,77 301,62 272,85 272,98 307,138 356,97 352,106 308,148 274,126" />
  </svg>
)
