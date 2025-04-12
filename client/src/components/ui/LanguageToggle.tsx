
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageToggle() {
  const { t } = useTranslation("common");
  const { toggleLanguage, language, isRtl } = useLanguage();

  return (
    <Button 
      className={`bg-primary hover:bg-primary/90 text-white font-medium py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 ${isRtl ? 'font-tajawal' : ''}`}
      onClick={toggleLanguage}
    >
      {language === 'en' ? 'العربية' : 'English'}
    </Button>
  );
}

export default LanguageToggle;
