import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Clock, Gavel, CheckCircle, XCircle } from 'lucide-react';
import { useCrops } from '../contexts/CropsContext';
import { useLanguage } from '../contexts/LanguageContext';

interface BiddingModalProps {
  cropId: string;
  isOpen: boolean;
  onClose: () => void;
  isFarmer?: boolean;
}

export function BiddingModal({ cropId, isOpen, onClose, isFarmer = false }: BiddingModalProps) {
  const { crops, getCropBids, acceptBid, rejectBid } = useCrops();
  const { t } = useLanguage();
  const [timeRemaining, setTimeRemaining] = useState('');

  const crop = crops.find((c) => c.id === cropId);
  const bids = getCropBids(cropId);

  useEffect(() => {
    if (!crop?.biddingEndTime) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(crop.biddingEndTime!).getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeRemaining('Ended');
        clearInterval(interval);
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [crop]);

  if (!crop) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Gavel className="w-6 h-6 text-primary" />
            {isFarmer ? t('viewBids') : t('placeBid')} - {crop.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Crop Info */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">{t('quantity')}</p>
                  <p className="font-semibold text-lg">{crop.quantity} kg</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Base Price</p>
                  <p className="font-semibold text-lg">₹{crop.price}/{t('perKg')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('highestBid')}</p>
                  <p className="font-semibold text-lg text-primary">
                    {crop.highestBid ? `₹${crop.highestBid}/${t('perKg')}` : 'No bids yet'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {t('timeRemaining')}
                  </p>
                  <Badge variant="outline" className="text-sm font-mono">
                    {timeRemaining}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bids List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">
              {isFarmer ? 'All Bids' : 'Current Bids'} ({bids.length})
            </h3>
            
            {bids.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center text-muted-foreground">
                  <Gavel className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>{t('noBids')}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {bids.map((bid, index) => (
                  <Card
                    key={bid.id}
                    className={`border ${
                      bid.status === 'accepted'
                        ? 'bg-green-50 border-green-200'
                        : bid.status === 'rejected'
                        ? 'bg-red-50 border-red-200'
                        : index === 0
                        ? 'border-primary ring-2 ring-primary ring-offset-2'
                        : ''
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold">{bid.retailerName}</p>
                            {index === 0 && bid.status === 'pending' && (
                              <Badge className="bg-primary text-white text-xs">
                                Highest Bid
                              </Badge>
                            )}
                            {bid.status === 'accepted' && (
                              <Badge className="bg-green-600 text-white text-xs flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Accepted
                              </Badge>
                            )}
                            {bid.status === 'rejected' && (
                              <Badge className="bg-red-600 text-white text-xs flex items-center gap-1">
                                <XCircle className="w-3 h-3" />
                                Rejected
                              </Badge>
                            )}
                          </div>
                          <p className="text-2xl font-bold text-primary">
                            ₹{bid.amount}
                            <span className="text-sm text-muted-foreground">/{t('perKg')}</span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(bid.createdAt).toLocaleString()}
                          </p>
                        </div>
                        
                        {isFarmer && bid.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => {
                                acceptBid(bid.id);
                                onClose();
                              }}
                              className="bg-green-600 hover:bg-green-700 rounded-xl"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              {t('acceptBid')}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => rejectBid(bid.id)}
                              className="rounded-xl"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              {t('rejectBid')}
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
