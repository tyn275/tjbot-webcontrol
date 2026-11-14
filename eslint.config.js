import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}', '*.config.{js,ts}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Giới hạn kích thước và độ phức tạp của hàm và file
      'max-lines': ['error', { max: 150, skipBlankLines: true, skipComments: true }],
      'max-depth': ['error', 3],
      'max-params': ['error', 3],
      complexity: ['error', 8],

      // Đảm bảo an toàn kiểu dữ liệu TypeScript
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // Cấm sử dụng inline style trong JSX để đảm bảo cấu trúc SCSS BEM
      'no-restricted-syntax': [
        'error',
        {
          selector: "JSXAttribute[name.name='style']",
          message: 'CẤM inline style style={{...}}. Bắt buộc dùng class SCSS theo chuẩn BEM.',
        },
      ],
    },
  },
  {
    // Giới hạn số dòng hàm riêng biệt cho file logic và file component
    files: ['**/src/**/*.ts'],
    rules: {
      'max-lines-per-function': ['error', { max: 20, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    files: ['**/src/**/*.tsx'],
    rules: {
      'max-lines-per-function': ['error', { max: 40, skipBlankLines: true, skipComments: true }],
    },
  },
  {
    // Cô lập các module tính năng, không cho phép import chéo giữa các tính năng độc lập
    files: ['**/src/features/{arm,led,audio,mic,camera,wifi,askme,intro}/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '../arm/**',
                '../led/**',
                '../audio/**',
                '../mic/**',
                '../camera/**',
                '../wifi/**',
                '../askme/**',
                '../intro/**',
                '../../arm/**',
                '../../led/**',
                '../../audio/**',
                '../../mic/**',
                '../../camera/**',
                '../../wifi/**',
                '../../askme/**',
                '../../intro/**',
              ],
              message:
                'Các module tính năng không được import chéo lẫn nhau. Hãy chuyển code dùng chung vào core/ hoặc services/.',
            },
          ],
        },
      ],
    },
  },
  {
    // Miễn giảm giới hạn số dòng cho từ điển đa ngôn ngữ và các file cấu hình hệ thống
    files: ['**/src/**/*.i18n.ts', '*.config.{js,ts}'],
    rules: {
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      complexity: 'off',
    },
  }
)
