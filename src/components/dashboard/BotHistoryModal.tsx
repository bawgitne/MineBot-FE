import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type Bot } from '@/lib/mockData';

interface BotHistoryModalProps {
  bot: Bot;
  isOpen: boolean;
  onClose: () => void;
}

export const BotHistoryModal = ({ bot, isOpen, onClose }: BotHistoryModalProps) => {
  const formatUptime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Bot History: {bot.username}
            <Badge variant="outline">{bot.warpName}</Badge>
          </DialogTitle>
          {bot.joinServer && (
            <p className="text-sm text-muted-foreground">
              Joined Server: {formatTime(bot.joinServer)}
            </p>
          )}
        </DialogHeader>

        <div className="space-y-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {bot.blocksMinedToday}
              </div>
              <div className="text-sm text-muted-foreground">Blocks Today</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {bot.repairCount}
              </div>
              <div className="text-sm text-muted-foreground">Repairs</div>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {formatUptime(bot.uptime)}
              </div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {bot.durability !== null ? `${bot.durability}/1561` : 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">
                {bot.durability !== null ? `${Math.round((bot.durability / 1561) * 100)}%` : 'Durability'}
              </div>
            </div>
          </div>

          <Separator />

          {/* Tabs for different history types */}
          <Tabs defaultValue="logs" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="logs">Server Logs</TabsTrigger>
              <TabsTrigger value="activity">Activity History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="logs" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Server Logs ({bot.logs.length})</h3>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {bot.logs.length > 0 ? (
                      bot.logs.map((log, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">{log.message}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatTime(log.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>Chưa có logs từ server</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
            
            <TabsContent value="activity" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Activity History</h3>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {bot.history.map((entry, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{entry.action}</p>
                            <p className="text-xs text-muted-foreground">
                              {entry.timestamp.toLocaleString()}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {entry.details}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
