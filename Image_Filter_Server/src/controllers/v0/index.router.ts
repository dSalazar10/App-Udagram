import { Router, Request, Response } from 'express';
import { FilterRouter } from './filter/routes/filter.router';
import { UserRouter } from './users/routes/user.router';

const router: Router = Router();

router.use('/filter', FilterRouter);
router.use('/users', UserRouter);

router.get('/', async (req: Request, res: Response) => {
    res.send({index1: `filter`});
});

export const IndexRouter: Router = router;
