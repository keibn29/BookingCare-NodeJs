import db from '../models/index';
require('dotenv').config();

const LIMIT_TOP_CLINIC_DOCTOR_SPECIALTY = process.env.LIMIT_TOP_CLINIC_DOCTOR_SPECIALTY;

let createSpecialty = (specialtyData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!specialtyData.nameVi || !specialtyData.nameEn
                || !specialtyData.contentMarkdown || !specialtyData.contentHTML
                || !specialtyData.image) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                await db.Specialty.create({
                    nameVi: specialtyData.nameVi,
                    nameEn: specialtyData.nameEn,
                    image: specialtyData.image,
                    descriptionMarkdown: specialtyData.contentMarkdown,
                    descriptionHTML: specialtyData.contentHTML
                })
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getTopSpecialty = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!limitInput) {
                limitInput = LIMIT_TOP_CLINIC_DOCTOR_SPECIALTY;
            }
            let topSpecialty = await db.Specialty.findAll({
                limit: limitInput,
                order: [['createdAt', 'ASC']],
            })
            //decode-base64
            if (topSpecialty && topSpecialty.length > 0) {
                topSpecialty.map((item) => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary');
                    return item;
                })
            }

            resolve({
                errCode: 0,
                topSpecialty
            })

        } catch (e) {
            reject(e)
        }
    })
}

let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let allSpecialty = await db.Specialty.findAll({
                order: [['createdAt', 'ASC']],
            });
            //decode-base64
            if (allSpecialty && allSpecialty.length > 0) {
                allSpecialty.map((item) => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary');
                    return item;
                })
            }

            resolve({
                errCode: 0,
                allSpecialty
            })

        } catch (e) {
            reject(e)
        }
    })
}

let editSpecialty = (specialtyData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!specialtyData.specialtyId || !specialtyData.nameVi
                || !specialtyData.nameEn || !specialtyData.contentHTML
                || !specialtyData.contentMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let data = await db.Specialty.findOne({
                    where: {
                        id: specialtyData.specialtyId
                    }
                })
                if (data) {
                    data.nameVi = specialtyData.nameVi;
                    data.nameEn = specialtyData.nameEn;
                    data.descriptionHTML = specialtyData.contentHTML;
                    data.descriptionMarkdown = specialtyData.contentMarkdown;
                    if (specialtyData.image) {
                        data.image = specialtyData.image
                    }

                    await data.save();
                    resolve({
                        errCode: 0,
                        errMessage: 'OK'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Specialty not found!'
                    })
                }
            }
        } catch {
            reject(e)
        }
    })
}

let getSpecialtyById = (specialtyId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!specialtyId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let specialty = {}
                if (location === 'ALL') {
                    specialty = await db.Specialty.findOne({
                        where: {
                            id: specialtyId
                        },
                        include: [
                            {
                                model: db.Doctor, as: 'specialtyData', attributes: ['doctorId', 'provinceId']
                            },
                        ]
                    })
                } else {
                    specialty = await db.Specialty.findOne({
                        where: {
                            id: specialtyId
                        },
                        attributes: {
                            exclude: ['image']
                        },
                        include: [
                            {
                                model: db.Doctor,
                                as: 'specialtyData',
                                where: {
                                    provinceId: location
                                },
                                attributes: ['doctorId', 'provinceId']
                            },
                        ]
                    })
                }
                if (!specialty) {
                    specialty = {}
                }
                //decode-base64
                if (specialty && specialty.image) {
                    specialty.image = Buffer.from(specialty.image, 'base64').toString('binary');
                }
                resolve({
                    errCode: 0,
                    specialty
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createSpecialty,
    getTopSpecialty,
    getAllSpecialty,
    editSpecialty,
    getSpecialtyById
}