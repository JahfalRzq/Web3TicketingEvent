import { Router } from 'express'
import RouteAuth from './authRouter'
import RouteUserSeeder from './userSeederRoute'
import RouteUserManagementAdmin from './userManagementdminRouter'
import RouteTestFullSeed from './testFullSeederRoute'
import RouteEventStub from './event.routes'
import RouteTicketStub from './ticket.routes'








const router = Router()

router.use('/auth', RouteAuth)
router.use('/seeder',RouteUserSeeder)
router.use('/full-seeder',RouteTestFullSeed)
router.use('/userManagementAdmin',RouteUserManagementAdmin)
router.use('/eventStub',RouteEventStub)
router.use('/ticketStub',RouteTicketStub)









export default router

