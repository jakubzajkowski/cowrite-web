import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  FileText,
  FolderPlus,
  Plus,
  Search,
  MoreHorizontal,
  Trash2,
  Edit,
  Star,
  Clock,
  Folder,
} from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isStarred: boolean;
  parentId?: string;
}

interface NoteSidebarProps {
  notes: Note[];
  currentNoteId: string | null;
  onNoteSelect: (noteId: string) => void;
  onNoteCreate: (parentId?: string) => void;
  onNoteDelete: (noteId: string) => void;
  onNoteRename: (noteId: string, newTitle: string) => void;
  onNoteToggleStar: (noteId: string) => void;
}

export const NoteSidebar = ({
  notes,
  currentNoteId,
  onNoteSelect,
  onNoteCreate,
  onNoteDelete,
  onNoteRename,
  onNoteToggleStar,
}: NoteSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const NoteItem = ({ note }: { note: Note }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(note.title);

    const handleRename = () => {
      if (editTitle.trim() && editTitle !== note.title) {
        onNoteRename(note.id, editTitle.trim());
      }
      setIsEditing(false);
    };

    return (
      <div
        className={`group flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-accent/50 transition-colors ${
          currentNoteId === note.id ? 'bg-accent' : ''
        }`}
        onClick={() => !isEditing && onNoteSelect(note.id)}
      >
        <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
        
        {isEditing ? (
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename();
              if (e.key === 'Escape') {
                setEditTitle(note.title);
                setIsEditing(false);
              }
            }}
            className="h-6 text-sm flex-1"
            autoFocus
          />
        ) : (
          <span className="text-sm flex-1 truncate">{note.title}</span>
        )}

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {note.isStarred && (
            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNoteToggleStar(note.id)}>
                <Star className="h-4 w-4 mr-2" />
                {note.isStarred ? 'Unstar' : 'Star'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => onNoteDelete(note.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  };

  return (
    <div className="w-80 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Notes</h2>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onNoteCreate()}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => {}} // TODO: Create folder
            >
              <FolderPlus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-auto p-2">
        {/* Quick Access */}
        <div className="mb-4">
          <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground">
            <Clock className="h-3 w-3" />
            RECENT
          </div>
          {filteredNotes
            .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
            .slice(0, 3)
            .map(note => (
              <NoteItem key={`recent-${note.id}`} note={note} />
            ))}
        </div>

        <Separator className="my-2" />

        {/* Starred */}
        {filteredNotes.some(note => note.isStarred) && (
          <div className="mb-4">
            <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground">
              <Star className="h-3 w-3" />
              STARRED
            </div>
            {filteredNotes
              .filter(note => note.isStarred)
              .map(note => (
                <NoteItem key={`starred-${note.id}`} note={note} />
              ))}
          </div>
        )}

        <Separator className="my-2" />

        {/* All Notes */}
        <div>
          <div className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-muted-foreground">
            <Folder className="h-3 w-3" />
            ALL NOTES
          </div>
          {filteredNotes.map(note => (
            <NoteItem key={note.id} note={note} />
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notes found</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => onNoteCreate()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create your first note
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};