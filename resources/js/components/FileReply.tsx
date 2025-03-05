import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFile } from '@/hooks/useFile';
import { ChangeEvent, Dispatch } from 'react';
import { TReply } from './CommentList';
import { Badge } from './ui/badge';

interface InputFileProps {
    index: number;
    setData: Dispatch<React.SetStateAction<TReply>>;
}
export function FileReply({ setData }: InputFileProps) {
    const { fileName, onImageChange } = useFile();

    // handle file
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length > 0) {
            onImageChange(e); // Call only if you need to process image preview
            setData((prevValues) => ({
                ...prevValues,
                file_path: files[0],
            }));
        }
    };

    return (
        <div className="flex max-w-xs items-center justify-end gap-1.5">
            <div className="flex gap-2">
                <span className="ml-20 w-36 truncate text-xs text-green-500">{fileName}</span>
                <Label htmlFor="file">
                    <Badge variant="outline">File</Badge>
                </Label>
            </div>
            <Input onChange={handleFileChange} id="file" type="file" className="hidden" />
        </div>
    );
}
