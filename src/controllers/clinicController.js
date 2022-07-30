import clinicService from '../services/clinicService';

let handleGetAllClinic = async (req, res) => {
    try {
        let allClinic = await clinicService.getAllClinic();
        return res.status(200).json(allClinic)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

let handleCreateClinic = async (req, res) => {
    try {
        let message = await clinicService.createClinic(req.body);
        return res.status(200).json(message)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

let handleEditClinic = async (req, res) => {
    try {
        let message = await clinicService.editClinic(req.body);
        return res.status(200).json(message)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

let handleGetTopClinic = async (req, res) => {
    try {
        let topClinic = await clinicService.getTopClinic(+req.query.limit);
        return res.status(200).json(topClinic)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

module.exports = {
    handleGetAllClinic,
    handleCreateClinic,
    handleEditClinic,
    handleGetTopClinic
}
