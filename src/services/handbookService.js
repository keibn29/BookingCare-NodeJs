import db from '../models/index';
require('dotenv').config();

let createHandbook = (handbookData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!handbookData.titleVi || !handbookData.titleEn
                || !handbookData.titleVi || !handbookData.titleVi
                || !handbookData.contentMarkdown || !handbookData.contentHTML) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                await db.Handbook.create({
                    titleVi: handbookData.titleVi,
                    titleEn: handbookData.titleEn,
                    image: handbookData.image,
                    descriptionMarkdown: handbookData.contentMarkdown,
                    descriptionHTML: handbookData.contentHTML
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

let getAllHandbook = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!limitInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let hanbooks = [];
                if (limitInput === 'ALL') {
                    hanbooks = await db.Handbook.findAll()

                    //decode-base64
                    if (hanbooks && hanbooks.length > 0) {
                        hanbooks.map((item) => {
                            item.image = Buffer.from(item.image, 'base64').toString('binary');
                            return item;
                        })
                    }
                }
                if (limitInput === 'TOP') {
                    hanbooks = await db.Handbook.findAll({
                        limit: 5
                    })

                    //decode-base64
                    if (hanbooks && hanbooks.length > 0) {
                        hanbooks.map((item) => {
                            item.image = Buffer.from(item.image, 'base64').toString('binary');
                            return item;
                        })
                    }
                }

                resolve({
                    errCode: 0,
                    hanbooks
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let editHandbook = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.handbookId || !data.titleVi
                || !data.titleEn || !data.contentMarkdown
                || !data.contentHTML) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters'
                })
            } else {
                let handbook = await db.Handbook.findOne({
                    id: data.handbookId
                })
                if (handbook) {
                    handbook.titleVi = data.titleVi;
                    handbook.titleEn = data.titleEn;
                    handbook.descriptionMarkdown = data.contentMarkdown;
                    handbook.descriptionHTML = data.contentHTML;
                    if (data.image) {
                        handbook.image = data.image
                    }

                    await handbook.save();
                }
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

module.exports = {
    createHandbook,
    getAllHandbook,
    editHandbook
}