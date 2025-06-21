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
