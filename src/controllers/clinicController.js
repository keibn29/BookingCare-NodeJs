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

module.exports = {
    handleGetAllClinic
}
