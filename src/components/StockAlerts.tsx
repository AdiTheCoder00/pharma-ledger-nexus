
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Calendar, Package, Eye } from 'lucide-react';

const StockAlerts = () => {
  const alerts = [
    {
      id: 1,
      type: 'expiry',
      priority: 'critical',
      drug: 'Paracetamol 500mg',
      manufacturer: 'Cipla Ltd',
      batch: 'PCM2024A',
      quantity: 150,
      unit: 'Tablets',
      expiryDate: '2024-08-15',
      daysLeft: 12,
      location: 'Rack A-15'
    },
    {
      id: 2,
      type: 'low_stock',
      priority: 'high',
      drug: 'Amoxicillin 250mg',
      manufacturer: 'Sun Pharma',
      batch: 'AMX2024B',
      quantity: 25,
      unit: 'Capsules',
      minLevel: 100,
      location: 'Rack B-08'
    },
    {
      id: 3,
      type: 'expiry',
      priority: 'warning',
      drug: 'Crocin Advance',
      manufacturer: 'GSK',
      batch: 'CRC2024C',
      quantity: 200,
      unit: 'Tablets',
      expiryDate: '2024-09-10',
      daysLeft: 45,
      location: 'Rack C-22'
    },
    {
      id: 4,
      type: 'negative_stock',
      priority: 'critical',
      drug: 'Azithromycin 500mg',
      manufacturer: 'Zydus',
      batch: 'AZI2024D',
      quantity: -15,
      unit: 'Tablets',
      location: 'Rack A-03'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'secondary';
      case 'warning': return 'outline';
      default: return 'secondary';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'expiry': return <Calendar className="h-4 w-4" />;
      case 'low_stock': return <Package className="h-4 w-4" />;
      case 'negative_stock': return <AlertTriangle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getAlertMessage = (alert: any) => {
    switch (alert.type) {
      case 'expiry':
        return `Expires in ${alert.daysLeft} days`;
      case 'low_stock':
        return `Below minimum level (${alert.minLevel})`;
      case 'negative_stock':
        return 'Negative stock detected';
      default:
        return 'Requires attention';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          Stock Alerts ({alerts.length})
        </CardTitle>
        <CardDescription>
          Items requiring immediate attention
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getAlertIcon(alert.type)}
                  <Badge variant={getPriorityColor(alert.priority)}>
                    {alert.priority.toUpperCase()}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">{alert.drug}</h4>
                <p className="text-sm text-gray-600">{alert.manufacturer}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Batch:</span>
                    <span className="ml-1 font-medium">{alert.batch}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Location:</span>
                    <span className="ml-1 font-medium">{alert.location}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Quantity:</span>
                    <span className={`ml-1 font-medium ${alert.quantity < 0 ? 'text-red-600' : ''}`}>
                      {alert.quantity} {alert.unit}
                    </span>
                  </div>
                  {alert.expiryDate && (
                    <div>
                      <span className="text-gray-500">Expiry:</span>
                      <span className="ml-1 font-medium">{alert.expiryDate}</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-3 p-2 bg-white rounded border-l-4 border-red-400">
                  <p className="text-sm font-medium text-red-700">
                    {getAlertMessage(alert)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-between">
          <Button variant="outline" size="sm">
            Export Alerts
          </Button>
          <Button size="sm">
            View All Alerts
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockAlerts;
