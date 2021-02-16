import { diskStorage } from 'multer';
import { extname } from 'path';

type Callback = (error: null | Error, val: any) => void;
type File = Express.Multer.File;

export namespace uploads {
  export const options = {
    storage: diskStorage({
      destination: 'tmp/uploads',
    }),
    filename: (req, file, cb) => {
      const ext = extname(file.originalname);
      const d = new Date();
      const ye = new Intl.DateTimeFormat('en', {
        year: 'numeric',
      }).format(d);
      const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
      const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
      cb(
        undefined,
        `${req.body.document}-${da}-${mo}-${ye}${ext}`.toLowerCase()
      );
    },
    fileFilter: (req: Request, file: File, callback: Callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(undefined, false);
      }
      return callback(undefined, true);
    },
    limits: {},
  };
}
