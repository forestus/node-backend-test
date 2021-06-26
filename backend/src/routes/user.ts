import UserController from '@controllers/UserController';
import { Router } from 'express';

const router = Router();

router.post('/', UserController.store);
// find
router.get('/', UserController.findAllByNameLastName);
router.get('/:nickname', UserController.findByNickname);
// update
router.put('/:id', UserController.update);
router.patch('/:id', UserController.updateNickname);
// delete
router.delete('/:id', UserController.destroy);
export default router;
