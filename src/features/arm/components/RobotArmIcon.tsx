import type { FC } from 'react'

// Biểu tượng cánh tay robot cơ khí công nghiệp với khớp xoay tròn và ngàm gắp đôi
export const RobotArmIcon: FC = () => (
  <svg width="35" height="35" viewBox="8 6 88 84" fill="currentColor">
    {/* Đế chân cánh tay robot */}
    <rect x="40" y="78" width="26" height="12" rx="0.5" />

    {/* Cánh tay dưới (ống nối xiên 45 độ từ đế lên khớp tròn) */}
    <polygon points="17,47 24,40 55,78 42,78" />

    {/* Cánh tay trên (thân nối từ khớp tròn vươn tới cổ tay) */}
    <polygon points="22.4,35.3 64.4,21.3 67.6,30.7 25.6,44.7" />

    {/* Khớp tròn lớn (vành ngoài + rãnh hở tròn + tâm tròn đặc) */}
    <path
      fillRule="evenodd"
      d="M 24,24 A 16,16 0 1 1 23.99,24 Z M 24,29 A 11,11 0 1 0 24.01,29 Z"
    />
    <circle cx="24" cy="40" r="6.5" />

    {/* Khớp cổ tay (vòng đệm cổ tay nhô đều 2 bên) */}
    <polygon points="62.5,16 67,14.5 73,34.5 68.5,36" />

    {/* Ngàm kẹp hai ngón gắp vươn về bên phải (dày dặn ~8px đồng bộ với thân cánh tay) */}
    <polygon points="66.5,16 78,6.5 96,14 93,21.5 77.5,15 70,24" />
    <polygon points="74,33 84,45.5 96,35 93,27.5 82.5,37 71,26" />
  </svg>
)
