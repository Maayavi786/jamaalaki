import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Salon } from "@shared/schema";
import { Star, Check, MapPin } from "lucide-react";

interface SalonCardProps {
  salon: Salon;
}

const SalonCard = ({ salon }: SalonCardProps) => {
  const { t } = useTranslation("common");
  const { isLtr, isRtl } = useLanguage();

  return (
    <div className="luxury-card bg-background dark:bg-neutral-800/20 rounded-xl overflow-hidden shadow-lg border border-muted dark:border-neutral-800 hover:shadow-xl transition-all transform hover:-translate-y-1">
      <div className="relative">
        <img 
          src={salon.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(salon.nameEn)}&background=D4AF37&color=fff&size=256`} 
          alt={isLtr ? salon.nameEn : salon.nameAr} 
          className="w-full h-56 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(salon.nameEn)}&background=D4AF37&color=fff&size=256`;
          }}
        />
        <div className="absolute top-4 left-4 flex gap-2">
          {salon.rating && (
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full flex items-center">
              <Star className="h-3 w-3 mr-1" />
              {salon.rating}
            </span>
          )}
          {salon.isLadiesOnly && (
            <span className="bg-white/90 text-primary-foreground text-xs px-2 py-1 rounded-full flex items-center">
              <span className={isRtl ? 'font-tajawal' : ''}>{t("ladiesOnly")}</span>
            </span>
          )}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className={`font-bold text-xl ${isLtr ? 'font-playfair' : 'font-tajawal'}`}>
            {isLtr ? salon.nameEn : salon.nameAr}
          </h3>
          {salon.isVerified && (
            <span className="bg-secondary/20 text-foreground text-xs px-2 py-1 rounded-full flex items-center">
              <Check className="h-3 w-3 text-green-500 mr-1" />
              <span className={isRtl ? 'font-tajawal' : ''}>{t("verified")}</span>
            </span>
          )}
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <MapPin className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
          <span className={isRtl ? 'font-tajawal' : ''}>{salon.city}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {salon.isHijabFriendly && (
            <span className="bg-muted dark:bg-neutral-800/40 text-xs px-2 py-1 rounded-full">
              <span className={isRtl ? 'font-tajawal' : ''}>{t("hijabFriendly")}</span>
            </span>
          )}
          {salon.hasPrivateRooms && (
            <span className="bg-muted dark:bg-neutral-800/40 text-xs px-2 py-1 rounded-full">
              <span className={isRtl ? 'font-tajawal' : ''}>{t("privateRoom")}</span>
            </span>
          )}
        </div>
        
        <div className="border-t border-muted dark:border-neutral-800/40 pt-4 flex justify-between items-center">
          <div>
            <p className={`text-xs text-muted-foreground ${isRtl ? 'font-tajawal' : ''}`}>
              {t("startingFrom")}
            </p>
            <p className="text-primary font-medium">
              {salon.priceRange}
            </p>
          </div>
          
          <Link href={`/salon/${salon.id}`}>
            <Button 
              variant="outline" 
              className={`border-primary text-primary hover:bg-primary hover:text-white rounded-full px-4 py-1.5 text-sm transition-colors ${isRtl ? 'font-tajawal' : ''}`}
            >
              {t("bookNow")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SalonCard;
