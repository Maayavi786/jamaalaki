import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRoute } from "wouter";
import { Salon, Service, Review } from "@shared/schema";
import ServiceCard from "@/components/ServiceCard";
import { useToast } from "@/hooks/use-toast";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  Star, 
  MapPin, 
  Check, 
  Phone, 
  Mail, 
  Calendar, 
  Users 
} from "lucide-react";
import { getIslamicPatternSvg, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const SalonDetails = () => {
  const { t } = useTranslation(["salon", "common"]);
  const { isLtr, isRtl } = useLanguage();
  const [_, params] = useRoute<{ id: string }>("/salon/:id");
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("services");
  
  // Fetch salon data
  const { data: salon, isLoading: isSalonLoading, error: salonError } = useQuery<Salon>({
    queryKey: [`/api/salons/${params?.id}`],
    enabled: !!params?.id
  });
  
  // Fetch salon services
  const { data: services, isLoading: isServicesLoading } = useQuery<Service[]>({
    queryKey: [`/api/services/salon/${params?.id}`],
    enabled: !!params?.id
  });
  
  // Fetch salon reviews
  const { data: reviews, isLoading: isReviewsLoading } = useQuery<Review[]>({
    queryKey: [`/api/reviews/salon/${params?.id}`],
    enabled: !!params?.id
  });
  
  useEffect(() => {
    if (salonError) {
      toast({
        title: "Error",
        description: "Failed to load salon details. Please try again later.",
        variant: "destructive"
      });
    }
  }, [salonError, toast]);
  
  // Create pattern SVG background
  useEffect(() => {
    const patternSvg = getIslamicPatternSvg();
    const patternBg = document.createElement('div');
    patternBg.className = 'pattern-bg';
    patternBg.style.backgroundImage = `url('data:image/svg+xml;charset=utf-8,${encodeURIComponent(patternSvg)}')`;
    
    document.body.appendChild(patternBg);
    
    return () => {
      document.body.removeChild(patternBg);
    };
  }, []);
  
  if (isSalonLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!salon) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className={`text-2xl font-bold mb-4 ${isLtr ? 'font-playfair' : 'font-tajawal'}`}>
          {isLtr ? "Salon not found" : "لم يتم العثور على الصالون"}
        </h2>
        <p className={`text-muted-foreground ${isRtl ? 'font-tajawal' : ''}`}>
          {isLtr 
            ? "The salon you are looking for does not exist or has been removed." 
            : "الصالون الذي تبحثين عنه غير موجود أو تمت إزالته."
          }
        </p>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>
          {isLtr ? salon.nameEn : salon.nameAr} | {isLtr ? "Glam Haven" : "جلام هيفن"}
        </title>
        <meta name="description" content={isLtr 
          ? salon.descriptionEn || `Book luxury beauty services at ${salon.nameEn}`
          : salon.descriptionAr || `احجزي خدمات التجميل الفاخرة في ${salon.nameAr}`
        } />
      </Helmet>
      
      {/* Salon Header */}
      <div className="relative h-80">
        <img 
          src={salon.imageUrl} 
          alt={isLtr ? salon.nameEn : salon.nameAr} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <div className="flex flex-wrap items-center gap-4 mb-2">
              {salon.isLadiesOnly && (
                <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                  {t("ladiesOnly", { ns: "common" })}
                </span>
              )}
              {salon.hasPrivateRooms && (
                <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                  {t("privateRoom", { ns: "common" })}
                </span>
              )}
              {salon.isHijabFriendly && (
                <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                  {t("hijabFriendly", { ns: "common" })}
                </span>
              )}
              {salon.isVerified && (
                <span className="bg-primary/80 text-white text-xs px-3 py-1 rounded-full flex items-center">
                  <Check className="w-3 h-3 mr-1" />
                  {t("verified", { ns: "common" })}
                </span>
              )}
            </div>
            
            <h1 className={`text-3xl md:text-4xl font-bold ${isLtr ? 'font-playfair' : 'font-tajawal'}`}>
              {isLtr ? salon.nameEn : salon.nameAr}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 mt-3">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span className={`${isRtl ? 'font-tajawal' : ''}`}>{salon.city}</span>
              </div>
              
              {salon.rating !== null && (
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 text-primary fill-primary" />
                  <span className="mr-1">{salon.rating}</span>
                  <span className="text-sm text-white/70">
                    ({reviews?.length || 0} {isLtr ? "reviews" : "تقييمات"})
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Salon Details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className={`text-lg font-semibold mb-4 ${isRtl ? 'font-tajawal' : ''}`}>
                  {t("features")}
                </h3>
                
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-primary mr-2" />
                    <span className={`${isRtl ? 'font-tajawal' : ''}`}>
                      {salon.isLadiesOnly 
                        ? t("ladiesOnly", { ns: "common" }) 
                        : isLtr ? "Mixed" : "مختلط"
                      }
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-primary mr-2" />
                    <span className={`${isRtl ? 'font-tajawal' : ''}`}>
                      {salon.hasPrivateRooms 
                        ? t("privateRoom", { ns: "common" }) 
                        : isLtr ? "Open Space" : "مساحة مفتوحة"
                      }
                    </span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-primary mr-2" />
                    <span className={`${isRtl ? 'font-tajawal' : ''}`}>
                      {salon.isHijabFriendly 
                        ? t("hijabFriendly", { ns: "common" }) 
                        : isLtr ? "Standard" : "عادي"
                      }
                    </span>
                  </li>
                </ul>
                
                <div className="border-t border-border my-4 pt-4">
                  <h3 className={`text-lg font-semibold mb-4 ${isRtl ? 'font-tajawal' : ''}`}>
                    {t("salon.location")}
                  </h3>
                  <p className={`text-muted-foreground mb-2 ${isRtl ? 'font-tajawal' : ''}`}>
                    {salon.address}
                  </p>
                  <p className={`text-muted-foreground ${isRtl ? 'font-tajawal' : ''}`}>
                    {salon.city}
                  </p>
                </div>
                
                <div className="border-t border-border my-4 pt-4">
                  <h3 className={`text-lg font-semibold mb-4 ${isRtl ? 'font-tajawal' : ''}`}>
                    {isLtr ? "Contact" : "التواصل"}
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-primary" />
                      <span>{salon.phone}</span>
                    </div>
                    
                    {salon.email && (
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-primary" />
                        <span>{salon.email}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="border-t border-border my-4 pt-4">
                  <h3 className={`text-lg font-semibold mb-4 ${isRtl ? 'font-tajawal' : ''}`}>
                    {t("salon.price")}
                  </h3>
                  <p className="text-primary font-medium">
                    {salon.priceRange}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="services" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger 
                  value="services" 
                  className={`flex-1 ${isRtl ? 'font-tajawal' : ''}`}
                  onClick={() => setActiveTab("services")}
                >
                  {t("salon.services")}
                </TabsTrigger>
                <TabsTrigger 
                  value="about" 
                  className={`flex-1 ${isRtl ? 'font-tajawal' : ''}`}
                  onClick={() => setActiveTab("about")}
                >
                  {t("salon.aboutSalon")}
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews" 
                  className={`flex-1 ${isRtl ? 'font-tajawal' : ''}`}
                  onClick={() => setActiveTab("reviews")}
                >
                  {t("salon.reviews")}
                </TabsTrigger>
              </TabsList>
              
              {/* Services Tab */}
              <TabsContent value="services">
                {isServicesLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : services && services.length > 0 ? (
                  <div className="space-y-4 mt-4">
                    {services.map(service => (
                      <ServiceCard 
                        key={service.id} 
                        service={service} 
                        salonId={salon.id} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className={`text-muted-foreground ${isRtl ? 'font-tajawal' : ''}`}>
                      {isLtr 
                        ? "No services available at the moment." 
                        : "لا توجد خدمات متاحة في الوقت الحالي."
                      }
                    </p>
                  </div>
                )}
              </TabsContent>
              
              {/* About Tab */}
              <TabsContent value="about">
                <div className="mt-4">
                  <h3 className={`text-2xl font-bold mb-4 ${isLtr ? 'font-playfair' : 'font-tajawal'}`}>
                    {t("salon.aboutSalon")}
                  </h3>
                  
                  <p className={`text-muted-foreground mb-6 ${isRtl ? 'font-tajawal' : ''}`}>
                    {isLtr 
                      ? (salon.descriptionEn || "No description available.") 
                      : (salon.descriptionAr || "لا يوجد وصف متاح.")
                    }
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-muted p-4 rounded-lg flex items-center">
                      <Calendar className="w-5 h-5 text-primary mr-3" />
                      <div>
                        <h4 className={`font-medium ${isRtl ? 'font-tajawal' : ''}`}>
                          {isLtr ? "Working Hours" : "ساعات العمل"}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {isLtr ? "Sun-Thu: 10:00 - 22:00" : "الأحد-الخميس: ١٠:٠٠ - ٢٢:٠٠"}
                          <br />
                          {isLtr ? "Fri-Sat: 14:00 - 00:00" : "الجمعة-السبت: ١٤:٠٠ - ٠٠:٠٠"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-lg flex items-center">
                      <Users className="w-5 h-5 text-primary mr-3" />
                      <div>
                        <h4 className={`font-medium ${isRtl ? 'font-tajawal' : ''}`}>
                          {isLtr ? "Team" : "الفريق"}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {isLtr 
                            ? "Professional beauty specialists" 
                            : "متخصصات تجميل محترفات"
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Reviews Tab */}
              <TabsContent value="reviews">
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className={`text-2xl font-bold ${isLtr ? 'font-playfair' : 'font-tajawal'}`}>
                      {t("salon.reviews")}
                    </h3>
                    
                    <Button 
                      variant="outline" 
                      className={`${isRtl ? 'font-tajawal' : ''}`}
                    >
                      {t("salon.writeReview")}
                    </Button>
                  </div>
                  
                  {isReviewsLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : reviews && reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border border-border rounded-lg p-4">
                          <div className="flex justify-between mb-3">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                                <span className="text-primary font-bold">
                                  {review.userId.toString().charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium">User #{review.userId}</p>
                                <div className="flex text-primary text-xs">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${
                                        i < review.rating
                                          ? "fill-primary"
                                          : "stroke-primary fill-none"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                          
                          <p className={`text-muted-foreground ${isRtl ? 'font-tajawal' : ''}`}>
                            {review.comment || (isLtr ? "No comment provided." : "لم يتم تقديم تعليق.")}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className={`text-muted-foreground ${isRtl ? 'font-tajawal' : ''}`}>
                        {isLtr 
                          ? "No reviews yet. Be the first to review!" 
                          : "لا توجد تقييمات حتى الآن. كوني أول من يقيم!"
                        }
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalonDetails;
