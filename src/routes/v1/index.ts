import { Router } from 'express'
import RouteAuth from './authRouter'
import RouteUserSeeder from './userSeederRoute'
import RouteUserManagementAdmin from './userManagementdminRouter'
import RouteTestFullSeed from './testFullSeederRoute'







const router = Router()

router.use('/auth', RouteAuth)
router.use('/seeder',RouteUserSeeder)
router.use('/full-seeder',RouteTestFullSeed)
router.use('/userManagementAdmin',RouteUserManagementAdmin)









export default router

