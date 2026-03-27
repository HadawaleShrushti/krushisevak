import { Sprout, Globe, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router';

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-primary rounded-xl p-2">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-primary">{t('appName')}</span>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 rounded-xl">
                  <Globe className="w-4 h-4" />
                  <span className="uppercase">{language}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuItem onClick={() => setLanguage('en')} className="rounded-lg">
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('hi')} className="rounded-lg">
                  हिंदी (Hindi)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('mr')} className="rounded-lg">
                  मराठी (Marathi)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <User className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl w-48">
                <DropdownMenuItem className="rounded-lg">
                  <User className="w-4 h-4 mr-2" />
                  {t('profile')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="rounded-lg text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
