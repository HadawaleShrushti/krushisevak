import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Sprout, Plus, Package, TrendingUp, DollarSign, Upload, Trash2, Gavel, Clock, Eye } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCrops } from '../contexts/CropsContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { BiddingModal } from '../components/BiddingModal';

export function FarmerDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { getFarmerCrops, addCrop, updateCropStatus, deleteCrop, enableBidding, getCropBids, acceptBid, rejectBid } = useCrops();
  
  // Using logged-in farmer
  const currentFarmerId = user?.id || 'farmer1';
  const currentFarmerName = user?.name || 'Ramesh Kumar';
  const crops = getFarmerCrops(currentFarmerId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCropForBids, setSelectedCropForBids] = useState<string | null>(null);
  const [biddingDuration, setBiddingDuration] = useState<{ [key: string]: number }>({});
  const [newCrop, setNewCrop] = useState({
    name: '',
    quantity: '',
    price: '',
    location: '',
  });

  const handleSubmitCrop = () => {
    if (!newCrop.name || !newCrop.quantity || !newCrop.price || !newCrop.location) {
      toast.error('Please fill all fields');
      return;
    }

    addCrop({
      name: newCrop.name,
      quantity: parseFloat(newCrop.quantity),
      price: parseFloat(newCrop.price),
      location: newCrop.location,
      status: 'available',
      farmerName: currentFarmerName,
      farmerId: currentFarmerId,
    });

    setNewCrop({ name: '', quantity: '', price: '', location: '' });
    setIsDialogOpen(false);
  };

  const handleStatusChange = (cropId: string, newStatus: 'available' | 'sold' | 'pending') => {
    updateCropStatus(cropId, newStatus);
  };

  const handleDeleteCrop = (cropId: string) => {
    deleteCrop(cropId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'sold':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const stats = [
    {
      title: t('myCrops'),
      value: crops.filter((c) => c.status === 'available').length,
      icon: Package,
      color: 'text-primary',
      bgColor: 'bg-green-50',
    },
    {
      title: t('sold'),
      value: crops.filter((c) => c.status === 'sold').length,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Revenue',
      value: `₹${crops
        .filter((c) => c.status === 'sold')
        .reduce((acc, c) => acc + c.price * c.quantity, 0)
        .toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-4 rounded-xl`}>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* My Crops Section */}
        <Card className="border-0 shadow-lg rounded-2xl">
          <CardHeader className="border-b bg-white rounded-t-2xl">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl flex items-center gap-2">
                <Sprout className="w-6 h-6 text-primary" />
                {t('myCrops')}
              </CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 rounded-xl bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4" />
                    {t('sellCrop')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">{t('sellCrop')}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="cropName">{t('cropName')}</Label>
                      <Input
                        id="cropName"
                        placeholder="e.g., Wheat, Rice"
                        value={newCrop.name}
                        onChange={(e) => setNewCrop({ ...newCrop, name: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity">{t('quantity')}</Label>
                      <Input
                        id="quantity"
                        type="number"
                        placeholder="500"
                        value={newCrop.quantity}
                        onChange={(e) => setNewCrop({ ...newCrop, quantity: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">{t('price')}</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="25"
                        value={newCrop.price}
                        onChange={(e) => setNewCrop({ ...newCrop, price: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">{t('location')}</Label>
                      <Input
                        id="location"
                        placeholder="Pune, Maharashtra"
                        value={newCrop.location}
                        onChange={(e) => setNewCrop({ ...newCrop, location: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image">{t('uploadImage')}</Label>
                      <div className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-accent transition-colors">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Click to upload image</p>
                      </div>
                    </div>
                    <Button
                      onClick={handleSubmitCrop}
                      className="w-full rounded-xl bg-primary hover:bg-primary/90"
                    >
                      {t('submit')}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {crops.map((crop) => (
                <Card key={crop.id} className="border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-200">
                  <div className="bg-gradient-to-br from-green-100 to-green-50 h-40 flex items-center justify-center">
                    <Sprout className="w-16 h-16 text-primary" />
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg">{crop.name}</h3>
                      <Badge className={`${getStatusColor(crop.status)} rounded-full px-3`}>
                        {t(crop.status)}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>
                        <span className="font-medium text-foreground">{crop.quantity}</span> kg
                      </p>
                      <p>
                        <span className="font-medium text-foreground">₹{crop.price}</span> /{' '}\n                        {t('perKg')}
                      </p>
                      <p className="flex items-center gap-1">
                        <span>{crop.location}</span>
                      </p>
                      {crop.status === 'sold' && crop.purchasedBy && (
                        <p className="text-green-600 font-medium">
                          Sold to: {crop.purchasedBy}
                        </p>
                      )}
                      {crop.biddingEnabled && (
                        <div className="flex items-center gap-2 text-primary font-medium">
                          <Gavel className="w-4 h-4" />
                          {getCropBids(crop.id).length} bids
                          {crop.highestBid && ` • ₹${crop.highestBid}`}
                        </div>
                      )}
                    </div>
                    
                    {!crop.biddingEnabled && crop.status === 'available' && (
                      <Button
                        onClick={() => {
                          enableBidding(crop.id, 60); // 60 minutes
                        }}
                        variant="outline"
                        className="w-full gap-2 rounded-xl border-primary text-primary hover:bg-primary hover:text-white"
                      >
                        <Gavel className="w-4 h-4" />
                        {t('enableBidding')}
                      </Button>
                    )}
                    
                    {crop.biddingEnabled && crop.status !== 'sold' && (
                      <Button
                        onClick={() => setSelectedCropForBids(crop.id)}
                        variant="outline"
                        className="w-full gap-2 rounded-xl border-blue-500 text-blue-600 hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4" />
                        {t('viewBids')} ({getCropBids(crop.id).length})
                      </Button>
                    )}
                    
                    <div className="flex gap-2">
                      {crop.status !== 'sold' && (
                        <Button
                          onClick={() => handleStatusChange(crop.id, 'sold')}
                          size="sm"
                          className="flex-1 gap-1 rounded-xl bg-green-600 hover:bg-green-700"
                        >
                          {t('markSold')}
                        </Button>
                      )}
                      <Button
                        onClick={() => handleDeleteCrop(crop.id)}
                        size="sm"
                        variant="destructive"
                        className="flex-1 gap-1 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Bidding Modal */}
      {selectedCropForBids && (
        <BiddingModal
          cropId={selectedCropForBids}
          isOpen={!!selectedCropForBids}
          onClose={() => setSelectedCropForBids(null)}
          isFarmer={true}
        />
      )}
    </div>
  );
}