import { Router } from 'express';
import Controller from './assessment.controller';

const router: Router = Router();

router.get('', Controller.getAll);
router.get('/:id', Controller.getById);
router.post('', Controller.create);
router.patch('/:id', Controller.update);
router.delete('/:id', Controller.remove);

export default router;