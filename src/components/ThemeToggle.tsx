
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

interface ThemeToggleProps {
  darkMode: boolean;
  onToggle: () => void;
}

export const ThemeToggle = ({ darkMode, onToggle }: ThemeToggleProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onToggle}
      className="w-10 h-10 p-0"
    >
      {darkMode ? (
        <span className="text-lg">☀️</span>
      ) : (
        <span className="text-lg">🌙</span>
      )}
    </Button>
  );
};
