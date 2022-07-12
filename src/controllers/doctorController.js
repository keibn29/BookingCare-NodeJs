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

module.exports = {
    handleGetTopDoctorsHomepage
}