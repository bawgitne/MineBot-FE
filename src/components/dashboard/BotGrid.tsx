import { useState } from 'react';
import { BotCard } from './BotCard';
import { BotHistoryModal } from './BotHistoryModal';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type Bot } from '@/lib/mockData';

interface BotGridProps {
  bots: Bot[];
  onBotAction: (botId: string, action: string) => void;
}

export const BotGrid = ({ bots, onBotAction }: BotGridProps) => {
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [warpFilter, setWarpFilter] = useState('all');

  const filteredBots = bots.filter(bot => {
    const matchesSearch = bot.username?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
    const matchesStatus = statusFilter === 'all' || bot.status === statusFilter;
    const matchesWarp = warpFilter === 'all' || bot.warpName === warpFilter;
    return matchesSearch && matchesStatus && matchesWarp;
  });

  const uniqueWarps = [...new Set(bots.map(bot => bot.warpName))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search bots by username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="mining">Mining</SelectItem>
            <SelectItem value="idle">Idle</SelectItem>
            <SelectItem value="repairing">Repairing</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="disconnected">Disconnected</SelectItem>
          </SelectContent>
        </Select>

        <Select value={warpFilter} onValueChange={setWarpFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by warp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Warps</SelectItem>
            {uniqueWarps.map(warp => (
              <SelectItem key={warp} value={warp}>{warp}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBots.map(bot => (
          <BotCard
            key={bot.id}
            bot={bot}
            onAction={onBotAction}
            onViewHistory={() => setSelectedBot(bot)}
          />
        ))}
      </div>

      {selectedBot && (
        <BotHistoryModal
          bot={selectedBot}
          isOpen={!!selectedBot}
          onClose={() => setSelectedBot(null)}
        />
      )}
    </div>
  );
};
