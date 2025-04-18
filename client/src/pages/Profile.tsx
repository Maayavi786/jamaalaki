import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Booking, Salon, Service } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { getIslamicPatternSvg, formatDate, formatTime, getStatusColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  User, 
  Settings, 
  Calendar, 
  Award, 
  MoreVertical,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const { t } = useTranslation(["profile", "common"]);
  const { isLtr, isRtl } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  
  // States for managing booking data
  const [salonsMap, setSalonsMap] = useState<Record<number, Salon>>({});
  const [servicesMap, setServicesMap] = useState<Record<number, Service>>({});
  
  // Fetch user bookings
  const { data: bookings, isLoading: isBookingsLoading } = useQuery<Booking[]>({
    queryKey: [`/api/bookings/user/${user?.id}`],
    enabled: !!user,
  });
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: isLtr ? "Authentication Required" : "مطلوب تسجيل الدخول",
        description: isLtr 
          ? "Please log in to access your profile." 
          : "يرجى تسجيل الدخول للوصول إلى ملفك الشخصي.",
        variant: "default",
      });
      navigate("/login");
    }
  }, [isAuthenticated, navigate, toast, isLtr]);
  
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
  
  // Fetch salon and service details for bookings
  useEffect(() => {
    if (!bookings) return;
    
    const fetchSalonDetails = async () => {
      const salonIds = [...new Set(bookings.map(booking => booking.salonId))];
      const newSalonsMap: Record<number, Salon> = {};
      
      for (const salonId of salonIds) {
        try {
          if (!(salonId in salonsMap)) {
            const response = await fetch(`/api/salons/${salonId}`);
            if (response.ok) {
              const salon = await response.json();
              newSalonsMap[salonId] = salon;
            }
          }
        } catch (error) {
          console.error(`Error fetching salon ${salonId}:`, error);
        }
      }
      
      setSalonsMap(prev => ({ ...prev, ...newSalonsMap }));
    };
    
    const fetchServiceDetails = async () => {
      const serviceIds = [...new Set(bookings.map(booking => booking.serviceId))];
      const newServicesMap: Record<number, Service> = {};
      
      for (const serviceId of serviceIds) {
        try {
          if (!(serviceId in servicesMap)) {
            const response = await fetch(`/api/services/${serviceId}`);
            if (response.ok) {
              const service = await response.json();
              newServicesMap[serviceId] = service;
            }
          }
        } catch (error) {
          console.error(`Error fetching service ${serviceId}:`, error);
        }
      }
      
      setServicesMap(prev => ({ ...prev, ...newServicesMap }));
    };
    
    fetchSalonDetails();
    fetchServiceDetails();
  }, [bookings]);
  
  // Handler for cancelling a booking
  const handleCancelBooking = async (bookingId: number) => {
    try {
      await apiRequest('PATCH', `/api/bookings/${bookingId}/status`, { status: 'cancelled' });
      queryClient.invalidateQueries({ queryKey: [`/api/bookings/user/${user?.id}`] });
      
      toast({
        title: isLtr ? "Booking Cancelled" : "تم إلغاء الحجز",
        description: isLtr 
          ? "Your booking has been cancelled successfully." 
          : "تم إلغاء حجزك بنجاح.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast({
        title: isLtr ? "Cancellation Failed" : "فشل الإلغاء",
        description: isLtr 
          ? "Failed to cancel your booking. Please try again." 
          : "فشل إلغاء الحجز. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };
  
  if (!user) {
    return null; // Will be redirected via the useEffect
  }
  
  // Separate bookings into upcoming and past
  const now = new Date();
  const upcomingBookings = bookings?.filter(booking => 
    new Date(booking.datetime) > now && booking.status !== 'cancelled'
  ) || [];
  
  const pastBookings = bookings?.filter(booking => 
    new Date(booking.datetime) <= now || booking.status === 'cancelled'
  ) || [];
  
  return (
    <>
      <Helmet>
        <title>
          {isLtr ? "My Profile | Glam Haven" : "ملفي الشخصي | جلام هيفن"}
        </title>
        <meta name="description" content={isLtr 
          ? "Manage your profile, bookings, and loyalty points"
          : "إدارة ملفك الشخصي والحجوزات ونقاط الولاء"
        } />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className={`text-3xl font-bold mb-6 ${isLtr ? 'font-playfair' : 'font-tajawal'}`}>
          {t("profile.myProfile")}
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className={`${isRtl ? 'font-tajawal' : ''}`}>
                  {t("profile.personalInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <User className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className={`text-xl font-bold ${isRtl ? 'font-tajawal' : ''}`}>
                    {user.fullName}
                  </h3>
                  <p className="text-muted-foreground">@{user.username}</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className={`text-sm font-medium text-muted-foreground mb-1 ${isRtl ? 'font-tajawal' : ''}`}>
                      {t("profile.email")}
                    </h4>
                    <p>{user.email}</p>
                  </div>
                  
                  {user.phone && (
                    <div>
                      <h4 className={`text-sm font-medium text-muted-foreground mb-1 ${isRtl ? 'font-tajawal' : ''}`}>
                        {t("profile.phone")}
                      </h4>
                      <p>{user.phone}</p>
                    </div>
                  )}
                  
                  <div>
                    <h4 className={`text-sm font-medium text-muted-foreground mb-1 ${isRtl ? 'font-tajawal' : ''}`}>
                      {t("profile.loyaltyPoints")}
                    </h4>
                    <div className="flex items-center">
                      <Award className="w-5 h-5 text-primary mr-2" />
                      <p className="font-medium">{user.loyaltyPoints} {isLtr ? "points" : "نقطة"}</p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className={`w-full mt-6 ${isRtl ? 'font-tajawal' : ''}`}
                  variant="outline"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {t("profile.update")}
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Bookings Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="upcoming">
              <TabsList className="w-full">
                <TabsTrigger 
                  value="upcoming" 
                  className={`flex-1 ${isRtl ? 'font-tajawal' : ''}`}
                >
                  {t("profile.upcomingBookings")}
                </TabsTrigger>
                <TabsTrigger 
                  value="past" 
                  className={`flex-1 ${isRtl ? 'font-tajawal' : ''}`}
                >
                  {t("profile.pastBookings")}
                </TabsTrigger>
              </TabsList>
              
              {/* Upcoming Bookings */}
              <TabsContent value="upcoming">
                <Card>
                  <CardHeader>
                    <CardTitle className={`${isRtl ? 'font-tajawal' : ''}`}>
                      {t("profile.upcomingBookings")}
                    </CardTitle>
                    <CardDescription className={`${isRtl ? 'font-tajawal' : ''}`}>
                      {isLtr 
                        ? "Your upcoming salon appointments" 
                        : "مواعيد الصالون القادمة الخاصة بك"
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isBookingsLoading ? (
                      <div className="flex justify-center items-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      </div>
                    ) : upcomingBookings.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingBookings.map((booking) => {
                          const salon = salonsMap[booking.salonId];
                          const service = servicesMap[booking.serviceId];
                          
                          return (
                            <div 
                              key={booking.id} 
                              className="border border-border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between"
                            >
                              <div className="mb-4 md:mb-0">
                                <div className="flex items-center mb-2">
                                  <Badge className={getStatusColor(booking.status)}>
                                    {booking.status}
                                  </Badge>
                                  <span className="mx-2">•</span>
                                  <Calendar className="w-4 h-4 mr-1 text-muted-foreground" />
                                  <span className="text-sm">
                                    {formatDate(booking.datetime)} at {formatTime(booking.datetime)}
                                  </span>
                                </div>
                                
                                <h4 className={`font-medium ${isRtl ? 'font-tajawal' : ''}`}>
                                  {salon && (isLtr ? salon.nameEn : salon.nameAr)}
                                </h4>
                                <p className={`text-sm text-muted-foreground ${isRtl ? 'font-tajawal' : ''}`}>
                                  {service && (isLtr ? service.nameEn : service.nameAr)}
                                </p>
                              </div>
                              
                              <div className="flex items-center">
                                <Button 
                                  variant="outline" 
                                  className={`mr-2 ${isRtl ? 'font-tajawal' : ''}`}
                                  size="sm"
                                  onClick={() => handleCancelBooking(booking.id)}
                                >
                                  {t("profile.cancelBooking")}
                                </Button>
                                
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreVertical className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem className={`${isRtl ? 'font-tajawal' : ''}`}>
                                      {isLtr ? "View Details" : "عرض التفاصيل"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className={`${isRtl ? 'font-tajawal' : ''}`}>
                                      {isLtr ? "Reschedule" : "إعادة جدولة"}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className={`text-muted-foreground ${isRtl ? 'font-tajawal' : ''}`}>
                          {t("profile.noBookings")}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Past Bookings */}
              <TabsContent value="past">
                <Card>
                  <CardHeader>
                    <CardTitle className={`${isRtl ? 'font-tajawal' : ''}`}>
                      {t("profile.pastBookings")}
                    </CardTitle>
                    <CardDescription className={`${isRtl ? 'font-tajawal' : ''}`}>
                      {isLtr 
                        ? "Your past salon appointments" 
                        : "مواعيد الصالون السابقة الخاصة بك"
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isBookingsLoading ? (
                      <div className="flex justify-center items-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      </div>
                    ) : pastBookings.length > 0 ? (
                      <div className="space-y-4">
                        {pastBookings.map((booking) => {
                          const salon = salonsMap[booking.salonId];
                          const service = servicesMap[booking.serviceId];
                          
                          return (
                            <div 
                              key={booking.id} 
                              className="border border-border rounded-lg p-4"
                            >
                              <div className="flex items-center mb-2">
                                <Badge className={getStatusColor(booking.status)}>
                                  {booking.status}
                                </Badge>
                                <span className="mx-2">•</span>
                                <Calendar className="w-4 h-4 mr-1 text-muted-foreground" />
                                <span className="text-sm">
                                  {formatDate(booking.datetime)} at {formatTime(booking.datetime)}
                                </span>
                                
                                {booking.pointsEarned && (
                                  <>
                                    <span className="mx-2">•</span>
                                    <Award className="w-4 h-4 mr-1 text-primary" />
                                    <span className="text-sm text-primary">
                                      +{booking.pointsEarned} {isLtr ? "points" : "نقطة"}
                                    </span>
                                  </>
                                )}
                              </div>
                              
                              <h4 className={`font-medium ${isRtl ? 'font-tajawal' : ''}`}>
                                {salon && (isLtr ? salon.nameEn : salon.nameAr)}
                              </h4>
                              <p className={`text-sm text-muted-foreground ${isRtl ? 'font-tajawal' : ''}`}>
                                {service && (isLtr ? service.nameEn : service.nameAr)}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className={`text-muted-foreground ${isRtl ? 'font-tajawal' : ''}`}>
                          {t("profile.noBookings")}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
