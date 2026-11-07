import { useTranslation } from 'react-i18next'

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const currentLang = i18n.language

  const handleToggle = () => {
    const nextLang = currentLang === 'vi' ? 'en' : 'vi'
    void i18n.changeLanguage(nextLang)
  }

  return (
    <button
      type="button"
      className="btn btn-outline-light btn-sm language-switcher"
      onClick={handleToggle}
      aria-label="Toggle language"
    >
      {currentLang === 'vi' ? 'EN' : 'VI'}
    </button>
  )
}
