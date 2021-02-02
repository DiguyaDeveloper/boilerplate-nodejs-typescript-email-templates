import { diskStorage } from 'multer';
import { extname } from 'path';

type Callback = (error: null | Error, val: any) => void;
type File = Express.Multer.File;

export namespace uploads {
    export const options = {
        storage: diskStorage({
            destination: 'tmp/uploads',
        }),
        fileFilter: (req: Request, file: File, cb: Callback) => {
            const isValid = (file.mimetype === 'image/png' ||  file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg')
            && (extname(file.originalname) === '.png' || extname(file.originalname) === '.jpg' || extname(file.originalname) === '.jpeg');
            console.log(`Uploaded file with mime type ${file.mimetype} is ${isValid ? 'valid' : 'invalid'}.`);
            cb(undefined, isValid);
        },
        limits: {
        },
    };
}
