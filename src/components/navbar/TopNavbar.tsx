import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Menu,
  Search,
  Settings,
  HelpCircle,
  User,
  LogOut,
  Moon,
  Share2,
  Download,
  Upload,
} from 'lucide-react';

interface TopNavbarProps {
  currentNoteTitle?: string;
  onSidebarToggle: () => void;
  onSearch: () => void;
  onShare: () => void;
  onExport: () => void;
  onImport: () => void;
  rightContent?: React.ReactNode;
}

export const TopNavbar = ({
  currentNoteTitle,
  onSidebarToggle,
  onSearch,
  onShare,
  onExport,
  onImport,
  rightContent,
}: TopNavbarProps) => {
  return (
    <div className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="h-full flex items-center justify-between px-4">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onSidebarToggle}>
            <Menu className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            <div className="text-lg font-semibold text-primary">CoWrite</div>
            {currentNoteTitle && (
              <>
                <span className="text-muted-foreground">/</span>
                <span className="text-sm text-muted-foreground max-w-[200px] truncate">
                  {currentNoteTitle}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Center Section */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Custom right content */}
          {rightContent}

          {/* Action Buttons */}
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onShare}>
            <Share2 className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onExport()}>
                <Download className="h-4 w-4 mr-2" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport()}>
                <Download className="h-4 w-4 mr-2" />
                Export as Markdown
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onImport()}>
                <Upload className="h-4 w-4 mr-2" />
                Import files
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <User className="h-4 w-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Moon className="h-4 w-4 mr-2" />
                Dark Mode
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <HelpCircle className="h-4 w-4 mr-2" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
