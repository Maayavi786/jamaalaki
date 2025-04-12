import { useTranslation } from "react-i18next";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Service } from "@shared/schema";
import ServiceCard from "@/components/ServiceCard";

const ServicesPage = () => {
  const { t } = useTranslation(["common", "services"]);
  const { isRtl } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Fetch all services
  const { data: services, isLoading } = useQuery({
    queryKey: ['/api/services'],
    queryFn: async () => {
      const response = await fetch('/api/services');
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      return response.json() as Promise<Service[]>;
    }
  });

  const categories = [
    { id: "all", label: t("all", { ns: "services" }) },
    { id: "haircut", label: t("haircuts", { ns: "services" }) },
    { id: "coloring", label: t("coloring", { ns: "services" }) },
    { id: "styling", label: t("styling", { ns: "services" }) },
    { id: "facial", label: t("facial", { ns: "services" }) },
    { id: "makeup", label: t("makeup", { ns: "services" }) },
    { id: "nails", label: t("nails", { ns: "services" }) },
    { id: "massage", label: t("massage", { ns: "services" }) },
  ];

  // Filter services based on selected category
  const filteredServices = services?.filter(service => 
    selectedCategory === "all" || service.category === selectedCategory
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className={`text-3xl font-bold text-center mb-8 ${isRtl ? 'font-tajawal' : 'font-playfair'}`}>
        {t("ourServices", { ns: "services" })}
      </h1>
      
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all
              ${selectedCategory === category.id 
                ? 'bg-primary text-white' 
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'}
              ${isRtl ? 'font-tajawal' : ''}
            `}
          >
            {category.label}
          </button>
        ))}
      </div>
      
      {/* Services List */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredServices && filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} salonId={service.salonId} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className={`text-neutral-500 ${isRtl ? 'font-tajawal' : ''}`}>
            {t("noServicesFound", { ns: "services" })}
          </p>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;