import { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { BotGrid } from '@/components/dashboard/BotGrid';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { BlocksPerMinuteChart } from '@/components/dashboard/BlocksPerMinuteChart';
import { CreateBotModal } from '@/components/dashboard/CreateBotModal';
import { ThemeToggle } from '@/components/ThemeToggle';
import SocketListener from '@/components/SocketListener';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { generateMockBots, type Bot } from '@/lib/mockData';
const ipbe = 'http://localhost:3001';

const Index = () => {
  const [bots, setBots] = useState<Bot[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');

  useEffect(() => {
    // Initialize with mock data (fallback khi chưa kết nối server)
    setBots(generateMockBots(12));
    
    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Xử lý cập nhật bots từ socket
  const handleBotsUpdate = (newBots: Bot[]) => {
    setBots(newBots);
    setIsConnected(true);
  };

  // Xử lý cập nhật trạng thái kết nối
  const handleConnectionStatus = (status: string) => {
    setConnectionStatus(status);
  };

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleBotAction = async (botId: string, action: string) => {
    console.log('Gửi API:', botId, action);
    try {
      await fetch(`${ipbe}/api/bots/${botId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      // Không cần cập nhật state tại đây, vì socket sẽ tự động cập nhật lại danh sách bot
    } catch (err) {
      alert('Thao tác thất bại: ' + (err instanceof Error ? err.message : err));
    }
  };

  const handleCreateBot = (botData: { username: string; warp: string; password: string }) => {
    const joinServerDate = new Date();
    const newBot: Bot = {
      id: `bot-${Date.now()}`,
      username: botData.username,
      warpName: botData.warp,
      status: 'idle',
      currentBlock: 'N/A',
      durability: 1561,
      ping: 0,
      chunksLoaded: false,
      blocksMinedToday: 0,
      repairCount: 0,
      uptime: 0,
      history: [{
        timestamp: joinServerDate,
        action: 'Created',
        details: `Bot created with warp ${botData.warp}`,
      }],
      logs: [{
        message: `Bot ${botData.username} đã được tạo thành công`,
        timestamp: joinServerDate,
      }],
      joinServer: joinServerDate,
    };
    
    setBots(prevBots => [...prevBots, newBot]);
    console.log('Created new bot:', newBot);
  };

  const activeBotsCount = bots.filter(bot => bot.status === 'mining').length;
  const errorBotsCount = bots.filter(bot => bot.status === 'error').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-all duration-500">
      <SocketListener onBotsUpdate={handleBotsUpdate} onConnectionStatus={handleConnectionStatus} />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        <DashboardHeader />
        
        {/* Connection Status Debug */}
        <div className="text-center space-y-2">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
            isConnected 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
            {connectionStatus}
          </div>
          
          {/* Debug Info */}
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Server: localhost:3001 | Status: {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-minecraft-diamond hover:bg-minecraft-diamond/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Bot
          </Button>
          
          <ThemeToggle darkMode={darkMode} onToggle={toggleTheme} />
        </div>

        <div className="animate-fade-in">
          <StatsCards 
            totalBots={bots.length}
            activeBots={activeBotsCount}
            errorBots={errorBotsCount}
          />
        </div>

        <div className="space-y-6 animate-fade-in">
          <PerformanceChart bots={bots} />
          <BlocksPerMinuteChart bots={bots} />
        </div>

        <div className="animate-fade-in">
          <BotGrid bots={bots} onBotAction={handleBotAction} />
        </div>

        <footer className="text-center py-8 border-t border-gray-200/20 dark:border-gray-700/30">
          <p className="text-gray-400 dark:text-gray-500">
            Made with ♥ by MinecraftBotManager • Contact me on Discord: yourname#1234
          </p>
        </footer>

        <CreateBotModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateBot={handleCreateBot}
        />
      </div>
    </div>
  );
};

export default Index;
