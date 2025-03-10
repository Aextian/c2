import { Input } from '@/components/ui/input';
import { ChangeEvent } from 'react';
import { TReply } from './CommentList';
import { Badge } from './ui/badge';
import { Label } from './ui/label';

interface InputFileProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setData: any;
    fileRef: React.RefObject<HTMLInputElement | null>;
    fileName: string;
    setFileName: React.Dispatch<React.SetStateAction<string>>;
}
export function FileReply({ fileRef, setData, setFileName, fileName }: InputFileProps) {
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length > 0) {
            setFileName(files ? files[0].name : '');
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
                <Label>
                    <Badge onClick={() => fileRef.current?.click()} variant="outline">
                        File
                    </Badge>
                </Label>
            </div>
            <Input ref={fileRef} onChange={handleFileChange} type="file" className="hidden" />
        </div>
    );
}
