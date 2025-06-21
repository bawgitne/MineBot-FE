import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Bot } from '@/lib/mockData';
import { useState, useEffect } from 'react';

interface BlocksPerMinuteChartProps {
  bots?: Bot[];
}

export const BlocksPerMinuteChart = ({ bots = [] }: BlocksPerMinuteChartProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [lastTotalBlocks, setLastTotalBlocks] = useState(0);

  useEffect(() => {
    // Tính toán blocks per minute từ dữ liệu thực
    const totalBlocksToday = bots.reduce((sum, bot) => sum + bot.blocksMinedToday, 0);
    const activeBots = bots.filter(bot => bot.status === 'mining').length;
    
    // Chỉ cập nhật chart khi có thay đổi thực sự
    if (totalBlocksToday === lastTotalBlocks && chartData.length > 0) {
      return;
    }
    
    setLastTotalBlocks(totalBlocksToday);
    
    // Tính toán chính xác hơn: giả sử bots hoạt động 8 giờ/ngày thay vì 24 giờ
    const workingHours = 8; // Giả sử bots hoạt động 8 giờ/ngày
    const estimatedBlocksPerMinute = activeBots > 0 ? Math.round(totalBlocksToday / (workingHours * 60)) : 0;
    
    const now = new Date();
    const data = [];
    
    // Tạo 30 điểm dữ liệu cho 30 phút qua
    for (let i = 29; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 1000);
      
      let blocksPerMinute;
      if (estimatedBlocksPerMinute === 0) {
        // Nếu không có dữ liệu, hiển thị 0 ổn định
        blocksPerMinute = 0;
      } else {
        // Tạo biến động rất thấp (±1 block) để chart chính xác
        const variation = (Math.random() - 0.5) * 2; // -1 đến +1
        blocksPerMinute = Math.max(0, estimatedBlocksPerMinute + variation);
      }
      
      data.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        blocksPerMinute: Math.round(blocksPerMinute * 10) / 10, // Làm tròn 1 chữ số thập phân
      });
    }
    
    setChartData(data);
  }, [bots, lastTotalBlocks, chartData.length]);

  const totalBlocksToday = bots.reduce((sum, bot) => sum + bot.blocksMinedToday, 0);
  const activeBots = bots.filter(bot => bot.status === 'mining').length;
  const workingHours = 8; // Giả sử bots hoạt động 8 giờ/ngày
  const averageBlocksPerMinute = activeBots > 0 ? Math.round(totalBlocksToday / (workingHours * 60)) : 0;
  const hasData = totalBlocksToday > 0 || bots.length > 0;

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Average Blocks Per Minute</span>
          <div className="flex items-center space-x-1 text-sm font-normal">
            <div className="w-3 h-3 bg-minecraft-emerald rounded-full"></div>
            <span className="text-muted-foreground">
              {hasData ? (
                `Total Today: ${totalBlocksToday} | Avg: ${averageBlocksPerMinute}/min`
              ) : (
                'No data available'
              )}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="time" 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Blocks/min', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => [`${value} blocks/min`, 'Average Rate']}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="blocksPerMinute"
                  stroke="#66BB6A"
                  strokeWidth={3}
                  dot={{ fill: '#66BB6A', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#66BB6A', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>No mining data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
