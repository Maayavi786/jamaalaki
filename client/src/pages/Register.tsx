import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "wouter";
import { getIslamicPatternSvg } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

const Register = () => {
  const { t } = useTranslation("auth");
  const { isLtr, isRtl } = useLanguage();
  const { register, isAuthenticated, loading } = useAuth();
  const [_, navigate] = useLocation();
  
  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/profile');
    }
  }, [isAuthenticated, loading, navigate]);
  
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
  
  // Form schema with validation
  const formSchema = z.object({
    username: z.string().min(3, {
      message: isLtr 
        ? "Username must be at least 3 characters." 
        : "يجب أن يكون اسم المستخدم 3 أحرف على الأقل."
    }),
    email: z.string().email({
      message: isLtr 
        ? "Please enter a valid email address." 
        : "يرجى إدخال عنوان بريد إلكتروني صالح."
    }),
    password: z.string().min(6, {
      message: isLtr 
        ? "Password must be at least 6 characters." 
        : "يجب أن تكون كلمة المرور 6 أحرف على الأقل."
    }),
    confirmPassword: z.string(),
    fullName: z.string().min(2, {
      message: isLtr 
        ? "Full name must be at least 2 characters." 
        : "يجب أن يكون الاسم الكامل حرفين على الأقل."
    }),
    phone: z.string().optional(),
    preferredLanguage: z.string().default(isLtr ? "en" : "ar"),
  }).refine((data) => data.password === data.confirmPassword, {
    message: isLtr 
      ? "Passwords don't match" 
      : "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      phone: "",
      preferredLanguage: isLtr ? "en" : "ar",
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Remove confirmPassword as it's not needed for the API
    const { confirmPassword, ...userData } = values;
    
    const success = await register(userData);
    if (success) {
      navigate('/profile');
    }
  };
  
  return (
    <>
      <Helmet>
        <title>
          {isLtr ? "Register | Glam Haven" : "التسجيل | جلام هيفن"}
        </title>
        <meta name="description" content={isLtr 
          ? "Create a new account on Glam Haven"
          : "إنشاء حساب جديد في جلام هيفن"
        } />
      </Helmet>
      
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className={`text-2xl ${isLtr ? 'font-playfair' : 'font-tajawal'}`}>
              {t("registerTitle")}
            </CardTitle>
            <CardDescription className={`${isRtl ? 'font-tajawal' : ''}`}>
              {t("registerSubtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={`${isRtl ? 'font-tajawal' : ''}`}>
                        {t("fullName")}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={isLtr ? "Enter your full name" : "أدخل اسمك الكامل"} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className={`${isRtl ? 'font-tajawal' : ''}`} />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={`${isRtl ? 'font-tajawal' : ''}`}>
                        {t("username")}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={isLtr ? "Choose a username" : "اختر اسم مستخدم"} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className={`${isRtl ? 'font-tajawal' : ''}`} />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={`${isRtl ? 'font-tajawal' : ''}`}>
                        {t("email")}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder={isLtr ? "Enter your email" : "أدخل بريدك الإلكتروني"} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className={`${isRtl ? 'font-tajawal' : ''}`} />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={`${isRtl ? 'font-tajawal' : ''}`}>
                        {t("phone")}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={isLtr ? "Enter your phone number" : "أدخل رقم هاتفك"} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className={`${isRtl ? 'font-tajawal' : ''}`} />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={`${isRtl ? 'font-tajawal' : ''}`}>
                        {t("password")}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder={isLtr ? "Create a password" : "أنشئ كلمة مرور"} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className={`${isRtl ? 'font-tajawal' : ''}`} />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={`${isRtl ? 'font-tajawal' : ''}`}>
                        {t("confirmPassword")}
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder={isLtr ? "Confirm your password" : "أكد كلمة المرور"} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className={`${isRtl ? 'font-tajawal' : ''}`} />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className={`w-full ${isRtl ? 'font-tajawal' : ''}`}
                  disabled={loading}
                >
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {t("registerButton")}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className={`text-sm text-muted-foreground ${isRtl ? 'font-tajawal' : ''}`}>
              {t("haveAccount")}{" "}
              <Link href="/login">
                <Button 
                  variant="link" 
                  className={`p-0 h-auto ${isRtl ? 'font-tajawal' : ''}`}
                >
                  {t("loginButton")}
                </Button>
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Register;
