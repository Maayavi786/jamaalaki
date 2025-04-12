
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageToggle() {
  const { t } = useTranslation("common");
  const { toggleLanguage, language } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      className="text-primary p-2 rounded-full hover:bg-primary hover:bg-opacity-10 transition-colors"
    >
      {language === 'en' ? 'العربية' : 'English'}
    </Button>
  );
}

export default LanguageToggle;
