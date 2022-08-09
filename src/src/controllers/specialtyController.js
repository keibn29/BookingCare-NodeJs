import specialtyService from '../services/specialtyService';

let handleCreateSpecialty = async (req, res) => {
    try {
        let message = await specialtyService.createSpecialty(req.body)
        return res.status(200).json(message)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

let handleGetTopSpecialty = async (req, res) => {
    let limit = req.query.limit;
    try {
        let topSpecialty = await specialtyService.getTopSpecialty(+limit) // + : convert from string to integer
        return res.status(200).json(topSpecialty)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

let handleGetAllSpecialty = async (req, res) => {
    try {
        let allSpecialty = await specialtyService.getAllSpecialty();
        return res.status(200).json(allSpecialty)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

let handleEditSpecialty = async (req, res) => {
    try {
        let message = await specialtyService.editSpecialty(req.body);
        return res.status(200).json(message)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

let handleGetSpecialtyById = async (req, res) => {
    try {
        let detail = await specialtyService.getSpecialtyById(req.query.specialtyId, req.query.location);
        return res.status(200).json(detail)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

module.exports = {
    handleCreateSpecialty,
    handleGetTopSpecialty,
    handleGetAllSpecialty,
    handleEditSpecialty,
    handleGetSpecialtyById
}