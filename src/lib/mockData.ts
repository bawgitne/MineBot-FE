export interface Bot {
  id: string;
  username: string;
  warpName: string;
  status: 'mining' | 'idle' | 'repairing' | 'error' | 'disconnected' | 'logging';
  currentBlock: string;
  durability: number | null;
  ping: number | null;
  chunksLoaded: boolean;
  blocksMinedToday: number;
  repairCount: number;
  uptime: number; // in minutes
  history: HistoryEntry[];
  logs: LogEntry[];
  joinServer?: Date;
  noti?: string | null; // Thông báo từ server
}

// Interface cho dữ liệu socket từ server
export interface ServerBot {
  id: string;
  username: string;
  state: string | null;
  durability: number | null;
  blocksMinedToday: number;
  ping: number | null;
  warpName: string;
  joinServer?: string; // ISO Date string
  blockId?: string;
  repair?: number; // Số lần đã repair
  noti?: string | null; // Thông báo từ server
  logs: ServerLogEntry[];
}

export interface HistoryEntry {
  timestamp: Date;
  action: string;
  details: string;
}

// Interface cho log entry từ server
export interface ServerLogEntry {
  msg: string;
  time: string; // ISO string
}

// Interface cho log entry trong app
export interface LogEntry {
  message: string;
  timestamp: Date;
}

const blocks = ['stone', 'iron_ore', 'coal_ore', 'diamond_ore', 'gold_ore', 'emerald_ore', 'redstone_ore'];
const warps = ['mine1', 'mine2', 'deepmine', 'goldmine', 'ironmine', 'coalpit'];
const statuses: Bot['status'][] = ['mining', 'idle', 'repairing', 'error', 'disconnected', 'logging'];

const generateBotHistory = (): HistoryEntry[] => {
  const actions = ['Connected', 'Started mining', 'Repaired pickaxe', 'Changed location', 'Disconnected', 'Error occurred'];
  const history: HistoryEntry[] = [];
  
  for (let i = 0; i < 20; i++) {
    history.push({
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      action: actions[Math.floor(Math.random() * actions.length)],
      details: `Random details for action ${i + 1}`,
    });
  }
  
  return history.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

const generateMockLogs = (): LogEntry[] => {
  const logMessages = [
    'Đã vào server',
    'Đăng nhập thành công',
    'Đã warp tới mine',
    'Đang quá trình Mining&Repairing',
    'Đã đào được 10 blocks',
    'Tool bị hỏng, đang repair',
    'Đã repair xong tool',
    'Chuyển sang mine khác',
    'Gặp lỗi kết nối',
    'Đã kết nối lại thành công',
    'Đang tìm kiếm ore',
    'Đã tìm thấy diamond ore',
    'Tool sắp hết bền',
    'Đang về spawn để repair',
    'Đã warp về spawn',
    'Đang repair tool',
    'Repair xong, quay lại mine',
    'Đã warp tới mine',
    'Tiếp tục mining',
    'Đã đào được 50 blocks hôm nay'
  ];
  
  const logs: LogEntry[] = [];
  const now = new Date();
  
  for (let i = 0; i < Math.floor(Math.random() * 10) + 5; i++) {
    logs.push({
      message: logMessages[Math.floor(Math.random() * logMessages.length)],
      timestamp: new Date(now.getTime() - Math.random() * 60 * 60 * 1000) // Random time trong 1 giờ qua
    });
  }
  
  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const generateMockBots = (count: number): Bot[] => {
  return Array.from({ length: count }, (_, i) => {
    const joinServerDate = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000);
    const uptimeInMinutes = Math.floor((new Date().getTime() - joinServerDate.getTime()) / 60000);

    const bot: Bot = {
      id: `bot-${i + 1}`,
      username: `MinerBot${String(i + 1).padStart(3, '0')}`,
      warpName: warps[Math.floor(Math.random() * warps.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      currentBlock: blocks[Math.floor(Math.random() * blocks.length)],
      durability: Math.random() > 0.1 ? Math.floor(Math.random() * 1561) : null,
      ping: Math.random() > 0.1 ? Math.floor(Math.random() * 200) + 20 : null,
      chunksLoaded: Math.random() > 0.1,
      blocksMinedToday: Math.floor(Math.random() * 1000),
      repairCount: Math.floor(Math.random() * 10),
      uptime: uptimeInMinutes,
      history: generateBotHistory(),
      logs: generateMockLogs(),
      joinServer: joinServerDate,
      noti: Math.random() > 0.8 ? 'Cần repair tool!' : null, // Random notification
    };
    return bot;
  });
};

export const generateChartData = () => {
  const now = new Date();
  const data = [];
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      totalBots: 12 + Math.floor(Math.random() * 3),
      activeBots: 8 + Math.floor(Math.random() * 4),
      errorBots: Math.floor(Math.random() * 3),
    });
  }
  
  return data;
};

// Hàm chuyển đổi dữ liệu từ server sang Bot interface
export const convertServerBotToBot = (serverBot: ServerBot): Bot => {
  // Chuyển đổi state từ server sang status
  const getStatusFromState = (state: string | null): Bot['status'] => {
    if (!state) return 'disconnected';
    
    switch (state.toUpperCase()) {
      case 'MINING':
        return 'mining';
      case 'IDLE':
        return 'idle';
      case 'REPAIRING':
        return 'repairing';
      case 'ERROR':
        return 'error';
      case 'DISCONNECTED':
        return 'disconnected';
      case 'LOGGING':
        return 'logging';
      default:
        return 'disconnected';
    }
  };

  // Chuyển đổi logs từ server
  const convertLogs = (serverLogs: ServerLogEntry[]): LogEntry[] => {
    return serverLogs.map(log => ({
      message: log.msg,
      timestamp: new Date(log.time)
    }));
  };

  const joinServerDate = serverBot.joinServer ? new Date(serverBot.joinServer) : undefined;
  let uptimeInMinutes = 0;
  if (joinServerDate) {
    const diffMs = new Date().getTime() - joinServerDate.getTime();
    uptimeInMinutes = Math.floor(diffMs / 60000);
  }

  return {
    id: serverBot.id,
    username: serverBot.username,
    warpName: serverBot.warpName,
    status: getStatusFromState(serverBot.state),
    currentBlock: serverBot.blockId || 'N/A',
    durability: serverBot.durability,
    ping: serverBot.ping,
    chunksLoaded: serverBot.ping !== null,
    blocksMinedToday: serverBot.blocksMinedToday,
    repairCount: serverBot.repair || 0,
    uptime: uptimeInMinutes,
    history: [{
      timestamp: new Date(),
      action: `State changed to ${serverBot.state}`,
      details: `Bot ${serverBot.username} is now ${serverBot.state?.toLowerCase() || 'disconnected'}`,
    }],
    logs: convertLogs(serverBot.logs || []),
    joinServer: joinServerDate,
    noti: serverBot.noti,
  };
};
