import React from 'react';
import { Image, Upload, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface HeaderProps {
  onUploadClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onUploadClick }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/auth');
    } catch (error: any) {
      toast.error('Error logging out');
    }
  };

  return (
    <header className="border-b border-gallery-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image className="w-8 h-8 text-gallery-accent" />
          <span className="text-xl font-semibold">Gallery</span>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={onUploadClick}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload
          </Button>
          <Button 
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;