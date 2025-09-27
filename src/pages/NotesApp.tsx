import { useState, useCallback } from 'react';
import { TopNavbar } from '@/components/navbar/TopNavbar';
import { NoteSidebar } from '@/components/sidebar/NoteSidebar';
import { TipTapEditor } from '@/components/editor/TipTapEditor';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isStarred: boolean;
  parentId?: string;
}

const NotesApp = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Welcome to CoWrite',
      content: '<h1>Welcome to CoWrite</h1><p>Start writing your notes here...</p>',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date(),
      isStarred: true,
    },
    {
      id: '2',
      title: 'Meeting Notes',
      content: '<h2>Project Discussion</h2><p>Key points from today\'s meeting...</p>',
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date(Date.now() - 86400000), // Yesterday
      isStarred: false,
    },
  ]);
  
  const [currentNoteId, setCurrentNoteId] = useState<string | null>('1');

  const currentNote = notes.find(note => note.id === currentNoteId);

  const handleNoteSelect = useCallback((noteId: string) => {
    setCurrentNoteId(noteId);
  }, []);

  const handleNoteCreate = useCallback((parentId?: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      isStarred: false,
      parentId,
    };
    setNotes(prev => [...prev, newNote]);
    setCurrentNoteId(newNote.id);
  }, []);

  const handleNoteDelete = useCallback((noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    if (currentNoteId === noteId) {
      setCurrentNoteId(notes.find(note => note.id !== noteId)?.id || null);
    }
  }, [currentNoteId, notes]);

  const handleNoteRename = useCallback((noteId: string, newTitle: string) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId 
        ? { ...note, title: newTitle, updatedAt: new Date() }
        : note
    ));
  }, []);

  const handleNoteToggleStar = useCallback((noteId: string) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId 
        ? { ...note, isStarred: !note.isStarred, updatedAt: new Date() }
        : note
    ));
  }, []);

  const handleNoteContentChange = useCallback((content: string) => {
    if (!currentNoteId) return;
    
    setNotes(prev => prev.map(note => 
      note.id === currentNoteId 
        ? { ...note, content, updatedAt: new Date() }
        : note
    ));
  }, [currentNoteId]);

  const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen);
  const handleSearch = () => console.log('Search');
  const handleShare = () => console.log('Share');
  const handleExport = () => console.log('Export');
  const handleImport = () => console.log('Import');

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopNavbar
        currentNoteTitle={currentNote?.title}
        onSidebarToggle={handleSidebarToggle}
        onSearch={handleSearch}
        onShare={handleShare}
        onExport={handleExport}
        onImport={handleImport}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <NoteSidebar
            notes={notes}
            currentNoteId={currentNoteId}
            onNoteSelect={handleNoteSelect}
            onNoteCreate={handleNoteCreate}
            onNoteDelete={handleNoteDelete}
            onNoteRename={handleNoteRename}
            onNoteToggleStar={handleNoteToggleStar}
          />
        )}
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {currentNote ? (
            <TipTapEditor
              key={currentNote.id}
              content={currentNote.content}
              onChange={handleNoteContentChange}
              placeholder={`Start writing "${currentNote.title}"...`}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">No note selected</h2>
                <p>Choose a note from the sidebar or create a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesApp;