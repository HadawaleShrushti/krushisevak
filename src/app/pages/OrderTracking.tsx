import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Package, CheckCircle, Truck, MapPin, User, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

type OrderStatus = 'pending' | 'accepted' | 'in-transit' | 'delivered';

interface OrderStep {
  status: OrderStatus;
  label: string;
  icon: React.ElementType;
  timestamp?: string;
}

export function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [currentStatus] = useState<OrderStatus>('in-transit');

  const steps: OrderStep[] = [
    {
      status: 'pending',
      label: t('pending'),
      icon: Package,
      timestamp: 'Mar 25, 10:30 AM',
    },
    {
      status: 'accepted',
      label: t('accepted'),
      icon: CheckCircle,
      timestamp: 'Mar 25, 11:45 AM',
    },
    {
      status: 'in-transit',
      label: t('inTransit'),
      icon: Truck,
      timestamp: 'Mar 26, 8:00 AM',
    },
    {
      status: 'delivered',
      label: t('delivered'),
      icon: MapPin,
    },
  ];

  const orderDetails = {
    orderId: id || '12345',
    cropName: 'Wheat',
    quantity: 200,
    price: 24,
    totalAmount: 4800,
    farmerName: 'Ramesh Kumar',
    farmerPhone: '+91 98765 43210',
    location: 'Pune, Maharashtra',
    deliveryAddress: 'Shop No. 45, Market Yard, Mumbai',
  };

  const getStepStatus = (stepStatus: OrderStatus) => {
    const statusOrder = ['pending', 'accepted', 'in-transit', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" className="mb-4 gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="space-y-6">
          {/* Order Header */}
          <Card className="border-0 shadow-lg rounded-2xl">
            <CardHeader className="border-b bg-gradient-to-r from-primary to-secondary text-white rounded-t-2xl">
              <CardTitle className="text-2xl text-white">{t('orderTracking')}</CardTitle>
              <p className="text-green-50">Order ID: #{orderDetails.orderId}</p>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Order Timeline */}
            <div className="md:col-span-2">
              <Card className="border-0 shadow-lg rounded-2xl">
                <CardContent className="p-8">
                  <div className="space-y-8">
                    {steps.map((step, index) => {
                      const status = getStepStatus(step.status);
                      const Icon = step.icon;

                      return (
                        <div key={step.status} className="flex gap-4">
                          {/* Icon */}
                          <div className="flex flex-col items-center">
                            <div
                              className={`rounded-full p-3 ${
                                status === 'completed'
                                  ? 'bg-primary text-white'
                                  : status === 'current'
                                  ? 'bg-primary text-white ring-4 ring-primary/20'
                                  : 'bg-gray-200 text-gray-400'
                              }`}
                            >
                              <Icon className="w-6 h-6" />
                            </div>
                            {index < steps.length - 1 && (
                              <div
                                className={`w-0.5 h-16 mt-2 ${
                                  status === 'completed' ? 'bg-primary' : 'bg-gray-200'
                                }`}
                              />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 pb-8">
                            <h3
                              className={`font-semibold text-lg ${
                                status === 'upcoming' ? 'text-muted-foreground' : 'text-foreground'
                              }`}
                            >
                              {step.label}
                            </h3>
                            {step.timestamp && (
                              <p className="text-sm text-muted-foreground mt-1">{step.timestamp}</p>
                            )}
                            {status === 'current' && (
                              <div className="mt-2 flex items-center gap-2">
                                <div className="animate-pulse w-2 h-2 bg-primary rounded-full" />
                                <p className="text-sm text-primary font-medium">In Progress</p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Details Sidebar */}
            <div className="md:col-span-1 space-y-6">
              {/* Order Summary */}
              <Card className="border-0 shadow-lg rounded-2xl">
                <CardHeader className="border-b">
                  <CardTitle className="text-lg">{t('orderDetails')}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h4 className="font-semibold text-lg mb-1">{orderDetails.cropName}</h4>
                    <p className="text-sm text-muted-foreground">Quantity: {orderDetails.quantity} kg</p>
                    <p className="text-sm text-muted-foreground">
                      Price: ₹{orderDetails.price}/{t('perKg')}
                    </p>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total Amount:</span>
                      <span className="text-xl font-bold text-primary">
                        ₹{orderDetails.totalAmount}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Farmer Details */}
              <Card className="border-0 shadow-lg rounded-2xl">
                <CardHeader className="border-b">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    {t('farmer')} Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <p className="font-semibold">{orderDetails.farmerName}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Phone className="w-3 h-3" />
                      {orderDetails.farmerPhone}
                    </p>
                  </div>
                  <div className="border-t pt-3">
                    <p className="text-sm text-muted-foreground flex items-start gap-1">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{orderDetails.location}</span>
                    </p>
                  </div>
                  <Button className="w-full rounded-xl bg-primary hover:bg-primary/90 mt-2">
                    Contact Farmer
                  </Button>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              <Card className="border-0 shadow-lg rounded-2xl">
                <CardHeader className="border-b">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-sm">{orderDetails.deliveryAddress}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
