import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Play, 
  TimerOff,
  Timer,
  ScreenShareOff,
  Square, 
  RotateCcw, 
  Wifi, 
  WifiOff, 
  Pause,
  History,
  Bell,
  Pickaxe,
  AlertTriangle
} from 'lucide-react';
import { type Bot } from '@/lib/mockData';
import { getBlockImageUrl } from '@/lib/blockImages';

interface BotCardProps {
  bot: Bot;
  onAction: (botId: string, action: string) => void;
  onViewHistory: () => void;
}

export const BotCard = ({ bot, onAction, onViewHistory }: BotCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'mining': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'repairing': return 'bg-blue-500';
      case 'logging': return 'bg-blue-600';
      case 'error': return 'bg-red-500';
      case 'disconnected': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getDurabilityColor = (durability: number | null) => {
    if (durability === null) return 'bg-gray-500';
    if (durability > 70) return 'bg-green-500';
    if (durability > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const formatUptime = (minutes: number) => {
    if (minutes < 1) return '< 1m';
    
    const days = Math.floor(minutes / (60 * 24));
    const hours = Math.floor((minutes % (60 * 24)) / 60);
    const mins = Math.floor(minutes % 60);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (mins > 0 || (days === 0 && hours === 0)) parts.push(`${mins}m`);
    
    return parts.join(' ');
  };

  const isLowDurability = bot.durability !== null && (bot.durability / 1561) * 100 < 50;
  const hasError = bot.status === 'error';

  return (
    <TooltipProvider>
      <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] animate-fade-in bg-card/80 backdrop-blur-sm border-border/50">
        {/* Status indicator */}
        <div className={`absolute top-0 left-0 w-full h-1 ${getStatusColor(bot.status)}`} />
        
        {/* Floating notification */}
        {bot.noti && (
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10 max-w-[100px]">
            <div className="bg-red-500 text-white px-3 py-1 text-xs font-medium rounded-full shadow-lg">
              {bot.noti}
            </div>
          </div>
        )}
        
        {/* Error notification bell */}
        {hasError && (
          <div className="absolute top-2 right-2">
            <Tooltip>
              <TooltipTrigger>
                <Bell className="h-4 w-4 text-red-500" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Bot encountered an error</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">{bot.username}</h3>
              <div className="flex items-center space-x-2">
                <Badge 
                  className={`text-xs text-white ${getStatusColor(bot.status)}`}
                >
                  {bot.status}
                </Badge>
              </div>
            </div>
            
            <div className="text-right text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                {bot.chunksLoaded ? (
                  <Wifi className="h-3 w-3 text-green-500" />
                ) : (
                  <WifiOff className="h-3 w-3 text-red-500" />
                )}
                <span>{bot.ping !== null ? `${bot.ping}ms` : 'N/A'}</span>
              </div>
              <div className="text-xs">
                Warp: {bot.warpName}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Current activity */}
          <div className="flex items-center space-x-2 text-sm">
            <img 
              src={getBlockImageUrl(bot.currentBlock)} 
              alt={bot.currentBlock} 
              className={`h-5 w-5 ${bot.status === 'mining' ? 'animate-bounce' : ''}`}
            />
            <span>Mining: <span className="font-semibold">{bot.currentBlock.replace("minecraft:", "")}</span></span>
          </div>

          {/* Durability */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Pickaxe Durability</span>
              <div className="flex items-center space-x-1">
                <span className={`font-medium ${isLowDurability ? 'text-red-500' : ''}`}>
                  {bot.durability !== null ? `${bot.durability}/1561 (${Math.round((bot.durability / 1561) * 100)}%)` : 'N/A'}
                </span>
                {isLowDurability && (
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertTriangle className="h-3 w-3 text-red-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Low durability - repair recommended</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
            <Progress 
              value={bot.durability !== null ? (bot.durability / 1561) * 100 : 0} 
              className="h-2"
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Blocks Today</div>
              <div className="font-semibold text-minecraft-emerald">{bot.blocksMinedToday}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Uptime</div>
              <div className="font-semibold">{formatUptime(bot.uptime)}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-4 gap-2">
            {/* Start/Disconnect button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    ['disconnected', 'error'].includes(bot.status)
                      ? onAction(bot.id, 'start')
                      : onAction(bot.id, 'disconnect')
                  }
                  disabled={false}
                  className={
                    ['disconnected', 'error'].includes(bot.status)
                      ? 'border border-gray-300 flex-1 hover:border-green-500'
                      : ['mining', 'logging', 'repairing', 'idle'].includes(bot.status)
                        ? 'bg-red-500 text-white border-red-500 flex-1 pointer-events-auto !hover:bg-red-500 !hover:border-red-500'
                        : 'border border-gray-300 flex-1'
                  }
                  style={
                    ['disconnected', 'error'].includes(bot.status)
                      ? {}
                      : ['mining', 'logging', 'repairing', 'idle'].includes(bot.status)
                        ? { pointerEvents: 'auto' }
                        : {}
                  }
                >
                  {['disconnected', 'error'].includes(bot.status) ? <Play className="h-3 w-3" /> : <ScreenShareOff className="h-3 w-3" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {['disconnected', 'error'].includes(bot.status)
                  ? 'Khởi động bot'
                  : 'Ngắt kết nối bot'}
              </TooltipContent>
            </Tooltip>

            {/* Stop/Continue button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => bot.status === 'idle' ? onAction(bot.id, 'continue') : onAction(bot.id, 'stop')}
                  disabled={['disconnected', 'error'].includes(bot.status)}
                  className={
                    bot.status === 'idle'
                      ? 'bg-green-500 text-white border-green-500 flex-1 pointer-events-auto !hover:bg-green-500 !hover:border-green-500'
                      : ['mining', 'logging', 'repairing'].includes(bot.status)
                        ? 'border border-gray-300 flex-1 hover:border-red-500'
                        : 'border border-gray-300 flex-1'
                  }
                  style={
                    bot.status === 'idle'
                      ? { pointerEvents: 'auto' }
                      : {}
                  }
                >
                  {bot.status === 'idle' ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {bot.status === 'idle' ? 'Tiếp tục bot' : 'Tạm dừng bot'}
              </TooltipContent>
            </Tooltip>

            {/* Reconnect button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onAction(bot.id, 'restart')}
                  disabled={['disconnected', 'error'].includes(bot.status)}
                  className={
                    ['mining', 'logging', 'repairing', 'idle'].includes(bot.status)
                      ? 'border border-gray-300 flex-1 hover:border-blue-500'
                      : 'border border-gray-300 flex-1'
                  }
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Kết nối lại bot</TooltipContent>
            </Tooltip>

            {/* Log button luôn hiện */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onViewHistory}
                  className="border border-gray-300 hover:bg-purple-500/10 hover:border-purple-500 transition-all duration-200 hover:glow-purple flex-1"
                >
                  <History className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Xem lịch sử hoạt động</TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
