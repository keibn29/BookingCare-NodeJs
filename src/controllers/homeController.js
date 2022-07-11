import db from '../models/index';
import CRUDService from '../services/CRUDService';

let getHomepage = async (req, res) => {
    try {
        let data = await db.User.findAll();

        return res.render('homepage.ejs', {
            data: JSON.stringify(data) //x <- y
        });
    } catch (e) {
        console.log(e)
    }
}

let getCRUD = async (req, res) => {
    return res.render('crud.ejs')
}

let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body);

    return res.redirect('/get-crud')
}

let displayGetCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser();

    return res.render('displayCRUD.ejs', { dataUser: data })
}

let getEditCRUD = async (req, res) => {
    let userId = req.params.id;
    if (userId) {
        let userData = await CRUDService.getUserInforById(userId);

        return res.render('editCRUD.ejs', { dataUser: userData })

    } else {
        return res.send('users not found')
    }
}

let putCRUD = async (req, res) => {
    let data = req.body
    await CRUDService.updateUserData(data);

    return res.redirect('/get-crud')
}

let deleteCRUD = async (req, res) => {
    let id = req.body;
    if (id) {
        await CRUDService.deleteUserData(id)

        return res.redirect('/get-crud')
    } else {
        return res.send('Uer not found')
    }

}

module.exports = {
    getHomepage,
    getCRUD,
    postCRUD,
    displayGetCRUD,
    getEditCRUD,
    putCRUD,
    deleteCRUD
}