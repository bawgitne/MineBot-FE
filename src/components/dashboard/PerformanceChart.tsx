import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Bot } from '@/lib/mockData';
import { useState, useEffect } from 'react';

interface PerformanceChartProps {
  bots: Bot[];
}

export const PerformanceChart = ({ bots }: PerformanceChartProps) => {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Tạo dữ liệu chart từ bots thực tế
    const now = new Date();
    const data = [];
    
    // Tính toán mức max cho thang đo
    const totalBots = bots.length;
    const maxScale = totalBots + 2; // Mức max là total bots + 2
    
    // Tạo 24 điểm dữ liệu cho 24 giờ qua
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      data.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        totalBots: totalBots,
        activeBots: bots.filter(bot => bot.status === 'mining').length,
        errorBots: bots.filter(bot => bot.status === 'error').length,
        idleBots: bots.filter(bot => bot.status === 'idle').length,
        repairingBots: bots.filter(bot => bot.status === 'repairing').length,
        maxScale: maxScale, // Thêm mức max cho thang đo
      });
    }
    
    setChartData(data);
  }, [bots]);

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Bot Performance Over Time</span>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Total: {bots.length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Active: {bots.filter(bot => bot.status === 'mining').length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Error: {bots.filter(bot => bot.status === 'error').length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Idle: {bots.filter(bot => bot.status === 'idle').length}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Scale: 0-{bots.length + 2}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="time" 
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fontSize: 12 }}
                domain={[0, (dataMax: number) => Math.max(dataMax, bots.length + 2)]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value, name) => {
                  const maxScale = bots.length + 2;
                  return [`${value}/${maxScale}`, name];
                }}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="totalBots"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.1}
              />
              <Area
                type="monotone"
                dataKey="activeBots"
                stackId="2"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.2}
              />
              <Area
                type="monotone"
                dataKey="idleBots"
                stackId="3"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.2}
              />
              <Line
                type="monotone"
                dataKey="errorBots"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
