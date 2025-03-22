import express from 'express';
import controller from '../controllers/task.controller';

const router = express.Router();

router.get('/', controller.index);

router.get('/detail/:id', controller.detail);

router.patch('/change-status/:id', controller.changeStatus);

router.patch('/change-multi', controller.changeMulti);

router.post('/create', controller.create);

router.patch('/edit/:id', controller.edit);

router.delete('/delete/:id', controller.delete);

export default router; 