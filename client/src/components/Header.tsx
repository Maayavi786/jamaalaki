import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Menu, X, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import LanguageToggle from "./ui/LanguageToggle";
import ThemeToggle from "./ui/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { t } = useTranslation("common");
  const { isLtr, isRtl } = useLanguage();
  const { isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location, navigate] = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-background dark:bg-neutral-900 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <h1 className={`font-bold text-2xl text-primary ${isLtr ? 'font-playfair' : 'font-tajawal'}`}>
                {isLtr ? "The Beauty" : "جمالكِ"}
              </h1>
            </div>
          </Link>

          {/* Navigation for Desktop */}
          <nav className="hidden md:flex space-x-6 rtl:space-x-reverse">
            <Link href="/">
              <span className={`font-medium hover:text-primary transition-colors cursor-pointer ${location === "/" ? "text-primary" : ""} ${isRtl ? 'font-tajawal' : ''}`}>
                {t("home")}
              </span>
            </Link>
            <Link href="/salons">
              <span className={`font-medium hover:text-primary transition-colors cursor-pointer ${location === "/salons" ? "text-primary" : ""} ${isRtl ? 'font-tajawal' : ''}`}>
                {t("salons")}
              </span>
            </Link>
            <Link href="/services">
              <span className={`font-medium hover:text-primary transition-colors cursor-pointer ${location === "/services" ? "text-primary" : ""} ${isRtl ? 'font-tajawal' : ''}`}>
                {t("services")}
              </span>
            </Link>
            <Link href="/about">
              <span className={`font-medium hover:text-primary transition-colors cursor-pointer ${location === "/about" ? "text-primary" : ""} ${isRtl ? 'font-tajawal' : ''}`}>
                {t("about")}
              </span>
            </Link>
          </nav>

          {/* Right Menu */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <LanguageToggle />
            <ThemeToggle />

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-2 rounded-full hover:bg-primary hover:bg-opacity-10 transition-colors">
                    <User className="h-5 w-5 text-primary" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isLtr ? "end" : "start"}>
                  <DropdownMenuItem className={isRtl ? 'font-tajawal' : ''}>
                    <Link href="/profile">
                      <span className="w-full cursor-pointer">{t("profile")}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className={isRtl ? 'font-tajawal' : ''}>
                    {t("logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <div className={`text-primary p-2 rounded-full hover:bg-primary hover:bg-opacity-10 transition-colors cursor-pointer ${isRtl ? 'font-tajawal' : ''}`}>
                  <User className="h-5 w-5" />
                </div>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-primary"
              onClick={toggleMenu}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className={`bg-background dark:bg-neutral-900 h-full w-3/4 max-w-xs p-6 transform transition-transform ${isLtr ? 'right-0' : 'left-0'}`}>
            <div className="flex justify-between items-center mb-8">
              <h3 className={`font-bold text-xl text-primary ${isLtr ? 'font-playfair' : 'font-tajawal'}`}>
                {isLtr ? "The Beauty" : "جمالكِ"}
              </h3>
              <Button variant="ghost" size="icon" onClick={closeMenu}>
                <X className="h-6 w-6" />
              </Button>
            </div>

            <nav className="mb-8">
              <ul className="space-y-4">
                <li>
                  <Link href="/">
                    <span 
                      className={`block py-2 border-b border-neutral-200 dark:border-neutral-800 font-medium cursor-pointer ${isRtl ? 'font-tajawal' : ''}`}
                      onClick={closeMenu}
                    >
                      {t("home")}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/salons">
                    <span 
                      className={`block py-2 border-b border-neutral-200 dark:border-neutral-800 font-medium cursor-pointer ${isRtl ? 'font-tajawal' : ''}`}
                      onClick={closeMenu}
                    >
                      {t("salons")}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/services">
                    <span 
                      className={`block py-2 border-b border-neutral-200 dark:border-neutral-800 font-medium cursor-pointer ${isRtl ? 'font-tajawal' : ''}`}
                      onClick={closeMenu}
                    >
                      {t("services")}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/about">
                    <span 
                      className={`block py-2 border-b border-neutral-200 dark:border-neutral-800 font-medium cursor-pointer ${isRtl ? 'font-tajawal' : ''}`}
                      onClick={closeMenu}
                    >
                      {t("about")}
                    </span>
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="pt-4">
              {isAuthenticated ? (
                <>
                  <Link href="/profile">
                    <span 
                      className={`block w-full bg-primary text-white py-2 rounded-lg mb-4 text-center cursor-pointer ${isRtl ? 'font-tajawal' : ''}`}
                      onClick={closeMenu}
                    >
                      {t("profile")}
                    </span>
                  </Link>
                  <Button 
                    className={`w-full border border-primary text-primary ${isRtl ? 'font-tajawal' : ''}`}
                    variant="outline"
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                  >
                    {t("logout")}
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <span 
                      className={`block w-full bg-primary text-white py-2 rounded-lg mb-4 text-center cursor-pointer ${isRtl ? 'font-tajawal' : ''}`}
                      onClick={closeMenu}
                    >
                      {t("login")}
                    </span>
                  </Link>
                  <Link href="/register">
                    <span 
                      className={`block w-full border border-primary text-primary py-2 rounded-lg text-center cursor-pointer ${isRtl ? 'font-tajawal' : ''}`}
                      onClick={closeMenu}
                    >
                      {t("register")}
                    </span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;