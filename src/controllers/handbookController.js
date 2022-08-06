import handbookService from '../services/handbookService';

let handleCreateHandbook = async (req, res) => {
    try {
        let message = await handbookService.createHandbook(req.body)
        return res.status(200).json(message)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

let handleGetAllHandbook = async (req, res) => {
    try {
        let allHandbook = await handbookService.getAllHandbook(req.query.limit)
        return res.status(200).json(allHandbook)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

let handleEditHandbook = async (req, res) => {
    try {
        let message = await handbookService.editHandbook(req.body)
        return res.status(200).json(message)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

let handleGetDetailHandbook = async (req, res) => {
    try {
        let detailHandbook = await handbookService.getDetailHandbook(req.query.handbookId)
        return res.status(200).json(detailHandbook)
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server!'
        })
    }
}

module.exports = {
    handleCreateHandbook,
    handleGetAllHandbook,
    handleEditHandbook,
    handleGetDetailHandbook
}