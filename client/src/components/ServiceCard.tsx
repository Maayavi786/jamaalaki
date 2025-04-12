import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Service } from "@shared/schema";
import { Clock, BadgeDollarSign } from "lucide-react";
import { Link } from "wouter";
import { formatPrice } from "@/lib/utils";

interface ServiceCardProps {
  service: Service;
  salonId: number;
}

const ServiceCard = ({ service, salonId }: ServiceCardProps) => {
  const { t } = useTranslation();
  const { isLtr, isRtl } = useLanguage();

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className={`font-bold text-lg mb-2 ${isLtr ? '' : 'font-tajawal'}`}>
              {isLtr ? service.nameEn : service.nameAr}
            </h3>
            <p className={`text-sm text-muted-foreground ${isLtr ? '' : 'font-tajawal'}`}>
              {isLtr ? service.descriptionEn : service.descriptionAr}
            </p>
          </div>
          
          <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
            {service.category}
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" />
            <span className={`${isRtl ? 'font-tajawal' : ''}`}>
              {service.duration} {t("salon.minutes")}
            </span>
          </div>
          
          <div className="flex items-center text-sm font-medium">
            <BadgeDollarSign className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0 text-primary" />
            <span className="text-primary">
              {formatPrice(service.price)}
            </span>
          </div>
        </div>
        
        <Link href={`/booking/${salonId}/${service.id}`}>
          <Button 
            className={`w-full ${isRtl ? 'font-tajawal' : ''}`}
            variant="outline"
          >
            {t("common.bookNow")}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
