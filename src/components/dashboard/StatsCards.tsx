
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, CheckCircle, XCircle } from 'lucide-react';

interface StatsCardsProps {
  totalBots: number;
  activeBots: number;
  errorBots: number;
}

export const StatsCards = ({ totalBots, activeBots, errorBots }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Total Bots
          </CardTitle>
          <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-800 dark:text-blue-200">{totalBots}</div>
          <p className="text-xs text-blue-600 dark:text-blue-400">
            All registered bots
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
            Active Bots
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-800 dark:text-green-200">{activeBots}</div>
          <p className="text-xs text-green-600 dark:text-green-400">
            Currently mining
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">
            Error Bots
          </CardTitle>
          <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-800 dark:text-red-200">{errorBots}</div>
          <p className="text-xs text-red-600 dark:text-red-400">
            Need attention
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
