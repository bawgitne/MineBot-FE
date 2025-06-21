
import { Activity } from 'lucide-react';

export const DashboardHeader = () => {
  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center space-x-3">
        <div className="p-3 bg-minecraft-diamond/20 rounded-lg">
          <Activity className="h-8 w-8 text-minecraft-diamond" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-minecraft-diamond to-minecraft-emerald bg-clip-text text-transparent">
          Minecraft Bot Dashboard
        </h1>
      </div>
      <p className="text-lg text-muted-foreground">
        Monitor and control your Mineflayer bot army in real-time
      </p>
    </div>
  );
};
