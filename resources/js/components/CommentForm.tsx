import { IComment } from '@/types/tasks-types';
import React, { Dispatch } from 'react';
import { InputFile } from './InputFile';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface ICommentForm {
    index: number;
    comments: IComment[];
    setComments: Dispatch<React.SetStateAction<IComment[]>>;
    sending: boolean;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>, index: number) => void;
    handleCommentChange: (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => void;
}

const CommentForm = ({ index, comments, setComments, sending, handleSubmit, handleCommentChange }: ICommentForm) => {
    return (
        <form onSubmit={(e) => handleSubmit(e, index)}>
            {comments[index] && comments[index].sub_task_id && (
                <Textarea value={comments[index].comment || ''} onChange={(e) => handleCommentChange(e, index)} placeholder="write your comment" />
            )}
            <div className="mt-5 flex justify-end">
                <div className="flex flex-col gap-2">
                    <InputFile setComments={setComments} index={index} />
                    <Button className="px-10" disabled={sending}>
                        Send
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default CommentForm;
