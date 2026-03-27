import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface Bid {
  id: string;
  cropId: string;
  retailerId: string;
  retailerName: string;
  amount: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface Crop {
  id: string;
  name: string;
  quantity: number;
  price: number;
  location: string;
  status: 'available' | 'sold' | 'pending' | 'bidding';
  farmerName: string;
  farmerId: string;
  image?: string;
  createdAt: Date;
  biddingEnabled?: boolean;
  biddingEndTime?: Date;
  highestBid?: number;
  purchasedBy?: string;
}

interface CropsContextType {
  crops: Crop[];
  bids: Bid[];
  addCrop: (crop: Omit<Crop, 'id' | 'createdAt'>) => void;
  updateCropStatus: (cropId: string, status: Crop['status'], purchasedBy?: string) => void;
  getFarmerCrops: (farmerId: string) => Crop[];
  getAvailableCrops: () => Crop[];
  deleteCrop: (cropId: string) => void;
  placeBid: (cropId: string, retailerId: string, retailerName: string, amount: number) => void;
  getCropBids: (cropId: string) => Bid[];
  acceptBid: (bidId: string) => void;
  rejectBid: (bidId: string) => void;
  enableBidding: (cropId: string, durationMinutes: number) => void;
}

const CropsContext = createContext<CropsContextType | undefined>(undefined);

// Initial mock data
const initialCrops: Crop[] = [
  {
    id: '1',
    name: 'Wheat',
    quantity: 500,
    price: 25,
    location: 'Pune, Maharashtra',
    status: 'available',
    farmerName: 'Ramesh Kumar',
    farmerId: 'farmer1',
    createdAt: new Date(Date.now() - 86400000),
    biddingEnabled: false,
  },
  {
    id: '2',
    name: 'Rice',
    quantity: 300,
    price: 40,
    location: 'Nashik, Maharashtra',
    status: 'pending',
    farmerName: 'Ramesh Kumar',
    farmerId: 'farmer1',
    createdAt: new Date(Date.now() - 172800000),
    biddingEnabled: false,
  },
  {
    id: '3',
    name: 'Tomatoes',
    quantity: 150,
    price: 30,
    location: 'Mumbai, Maharashtra',
    status: 'sold',
    farmerName: 'Prakash Jadhav',
    farmerId: 'farmer2',
    createdAt: new Date(Date.now() - 259200000),
    biddingEnabled: false,
    purchasedBy: 'Sunil Trader',
  },
  {
    id: '4',
    name: 'Onions',
    quantity: 200,
    price: 20,
    location: 'Pune, Maharashtra',
    status: 'bidding',
    farmerName: 'Vijay Deshmukh',
    farmerId: 'farmer2',
    createdAt: new Date(Date.now() - 345600000),
    biddingEnabled: true,
    biddingEndTime: new Date(Date.now() + 3600000), // 1 hour from now
    highestBid: 22,
  },
];

export function CropsProvider({ children }: { children: React.ReactNode }) {
  const [crops, setCrops] = useState<Crop[]>(initialCrops);
  const [bids, setBids] = useState<Bid[]>([
    {
      id: 'bid1',
      cropId: '4',
      retailerId: 'retailer1',
      retailerName: 'Sunil Trader',
      amount: 22,
      status: 'pending',
      createdAt: new Date(Date.now() - 1800000),
    },
  ]);

  const addCrop = (cropData: Omit<Crop, 'id' | 'createdAt'>) => {
    const newCrop: Crop = {
      ...cropData,
      id: Date.now().toString(),
      createdAt: new Date(),
      biddingEnabled: cropData.biddingEnabled || false,
    };

    setCrops((prevCrops) => [newCrop, ...prevCrops]);

    toast.success('New crop added successfully!', {
      description: `${cropData.name} is now available in the marketplace`,
      duration: 3000,
    });
  };

  const updateCropStatus = (cropId: string, status: Crop['status'], purchasedBy?: string) => {
    setCrops((prevCrops) =>
      prevCrops.map((crop) =>
        crop.id === cropId ? { ...crop, status, purchasedBy } : crop
      )
    );

    const crop = crops.find((c) => c.id === cropId);
    if (crop) {
      const statusText = status === 'sold' ? 'Sold' : status === 'pending' ? 'Pending' : 'Available';
      toast.info('Crop status updated', {
        description: `${crop.name} is now ${statusText}${purchasedBy ? ` to ${purchasedBy}` : ''}`,
        duration: 2000,
      });
    }
  };

  const deleteCrop = (cropId: string) => {
    const crop = crops.find((c) => c.id === cropId);
    setCrops((prevCrops) => prevCrops.filter((crop) => crop.id !== cropId));
    
    if (crop) {
      toast.success('Crop removed', {
        description: `${crop.name} has been removed from listings`,
        duration: 2000,
      });
    }
  };

  const enableBidding = (cropId: string, durationMinutes: number) => {
    const endTime = new Date(Date.now() + durationMinutes * 60 * 1000);
    setCrops((prevCrops) =>
      prevCrops.map((crop) =>
        crop.id === cropId
          ? {
              ...crop,
              biddingEnabled: true,
              biddingEndTime: endTime,
              status: 'bidding',
            }
          : crop
      )
    );

    toast.success('Bidding enabled!', {
      description: `Bidding will end in ${durationMinutes} minutes`,
      duration: 3000,
    });
  };

  const placeBid = (cropId: string, retailerId: string, retailerName: string, amount: number) => {
    const crop = crops.find((c) => c.id === cropId);
    if (!crop) return;

    if (crop.highestBid && amount <= crop.highestBid) {
      toast.error('Bid too low', {
        description: `Your bid must be higher than ₹${crop.highestBid}`,
      });
      return;
    }

    const newBid: Bid = {
      id: `bid${Date.now()}`,
      cropId,
      retailerId,
      retailerName,
      amount,
      status: 'pending',
      createdAt: new Date(),
    };

    setBids((prevBids) => [...prevBids, newBid]);
    setCrops((prevCrops) =>
      prevCrops.map((c) =>
        c.id === cropId ? { ...c, highestBid: amount } : c
      )
    );

    toast.success('Bid placed successfully!', {
      description: `Your bid of ₹${amount} has been submitted`,
      duration: 3000,
    });
  };

  const getCropBids = (cropId: string) => {
    return bids
      .filter((bid) => bid.cropId === cropId)
      .sort((a, b) => b.amount - a.amount);
  };

  const acceptBid = (bidId: string) => {
    const bid = bids.find((b) => b.id === bidId);
    if (!bid) return;

    const crop = crops.find((c) => c.id === bid.cropId);
    if (!crop) return;

    // Update bid status
    setBids((prevBids) =>
      prevBids.map((b) =>
        b.id === bidId
          ? { ...b, status: 'accepted' as const }
          : b.cropId === bid.cropId
          ? { ...b, status: 'rejected' as const }
          : b
      )
    );

    // Update crop status
    setCrops((prevCrops) =>
      prevCrops.map((c) =>
        c.id === bid.cropId
          ? {
              ...c,
              status: 'sold',
              biddingEnabled: false,
              purchasedBy: bid.retailerName,
            }
          : c
      )
    );

    toast.success('Bid accepted!', {
      description: `${crop.name} sold to ${bid.retailerName} for ₹${bid.amount}`,
      duration: 3000,
    });
  };

  const rejectBid = (bidId: string) => {
    const bid = bids.find((b) => b.id === bidId);
    setBids((prevBids) =>
      prevBids.map((b) => (b.id === bidId ? { ...b, status: 'rejected' as const } : b))
    );

    toast.info('Bid rejected', {
      description: bid ? `Bid from ${bid.retailerName} has been rejected` : 'Bid rejected',
      duration: 2000,
    });
  };

  const getFarmerCrops = (farmerId: string) => {
    return crops.filter((crop) => crop.farmerId === farmerId);
  };

  const getAvailableCrops = () => {
    return crops.filter((crop) => crop.status === 'available' || crop.status === 'bidding');
  };

  return (
    <CropsContext.Provider
      value={{
        crops,
        bids,
        addCrop,
        updateCropStatus,
        getFarmerCrops,
        getAvailableCrops,
        deleteCrop,
        placeBid,
        getCropBids,
        acceptBid,
        rejectBid,
        enableBidding,
      }}
    >
      {children}
    </CropsContext.Provider>
  );
}

export function useCrops() {
  const context = useContext(CropsContext);
  if (!context) {
    throw new Error('useCrops must be used within a CropsProvider');
  }
  return context;
}
