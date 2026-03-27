import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Sprout, User, Mail, Phone, Lock, UserCircle, Store } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'sonner';

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'farmer' as 'farmer' | 'retailer',
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      toast.error('Please fill all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    const success = register(
      formData.name,
      formData.email,
      formData.phone,
      formData.password,
      formData.role
    );

    if (success) {
      toast.success('Account created successfully!', {
        description: 'Please login to continue',
        duration: 3000,
      });
      navigate('/login');
    } else {
      toast.error('Registration failed', {
        description: 'Email already exists',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary rounded-full p-4">
              <Sprout className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-primary mb-2">KrushiSevak</h1>
          <p className="text-muted-foreground text-lg">Create your account</p>
        </div>

        {/* Language Selector */}
        <div className="flex justify-center gap-2 mb-6">
          {(['en', 'hi', 'mr'] as const).map((lang) => (
            <Button
              key={lang}
              variant={language === lang ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLanguage(lang)}
              className="rounded-full"
            >
              {lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'मराठी'}
            </Button>
          ))}
        </div>

        {/* Registration Form */}
        <Card className="border-0 shadow-2xl rounded-3xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">{t('register')}</CardTitle>
            <CardDescription>Fill in your details to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-3">
                <Label className="text-base">{t('selectRole')}</Label>
                <RadioGroup
                  value={formData.role}
                  onValueChange={(value: 'farmer' | 'retailer') =>
                    setFormData({ ...formData, role: value })
                  }
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem
                      value="farmer"
                      id="farmer"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="farmer"
                      className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-white p-4 hover:bg-accent cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-green-50"
                    >
                      <UserCircle className="w-8 h-8 text-primary mb-2" />
                      <span className="text-sm font-medium">{t('farmer')}</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="retailer"
                      id="retailer"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="retailer"
                      className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-white p-4 hover:bg-accent cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-green-50"
                    >
                      <Store className="w-8 h-8 text-primary mb-2" />
                      <span className="text-sm font-medium">{t('retailer')}</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">{t('name')}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="pl-10 rounded-xl h-12"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pl-10 rounded-xl h-12"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="pl-10 rounded-xl h-12"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="pl-10 rounded-xl h-12"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    className="pl-10 rounded-xl h-12"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full rounded-xl h-12 text-base bg-primary hover:bg-primary/90"
              >
                {t('register')}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  {t('login')}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="mt-4 border-0 bg-blue-50 rounded-2xl">
          <CardContent className="p-4 text-xs text-muted-foreground">
            <p className="font-medium text-blue-900 mb-2">Demo Credentials:</p>
            <p>Farmer: farmer@test.com / farmer123</p>
            <p>Retailer: retailer@test.com / retailer123</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
