import doctorService from '../services/doctorService'

let handleGetTopDoctorsHomepage = async (req, res) => {
    let limit = req.body.limit;
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

module.exports = {
    handleGetTopDoctorsHomepage,
    handleGetAllDoctors,
    handleCreateDoctorInfo,
    handleGetDoctorInfo,
    handleEditDoctorInfo,
    handleGetMarkdown,
    handleBulkCreateSchedule
}