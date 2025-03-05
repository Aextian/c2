import { ChangeEvent, useState } from 'react';

export const useFile = () => {
    const [image, setImage] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;

        setFileName(files ? files[0].name : null);

        if (files && files.length > 0) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    setImage(reader.result as string);
                }
            };
            reader.readAsDataURL(files[0]);
        } else {
            setImage(null);
        }
    };

    const handleImageNull = () => {
        setImage(null);
        setFileName(null); // Also reset fileName when clearing image
    };

    return { image, fileName, onImageChange, handleImageNull };
};
