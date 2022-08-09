import doctorService from '../services/doctorService'

let handleGetTopDoctorsHomepage = async (req, res) => {
    let limit = req.query.limit;
    try {
        let response = await doctorService.GetTopDoctorsHomepage(+limit) // + : convert from string to integer
        return res.status(200).json(response)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let handleGetAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getetAllDoctors();

        return res.status(200).json(doctors)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

let handleCreateDoctorInfo = async (req, res) => {
    try {
        let message = await doctorService.createDoctorInfo(req.body)

        return res.status(200).json(message)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

let handleGetDoctorInfo = async (req, res) => {
    try {
        let info = await doctorService.getDoctorInfo(req.query.id);

        return res.status(200).json(info)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

let handleEditDoctorInfo = async (req, res) => {
    try {
        let message = await doctorService.editDoctorInfo(req.body);

        return res.status(200).json(message)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

let handleGetMarkdown = async (req, res) => {
    try {
        let infoMarkdown = await doctorService.getMarkdown(req.query.id);

        return res.status(200).json(infoMarkdown)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

//bulk-create-schedule
let handleBulkCreateSchedule = async (req, res) => {
    try {
        let message = await doctorService.bulkCreateSchedule(req.body)
        return res.status(200).json(message)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

let handleGetScheduleByDate = async (req, res) => {
    try {
        let schedule = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date)
        return res.status(200).json(schedule)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

let handleGetDoctorInfoExtra = async (req, res) => {
    try {
        let infoExtra = await doctorService.getDoctorInfoExtra(req.query.doctorId)
        return res.status(200).json(infoExtra)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

let handleGetDoctorInfoGeneral = async (req, res) => {
    try {
        let infoGeneral = await doctorService.getDoctorInfoGeneral(req.query.doctorId)
        return res.status(200).json(infoGeneral)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

let handleGetAllPatientByDate = async (req, res) => {
    try {
        let allPatient = await doctorService.getAllPatientByDate(req.query.doctorId, req.query.date)
        return res.status(200).json(allPatient)
    } catch (e) {
        console.log('check eroor: ', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

let handleSendRemedy = async (req, res) => {
    try {
        let message = await doctorService.sendRemedy(req.body)
        return res.status(200).json(message)
    } catch (e) {
        console.log('check eroor: ', e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

module.exports = {
    handleGetTopDoctorsHomepage,
    handleGetAllDoctors,
    handleCreateDoctorInfo,
    handleGetDoctorInfo,
    handleEditDoctorInfo,
    handleGetMarkdown,
    handleBulkCreateSchedule,
    handleGetScheduleByDate,
    handleGetDoctorInfoExtra,
    handleGetDoctorInfoGeneral,
    handleGetAllPatientByDate,
    handleSendRemedy
}