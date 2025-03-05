import { TableCell, TableRow } from './ui/table';

interface INoDataAvailable {
    colSpan: number;
    title: string;
}

const NoDataAvailable = ({ colSpan, title }: INoDataAvailable) => {
    return (
        <TableRow>
            <TableCell colSpan={colSpan} className="w-full text-center font-medium">
                <h1 className="first-letter:uppercase">{title}</h1>
            </TableCell>
        </TableRow>
    );
};

export default NoDataAvailable;
