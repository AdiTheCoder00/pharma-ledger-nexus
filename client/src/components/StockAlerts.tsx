
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Calendar, Package, Eye, Download } from 'lucide-react';
import { dataStore } from '@/store/dataStore';
import { StockAlert } from '@/types';
import { toast } from "@/components/ui/sonner";

const StockAlerts = () => {
  const [alerts, setAlerts] = useState<StockAlert[]>([]);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = () => {
    const stockAlerts = dataStore.generateStockAlerts();
    setAlerts(stockAlerts);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'low_stock': return <Package className="h-4 w-4" />;
      case 'expiry_soon': return <Calendar className="h-4 w-4" />;
      case 'expired': return <AlertTriangle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const exportAlerts = () => {
    const csvContent = [
      ['Drug Name', 'Alert Type', 'Message', 'Severity', 'Date'].join(','),
      ...alerts.map(alert => [
        alert.drugName,
        alert.type.replace('_', ' ').toUpperCase(),
        alert.message,
        alert.severity.toUpperCase(),
        new Date(alert.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stock-alerts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Stock alerts exported successfully!");
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
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">No stock alerts</p>
            <p className="text-sm">All your inventory is properly managed</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-gray-500">
                    {getTypeIcon(alert.type)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{alert.drugName}</p>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                  </div>
                </div>
                <Badge variant={getSeverityColor(alert.severity)}>
                  {alert.severity.toUpperCase()}
                </Badge>
              </div>
            ))}
            {alerts.length > 5 && (
              <p className="text-sm text-gray-500 text-center">
                And {alerts.length - 5} more alerts...
              </p>
            )}
          </div>
        )}
        
        <div className="mt-6 flex justify-between">
          <Button variant="outline" size="sm" onClick={exportAlerts} disabled={alerts.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export Alerts
          </Button>
          <Button size="sm" onClick={loadAlerts}>
            <Eye className="h-4 w-4 mr-2" />
            Refresh Alerts
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockAlerts;
