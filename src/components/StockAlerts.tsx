
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Calendar, Package, Eye } from 'lucide-react';

const StockAlerts = () => {
  const alerts: any[] = [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          Stock Alerts (0)
        </CardTitle>
        <CardDescription>
          Items requiring immediate attention
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">No stock alerts</p>
          <p className="text-sm">All your inventory is properly managed</p>
        </div>
        
        <div className="mt-6 flex justify-between">
          <Button variant="outline" size="sm" disabled>
            Export Alerts
          </Button>
          <Button size="sm" disabled>
            View All Alerts
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockAlerts;
