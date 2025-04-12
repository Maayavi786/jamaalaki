import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageToggle() {
  const { t } = useTranslation("common");
  const { toggleLanguage, language } = useLanguage();

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={toggleLanguage}
      className="text-sm px-3 py-1 rounded-full bg-primary bg-opacity-10 text-primary hover:bg-opacity-20 hover:text-primary-foreground transition-colors hover:text-opacity-100"
    >
      {language === 'en' ? 'العربية' : 'English'}
    </Button>
  );
}

export default LanguageToggle;
