import { Router, Request, Response } from 'express';
import { FilterRouter } from './filter/routes/filter.router';

const router: Router = Router();

router.use('/filter', FilterRouter);

router.get('/', async (req: Request, res: Response) => {
    res.send({index1: `filter`});
});

export const IndexRouter: Router = router;
