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

let getDoctorInfo = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let doctorInfo = await db.User.findOne({
                    where: {
                        id: doctorId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.Markdown, attributes: ['description', 'contentHTML', 'contentMarkdown'] },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] }
                    ],
                    raw: false,
                    nest: true
                })
                if (!doctorInfo) {
                    doctorInfo = {}
                }
                //decode-base64
                if (doctorInfo && doctorInfo.image) {
                    doctorInfo.image = new Buffer(doctorInfo.image, 'base64').toString('binary');
                }
                resolve({
                    errCode: 0,
                    doctorInfo
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let editDoctorInfo = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters"
                })
            } else {
                let doctorInfo = await db.Markdown.findOne({
                    where: {
                        doctorId: inputData.doctorId
                    }
                })
                if (doctorInfo) {
                    doctorInfo.contentHTML = inputData.contentHTML;
                    doctorInfo.contentMarkdown = inputData.contentMarkdown;
                    doctorInfo.description = inputData.description;

                    await doctorInfo.save();
                    resolve({
                        errCode: 0,
                        errMessage: 'ok'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Doctor not found!'
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getMarkdown = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let infoMarkdown = await db.Markdown.findOne({
                    where: {
                        doctorId: doctorId
                    },
                    raw: true,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    infoMarkdown
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
    createDoctorInfo,
    getDoctorInfo,
    editDoctorInfo,
    getMarkdown
}