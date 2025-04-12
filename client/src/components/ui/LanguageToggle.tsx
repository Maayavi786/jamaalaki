
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const isRtl = language === 'ar';
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(isRtl ? 'en' : 'ar')}
      className={`font-medium ${isRtl ? 'font-tajawal' : ''}`}
    >
      {isRtl ? 'English' : 'العربية'}
    </Button>
  );
}
