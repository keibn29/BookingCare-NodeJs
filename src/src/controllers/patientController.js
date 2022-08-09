import patientService from '../services/patientService'

let handleBookAppointment = async (req, res) => {
    try {
        let message = await patientService.createBookAppointment(req.body)
        return res.status(200).json(message)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

let handleVerifyBookAppointment = async (req, res) => {
    try {
        let message = await patientService.verifyBookAppointment(req.query.token, req.query.doctorId)
        return res.status(200).json(message)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

module.exports = {
    handleBookAppointment,
    handleVerifyBookAppointment
}