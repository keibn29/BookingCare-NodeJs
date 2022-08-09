import db from '../models/index';
require('dotenv').config();

const LIMIT_TOP_CLINIC_DOCTOR_SPECIALTY = process.env.LIMIT_TOP_CLINIC_DOCTOR_SPECIALTY;

let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let allClinic = await db.Clinic.findAll({
                order: [['createdAt', 'ASC']],
            });

            //decode-base64
            if (allClinic && allClinic.length > 0) {
                allClinic.map((item) => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary');
                    return item;
                })
            }

            resolve({
                errCode: 0,
                allClinic
            })

        } catch (e) {
            reject(e)
        }
    })
}

let createClinic = (clinicData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!clinicData.nameVi || !clinicData.nameEn || !clinicData.address
                || !clinicData.contentMarkdown || !clinicData.contentHTML) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                await db.Clinic.create({
                    nameVi: clinicData.nameVi,
                    nameEn: clinicData.nameEn,
                    address: clinicData.address,
                    descriptionMarkdown: clinicData.contentMarkdown,
                    descriptionHTML: clinicData.contentHTML,
                    image: clinicData.image
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

let editClinic = (clinicData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!clinicData.clinicId || !clinicData.nameVi
                || !clinicData.nameEn || !clinicData.address
                || !clinicData.contentHTML || !clinicData.contentMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let data = await db.Clinic.findOne({
                    where: {
                        id: clinicData.clinicId
                    }
                })
                if (data) {
                    data.nameVi = clinicData.nameVi;
                    data.nameEn = clinicData.nameEn;
                    data.address = clinicData.address;
                    data.descriptionHTML = clinicData.contentHTML;
                    data.descriptionMarkdown = clinicData.contentMarkdown;
                    if (clinicData.image) {
                        data.image = clinicData.image
                    }

                    await data.save();
                    resolve({
                        errCode: 0,
                        errMessage: 'OK'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Clinic not found!'
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getTopClinic = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!limitInput) {
                limitInput = LIMIT_TOP_CLINIC_DOCTOR_SPECIALTY;
            }

            let topClinic = await db.Clinic.findAll({
                limit: limitInput,
                order: [['createdAt', 'ASC']],
            })

            //decode-base64
            if (topClinic && topClinic.length > 0) {
                topClinic.map((item) => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary');
                    return item;
                })
            }

            resolve({
                errCode: 0,
                topClinic
            })
        } catch (e) {
            reject(e)
        }
    })
}

let getClinicById = (clinicId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!clinicId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let clinic = {}
                if (location === 'ALL') {
                    clinic = await db.Clinic.findOne({
                        where: {
                            id: clinicId
                        },
                        include: [
                            {
                                model: db.Doctor, as: 'clinicData', attributes: ['doctorId', 'provinceId']
                            },
                        ]
                    })
                } else {
                    clinic = await db.Clinic.findOne({
                        where: {
                            id: clinicId
                        },
                        include: [
                            {
                                model: db.Doctor,
                                as: 'clinicData',
                                where: {
                                    provinceId: location
                                },
                                attributes: ['doctorId', 'provinceId']
                            },
                        ]
                    })
                }
                if (!clinic) {
                    clinic = {}
                }
                //decode-base64
                if (clinic && clinic.image) {
                    clinic.image = Buffer.from(clinic.image, 'base64').toString('binary');
                }
                resolve({
                    errCode: 0,
                    clinic
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    getAllClinic,
    createClinic,
    editClinic,
    getTopClinic,
    getClinicById
}
