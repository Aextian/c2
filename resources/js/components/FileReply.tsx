import { Input } from '@/components/ui/input';
import { useFile } from '@/hooks/useFile';
import { ChangeEvent } from 'react';
import { TReply } from './CommentList';
import { Badge } from './ui/badge';
import { Label } from './ui/label';

interface InputFileProps {
    commentId?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setData: any;
}
export function FileReply({ setData, commentId }: InputFileProps) {
    const { fileName, onImageChange } = useFile();

    // handle file
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length > 0) {
            onImageChange(e);
            setData((prevValues: TReply) => ({
                ...prevValues,
                file_path: files[0],
            }));
        }
    };

    return (
        <div className="flex max-w-xs items-center justify-end gap-1.5">
            <div className="flex gap-2">
                <span className="ml-20 w-36 truncate text-xs text-green-500">{fileName}</span>
                <Label htmlFor={`file-${commentId}`}>
                    <Badge variant="outline">File</Badge>
                </Label>
            </div>
            <Input onChange={handleFileChange} id={`file-${commentId}`} type="file" className="hidden" />
        </div>
    );
}
