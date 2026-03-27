import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Sprout, ShoppingCart, MessageCircle, MapPin, Search, Gavel } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCrops } from '../contexts/CropsContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';

export function RetailerDashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { crops, updateCropStatus, placeBid } = useCrops();
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedCropType, setSelectedCropType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCropForBid, setSelectedCropForBid] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState('');

  const currentRetailerId = user?.id || 'retailer1';
  const currentRetailerName = user?.name || 'Sunil Trader';

  // Helper to check if crop is new (added in last 5 minutes)
  const isNewCrop = (createdAt: Date) => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return createdAt > fiveMinutesAgo;
  };

  // Filter to show all crops (not just available)
  const filteredCrops = crops.filter((crop) => {
    const matchesPrice = crop.price >= priceRange[0] && crop.price <= priceRange[1];
    const matchesLocation = selectedLocation === 'all' || crop.location.includes(selectedLocation);
    const matchesCropType = selectedCropType === 'all' || crop.name.toLowerCase() === selectedCropType.toLowerCase();
    const matchesSearch = crop.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          crop.farmerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPrice && matchesLocation && matchesCropType && matchesSearch;
  });

  const handleChat = (cropId: string) => {
    navigate(`/chat/${cropId}`);
  };

  const handleBuy = (cropId: string) => {
    const crop = crops.find((c) => c.id === cropId);
    if (crop?.status === 'available') {
      updateCropStatus(cropId, 'pending');
      toast.success('Order placed!', {
        description: `Your order for ${crop.name} is being processed`,
      });
      navigate(`/order/${cropId}`);
    } else {
      toast.error('This crop is not available for purchase');
    }
  };

  const handleBid = (cropId: string) => {
    const crop = crops.find((c) => c.id === cropId);
    if (crop?.status === 'available') {
      placeBid(cropId, currentRetailerId, currentRetailerName, parseFloat(bidAmount));
      toast.success('Bid placed!', {
        description: `Your bid for ${crop.name} is ${bidAmount}`,
      });
      setSelectedCropForBid(null);
      setBidAmount('');
    } else {
      toast.error('This crop is not available for bidding');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg rounded-2xl sticky top-24">
              <CardHeader className="border-b">
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-primary" />
                  {t('filters')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Search */}
                <div className="space-y-2">
                  <Label>Search</Label>
                  <Input
                    placeholder="Search crops..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded-xl"
                  />
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <Label>{t('priceRange')}</Label>
                  <div className="pt-2">
                    <Slider
                      min={0}
                      max={100}
                      step={5}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label>{t('location')}</Label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="Pune">Pune</SelectItem>
                      <SelectItem value="Mumbai">Mumbai</SelectItem>
                      <SelectItem value="Nashik">Nashik</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Crop Type */}
                <div className="space-y-2">
                  <Label>{t('cropType')}</Label>
                  <Select value={selectedCropType} onValueChange={setSelectedCropType}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select crop type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="all">All Crops</SelectItem>
                      <SelectItem value="wheat">Wheat</SelectItem>
                      <SelectItem value="rice">Rice</SelectItem>
                      <SelectItem value="tomatoes">Tomatoes</SelectItem>
                      <SelectItem value="onions">Onions</SelectItem>
                      <SelectItem value="potatoes">Potatoes</SelectItem>
                      <SelectItem value="corn">Corn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  className="w-full rounded-xl"
                  onClick={() => {
                    setPriceRange([0, 100]);
                    setSelectedLocation('all');
                    setSelectedCropType('all');
                    setSearchQuery('');
                  }}
                >
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Crops Grid */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-lg rounded-2xl">
              <CardHeader className="border-b bg-white rounded-t-2xl">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Sprout className="w-6 h-6 text-primary" />
                  {t('availableCrops')}
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    ({filteredCrops.length} crops)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCrops.map((crop) => (
                    <Card
                      key={crop.id}
                      className={`border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-200 ${
                        isNewCrop(crop.createdAt) ? 'ring-2 ring-primary ring-offset-2' : ''
                      }`}
                    >
                      <div className="bg-gradient-to-br from-green-100 to-green-50 h-40 flex items-center justify-center relative">
                        <Sprout className="w-16 h-16 text-primary" />
                        {isNewCrop(crop.createdAt) && (
                          <Badge className="absolute top-3 right-3 bg-red-500 text-white animate-pulse">
                            NEW
                          </Badge>
                        )}
                        <Badge
                          className={`absolute top-3 left-3 ${
                            crop.status === 'available'
                              ? 'bg-green-500 text-white'
                              : crop.status === 'pending'
                              ? 'bg-yellow-500 text-white'
                              : 'bg-gray-500 text-white'
                          }`}
                        >
                          {t(crop.status)}
                        </Badge>
                      </div>
                      <CardContent className="p-4 space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{crop.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {t('farmer')}: {crop.farmerName}
                          </p>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p className="flex items-center justify-between">
                            <span className="text-muted-foreground">Quantity:</span>
                            <span className="font-medium">{crop.quantity} kg</span>
                          </p>
                          <p className="flex items-center justify-between">
                            <span className="text-muted-foreground">Price:</span>
                            <span className="font-semibold text-primary text-lg">
                              ₹{crop.price}/{t('perKg')}
                            </span>
                          </p>
                          <p className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {crop.location}
                          </p>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            className="flex-1 rounded-xl bg-primary hover:bg-primary/90"
                            onClick={() => handleBuy(crop.id)}
                            disabled={crop.status !== 'available'}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            {t('buy')}
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 rounded-xl"
                            onClick={() => handleChat(crop.id)}
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            {t('chat')}
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 rounded-xl"
                            onClick={() => setSelectedCropForBid(crop.id)}
                            disabled={crop.status !== 'available'}
                          >
                            <Gavel className="w-4 h-4 mr-2" />
                            {t('bid')}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {filteredCrops.length === 0 && (
                  <div className="text-center py-12">
                    <Sprout className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No crops found matching your filters</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Bid Dialog */}
      <Dialog open={selectedCropForBid !== null} onOpenChange={() => setSelectedCropForBid(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Place a Bid</DialogTitle>
          </DialogHeader>
          <CardContent className="space-y-4">
            <Label>Enter your bid amount (in ₹)</Label>
            <Input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="rounded-xl"
            />
          </CardContent>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setSelectedCropForBid(null)}
            >
              Cancel
            </Button>
            <Button
              className="rounded-xl bg-primary hover:bg-primary/90"
              onClick={() => handleBid(selectedCropForBid!)}
              disabled={bidAmount === ''}
            >
              Place Bid
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}