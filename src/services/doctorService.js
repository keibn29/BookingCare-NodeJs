import db from '../models/index';

let GetTopDoctorsHomepage = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!limitInput) {
                limitInput = 10;
            }
            let users = await db.User.findAll({
                limit: limitInput,
                where: {
                    roleId: 'R2'
                },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: true,
                nest: true
            })
            resolve({
                errCode: 0,
                users
            })
        } catch (e) {
            reject(e)
        }
    })
}

let getetAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: {
                    roleId: 'R2'
                },
                attributes: {
                    exclude: ['password', 'image']
                }
            })

            resolve({
                errCode: 0,
                doctors
            })
        } catch (e) {
            reject(e)
        }
    })
}

let createDoctorInfo = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                await db.Markdown.create({
                    contentHTML: inputData.contentHTML,
                    contentMarkdown: inputData.contentMarkdown,
                    description: inputData.description,
                    doctorId: inputData.doctorId
                })
                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    GetTopDoctorsHomepage,
    getetAllDoctors,
    createDoctorInfo
}