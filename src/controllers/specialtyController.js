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

module.exports = {
    handleCreateSpecialty,
    handleGetTopSpecialty
}