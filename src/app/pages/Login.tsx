import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Sprout, Mail, Lock, UserCircle, Store } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'sonner';

export function Login() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'farmer' | 'retailer' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    const success = login(email, password);
    
    if (success) {
      toast.success('Login successful!');
      if (selectedRole === 'farmer') {
        navigate('/farmer');
      } else if (selectedRole === 'retailer') {
        navigate('/retailer');
      }
    } else {
      toast.error('Invalid credentials', {
        description: 'Please check your email and password',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden md:flex flex-col items-center justify-center space-y-6 p-8">
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <Sprout className="w-32 h-32 text-primary" strokeWidth={1.5} />
          </div>
          <div className="text-center space-y-3">
            <h1 className="text-5xl font-bold text-primary">{t('appName')}</h1>
            <p className="text-xl text-muted-foreground">{t('appTagline')}</p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary to-secondary text-white p-8">
              <div className="flex items-center justify-center mb-4">
                <Sprout className="w-12 h-12" />
              </div>
              <CardTitle className="text-center text-3xl text-white">{t('selectRole')}</CardTitle>
              <CardDescription className="text-center text-green-50 mt-2">
                {t('appTagline')}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-8 space-y-6">
              {/* Role Selection */}
              {!selectedRole ? (
                <div className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full h-auto py-6 flex flex-col items-center gap-3 hover:bg-primary hover:text-white transition-all duration-200 border-2 rounded-xl"
                    onClick={() => setSelectedRole('farmer')}
                  >
                    <UserCircle className="w-8 h-8" />
                    <span className="text-lg">{t('farmerLogin')}</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full h-auto py-6 flex flex-col items-center gap-3 hover:bg-primary hover:text-white transition-all duration-200 border-2 rounded-xl"
                    onClick={() => setSelectedRole('retailer')}
                  >
                    <Store className="w-8 h-8" />
                    <span className="text-lg">{t('retailerLogin')}</span>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">
                      {selectedRole === 'farmer' ? t('farmerLogin') : t('retailerLogin')}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedRole(null)}
                      className="text-muted-foreground"
                    >
                      Change
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t('email')}</Label>
                    <Input
                      id="email"
                      type="text"
                      placeholder="farmer@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-xl h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">{t('password')}</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="rounded-xl h-12"
                    />
                  </div>

                  <Button
                    className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90"
                    onClick={handleLogin}
                  >
                    {t('login')}
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary font-medium hover:underline">
                      {t('register')}
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

        
        </div>
      </div>
    </div>
  );
}