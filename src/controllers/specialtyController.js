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

module.exports = {
    handleCreateSpecialty
}