import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { ServerBot, convertServerBotToBot, type Bot } from '@/lib/mockData';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
// Kết nối tới backend (đúng địa chỉ và port backend)
const socket = io(backendUrl, {
  transports: ['websocket', 'polling'], // Thử cả websocket và polling
  timeout: 20000, // Timeout 20 giây
  forceNew: true, // Tạo connection mới
});

interface SocketListenerProps {
  onBotsUpdate: (bots: Bot[]) => void;
  onConnectionStatus?: (status: string) => void;
}

const SocketListener: React.FC<SocketListenerProps> = ({ onBotsUpdate, onConnectionStatus }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Đang kết nối...');

  useEffect(() => {
    // Lắng nghe kết nối thành công
    socket.on('connect', () => {
      const status = 'Đã kết nối';
      setConnectionStatus(status);
      setIsConnected(true);
      onConnectionStatus?.(status);
    });

    // Lắng nghe event 'hello' từ server
    socket.on('hello', (data) => {
      setIsConnected(true);
      const status = 'Kết nối thành công!';
      setConnectionStatus(status);
      onConnectionStatus?.(status);
    });

    // Lắng nghe ngắt kết nối
    socket.on('disconnect', (reason) => {
      const status = 'Server đã tắt';
      setConnectionStatus(status);
      setIsConnected(false);
      onConnectionStatus?.(status);
    });

    // Lắng nghe lỗi kết nối
    socket.on('connect_error', (error) => {
      const status = 'Server đã tắt';
      setConnectionStatus(status);
      setIsConnected(false);
      onConnectionStatus?.(status);
    });

    // Lắng nghe event 'allbot' từ server
    socket.on('allbot', (botsArray: ServerBot[]) => {
      if (!Array.isArray(botsArray)) {
        console.error('[SocketListener] Error: Data received is not an array!', botsArray);
        return;
      }

      // Chuyển đổi dữ liệu từ server sang Bot interface
      const convertedBots = botsArray.map((serverBot, index) => {
        try {
          const converted = convertServerBotToBot(serverBot);
          return converted;
        } catch (e) {
          console.error(`[SocketListener] Error converting bot #${index + 1}:`, e, 'Original data:', serverBot);
          return null;
        }
      }).filter(bot => bot !== null) as Bot[];
      
      // Gửi dữ liệu đã chuyển đổi lên component cha
      onBotsUpdate(convertedBots);
    });

    // Cleanup khi component unmount
    return () => {
      socket.off('connect');
      socket.off('hello');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('allbot');
    };
  }, [onBotsUpdate, onConnectionStatus]);

  return null; // Component này không render gì, chỉ lắng nghe socket
};

export default SocketListener;
