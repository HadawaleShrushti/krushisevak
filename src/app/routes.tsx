import { createBrowserRouter } from 'react-router';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { RetailerDashboard } from './pages/RetailerDashboard';
import { Chat } from './pages/Chat';
import { OrderTracking } from './pages/OrderTracking';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Login,
  },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/register',
    Component: Register,
  },
  {
    path: '/farmer',
    Component: FarmerDashboard,
  },
  {
    path: '/retailer',
    Component: RetailerDashboard,
  },
  {
    path: '/chat/:id',
    Component: Chat,
  },
  {
    path: '/order/:id',
    Component: OrderTracking,
  },
]);