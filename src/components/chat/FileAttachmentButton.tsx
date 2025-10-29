import { Button } from '@/components/ui/button';
import { Paperclip } from 'lucide-react';
import { useRef } from 'react';

interface FileAttachmentButtonProps {
  onFilesChosen: (files: File[]) => void;
  disabled?: boolean;
  count?: number;
  accept?: string;
}

export const FileAttachmentButton = ({
  onFilesChosen,
  disabled,
  count,
  accept = '*/*',
}: FileAttachmentButtonProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    inputRef.current?.click();
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const list = e.target.files;
    if (!list) return;
    const files = Array.from(list);
    onFilesChosen(files);
    e.currentTarget.value = '';
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-9 w-9 relative"
        disabled={disabled}
        title="Attach files"
        onClick={openPicker}
      >
        <Paperclip className="h-4 w-4" />
        {typeof count === 'number' && count > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center">
            {count}
          </span>
        )}
      </Button>
    </>
  );
};

