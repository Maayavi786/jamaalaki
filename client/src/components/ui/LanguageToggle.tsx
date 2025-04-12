
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageToggle() {
  const { t } = useTranslation("common");
  const { toggleLanguage, language } = useLanguage();

  return (
    <Button
      variant="ghost"
      onClick={toggleLanguage}
      className="text-primary px-4 py-2 hover:bg-primary hover:bg-opacity-10 transition-colors"
    >
      {language === 'en' ? 'العربية' : 'English'}
    </Button>
  );
}

export default LanguageToggle;
