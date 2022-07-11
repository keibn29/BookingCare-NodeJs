import userService from '../services/userService'

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter'
        })
    }

    let userData = await userService.handleUserLogin(email, password);

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}

let handleGetAllUsers = async (req, res) => {
    let id = req.query.id; //All, id

    if (!id) {
        return res.status(200).json({
            errCode: 1,
            message: 'Missing required parameters',
            users: []
        })
    }
    let users = await userService.getAllUsers(id);

    return res.status(200).json({
        errCode: 0,
        message: 'ok',
        users
    })
}

let handleCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body)

    return res.status(200).json({
        errCode: message.errCode,
        errMessage: message.errMessage
    })
}

let handleEditUser = async (req, res) => {
    let data = req.body
    let message = await userService.editUser(data);

    return res.status(200).json({
        errCode: message.errCode,
        errMessage: message.errMessage
    })
}

let handleDeleteUser = async (req, res) => {
    let userId = req.body.id;
    if (!userId) {
        return res.status(200).json({
            errCode: 1,
            message: 'Missing required  parameters'
        })
    }
    let message = await userService.deleteUser(userId)

    return res.status(200).json({
        errCode: message.errCode,
        errMessage: message.errMessage
    })
}

let handleGetAllCode = async (req, res) => {
    try {
        let data = await userService.getAllCode(req.query.type);
        return res.status(200).json(data)
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

module.exports = {
    handleLogin,
    handleGetAllUsers,
    handleCreateNewUser,
    handleEditUser,
    handleDeleteUser,
    handleGetAllCode
}