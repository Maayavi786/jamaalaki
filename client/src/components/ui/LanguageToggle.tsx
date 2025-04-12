
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();
  const isRtl = language === 'ar';
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className={`font-medium ${isRtl ? 'font-tajawal' : ''}`}
    >
      {isRtl ? 'English' : 'العربية'}
    </Button>
  );
};

export default LanguageToggle;
