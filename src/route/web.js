import express from 'express'
import homeController from '../controllers/homeController'
import userController from '../controllers/userController'
import doctorController from '../controllers/doctorController'

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomepage)
    router.get('/crud', homeController.getCRUD)
    router.post('/post-crud', homeController.postCRUD)
    router.get('/get-crud', homeController.displayGetCRUD)
    router.get('/edit-crud/:id', homeController.getEditCRUD)
    router.post('/put-crud', homeController.putCRUD)
    router.post('/delete-crud', homeController.deleteCRUD)

    router.post('/api/login', userController.handleLogin)

    router.get('/api/get-all-users', userController.handleGetAllUsers)
    router.post('/api/create-new-user', userController.handleCreateNewUser)
    router.put('/api/edit-user', userController.handleEditUser)
    router.delete('/api/delete-user', userController.handleDeleteUser)

    router.get('/api/allcode', userController.handleGetAllCode)

    router.get('/api/top-doctor-homepage', doctorController.handleGetTopDoctorsHomepage)

    //mỗi 1 component nên có 1 api riêng -> độc lập dữ liệu giữa các component
    router.get('/api/get-all-doctors', doctorController.handleGetAllDoctors)
    router.post('/api/create-doctor-info', doctorController.handleCreateDoctorInfo)
    router.get('/api/get-doctor-info', doctorController.handleGetDoctorInfo)
    router.get('/api/get-markdown', doctorController.handleGetMarkdown)
    router.put('/api/edit-doctor-info', doctorController.handleEditDoctorInfo)
    router.post('/api/bulk-create-schedule', doctorController.handleBulkCreateSchedule)
    router.get('/api/get-schedule-by-date', doctorController.handleGetScheduleByDate)
    router.get('/api/get-doctor-info-extra', doctorController.handleGetDoctorInfoExtra)
    router.get('/api/get-doctor-info-general', doctorController.handleGetDoctorInfoGeneral)

    return app.use('/', router)
}

module.exports = initWebRoutes;