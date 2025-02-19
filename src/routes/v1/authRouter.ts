import { Router } from 'express'
import { fetch, login } from '../../controller/Auth/authController'
import { checkJwt } from '../../utils/checkJwt'

const router = Router()

router.get('/fetch', [checkJwt ,fetch])
router.post('/login', login)

export default router
