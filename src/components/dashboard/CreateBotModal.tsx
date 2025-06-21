
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface CreateBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBot: (botData: { username: string; warp: string; password: string }) => void;
}

export const CreateBotModal = ({ isOpen, onClose, onCreateBot }: CreateBotModalProps) => {
  const [username, setUsername] = useState('');
  const [warp, setWarp] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && warp && password) {
      onCreateBot({ username, warp, password });
      setUsername('');
      setWarp('');
      setPassword('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5 text-minecraft-diamond" />
            <span>Create New Bot</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter bot username"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="warp">Warp Location</Label>
            <Input
              id="warp"
              value={warp}
              onChange={(e) => setWarp(e.target.value)}
              placeholder="e.g., mine1, goldmine"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Bot account password"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-minecraft-diamond hover:bg-minecraft-diamond/90"
            >
              Start Bot
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
