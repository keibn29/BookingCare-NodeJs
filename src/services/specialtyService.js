import db from '../models/index';

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
                limitInput = 10;
            }
            let topSpecialty = await db.Specialty.findAll({
                limit: limitInput,
            })
            //decode-base64
            if (topSpecialty && topSpecialty.length > 0) {
                topSpecialty.map((item) => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
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

module.exports = {
    createSpecialty,
    getTopSpecialty
}