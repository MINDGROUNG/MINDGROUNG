const express = require('express');
const router = express.Router();
const requestIp = require('request-ip');
const moment = require('moment');
const request = require('request');
const commonUtil = require('../util/commonUtil.js');
const DataCacheManager = require('../manager/dataCacheManager');
const dataCacheManager = DataCacheManager.getInstance();
const cookieParser = require('cookie-parser');
const BaseConstant = require('../util/baseConstant');
const pagePrefix = 'cms/view/';

router.all('/', async function (req, res, next) {
    res.render('admin/login.html', {req: req} );
});

router.all('/sampleForm', async function (req, res, next) {
    res.render(pagePrefix + 'sampleForm.html', {req: req} );
});

router.all('/sampleDataTable', async function (req, res, next) {
    res.render(pagePrefix + 'sampleDataTable.html', {req: req} );
});

router.all('/login', async function (req, res, next) {
    res.render(pagePrefix + 'login.html', {req: req} );
});

router.all('/dashBoard', async function (req, res, next) {
    res.render(pagePrefix + 'dashBoard.html', {req: req} );
});

router.all('/mainBanner', async function (req, res, next) {
    res.render(pagePrefix + 'mainBanner.html', {req: req} );
});
router.all('/mainBanner_registerBanner', async function (req, res, next) {
    res.render(pagePrefix + 'mainBanner_registerBanner.html', {req: req} );
});
router.all('/mainText', async function (req, res, next) {
    res.render(pagePrefix + 'mainText.html', {req: req} );
});
router.all('/worldMap', async function (req, res, next) {
    res.render(pagePrefix + 'worldMap.html', {req: req} );
});
router.all('/adApp', async function (req, res, next) {
    res.render(pagePrefix + 'adApp.html', {req: req} );
});
router.all('/supportCategory', async function (req, res, next) {
    res.render(pagePrefix + 'supportCategory.html', {req: req} );
});
router.all('/supportCategory_registerCategory', async function (req, res, next) {
    res.render(pagePrefix + 'supportCategory_registerCategory.html', {req: req} );
});
router.all('/supportContents', async function (req, res, next) {
    res.render(pagePrefix + 'supportContents.html', {req: req} );
});
router.all('/supportContents_registerContents', async function (req, res, next) {
    res.render(pagePrefix + 'supportContents_registerContents.html', {req: req} );
});
router.all('/registerPopup', async function (req, res, next) {
    res.render(pagePrefix + 'registerPopup.html', {req: req} );
});
router.all('/contentsClass', async function (req, res, next) {
    res.render(pagePrefix + 'contentsClass.html', {req: req} );
});
router.all('/contentsClassDetail', async function (req, res, next) {
    res.render(pagePrefix + 'contentsClassDetail.html', {req: req} );
});
router.all('/contentsGathering', async function (req, res, next) {
    res.render(pagePrefix + 'contentsGathering.html', {req: req} );
});
router.all('/contentsGatheringDetail', async function (req, res, next) {
    res.render(pagePrefix + 'contentsGatheringDetail.html', {req: req} );
});
router.all('/contentsEvent', async function (req, res, next) {
    res.render(pagePrefix + 'contentsEvent.html', {req: req} );
});
router.all('/contentsEventDetail', async function (req, res, next) {
    res.render(pagePrefix + 'contentsEventDetail.html', {req: req} );
});
router.all('/contentsJournal', async function (req, res, next) {
    res.render(pagePrefix + 'contentsJournal.html', {req: req} );
});
router.all('/contentsReportJournal', async function (req, res, next) {
    res.render(pagePrefix + 'contentsReportJournal.html', {req: req} );
});
router.all('/members', async function (req, res, next) {
    res.render(pagePrefix + 'members.html', {req: req} );
});
router.all('/membersDetail', async function (req, res, next) {
    res.render(pagePrefix + 'membersDetail.html', {req: req} );
});
router.all('/saleClass', async function (req, res, next) {
    res.render(pagePrefix + 'saleClass.html', {req: req} );
});
router.all('/saleClassDetail', async function (req, res, next) {
    res.render(pagePrefix + 'saleClassDetail.html', {req: req} );
});
router.all('/saleHost', async function (req, res, next) {
    res.render(pagePrefix + 'saleHost.html', {req: req} );
});
router.all('/saleHostDetail', async function (req, res, next) {
    res.render(pagePrefix + 'saleHostDetail.html', {req: req} );
});
router.all('/calculateDomestic', async function (req, res, next) {
    res.render(pagePrefix + 'calculateDomestic.html', {req: req} );
});
router.all('/calculateDomestic_individual', async function (req, res, next) {
    res.render(pagePrefix + 'calculateDomestic_individual.html', {req: req} );
});
router.all('/calculateDomestic_corporate', async function (req, res, next) {
    res.render(pagePrefix + 'calculateDomestic_corporate.html', {req: req} );
});
router.all('/calculateOverseas', async function (req, res, next) {
    res.render(pagePrefix + 'calculateOverseas.html', {req: req} );
});
router.all('/calculateOverseas_detail', async function (req, res, next) {
    res.render(pagePrefix + 'calculateOverseas_detail.html', {req: req} );
});
router.all('/exchangeRate', async function (req, res, next) {
    res.render(pagePrefix + 'exchangeRate.html', {req: req} );
});
router.all('/refund', async function (req, res, next) {
    res.render(pagePrefix + 'refund.html', {req: req} );
});
router.all('/refundDetail', async function (req, res, next) {
    res.render(pagePrefix + 'refundDetail.html', {req: req} );
});
router.all('/csInquiry', async function (req, res, next) {
    res.render(pagePrefix + 'csInquiry.html', {req: req} );
});
router.all('/csInquiryDetail', async function (req, res, next) {
    res.render(pagePrefix + 'csInquiryDetail.html', {req: req} );
});
router.all('/notice', async function (req, res, next) {
    res.render(pagePrefix + 'notice.html', {req: req} );
});
router.all('/noticeDetail', async function (req, res, next) {
    res.render(pagePrefix + 'noticeDetail.html', {req: req} );
});
router.all('/systemAlarm', async function (req, res, next) {
    res.render(pagePrefix + 'systemAlarm.html', {req: req} );
});
router.all('/systemAlarmDetail', async function (req, res, next) {
    res.render(pagePrefix + 'systemAlarmDetail.html', {req: req} );
});
router.all('/recruitmentInfo', async function (req, res, next) {
    res.render(pagePrefix + 'recruitmentInfo.html', {req: req} );
});
router.all('/recruitmentInfoDetail', async function (req, res, next) {
    res.render(pagePrefix + 'recruitmentInfoDetail.html', {req: req} );
});
router.all('/resume', async function (req, res, next) {
    res.render(pagePrefix + 'resume.html', {req: req} );
});
router.all('/resumeDetail', async function (req, res, next) {
    res.render(pagePrefix + 'resumeDetail.html', {req: req} );
});
router.all('/managerSetting', async function (req, res, next) {
    res.render(pagePrefix + 'managerSetting.html', {req: req} );
});
router.all('/managerSettingDetail', async function (req, res, next) {
    res.render(pagePrefix + 'managerSettingDetail.html', {req: req} );
});
router.all('/accessRight', async function (req, res, next) {
    res.render(pagePrefix + 'accessRight.html', {req: req} );
});
router.all('/accessRightDetail', async function (req, res, next) {
    res.render(pagePrefix + 'accessRightDetail.html', {req: req} );
});

router.all('/login', async function (req, res, next) {
    res.render('admin/login.html');
});

router.all('/logout', async function (req, res, next) {
    req.session.destroy();
    res.render('admin/login.html');
});

router.all('/notice/list', async function (req, res, next) {
    let listNotice = await dataCacheManager.selectListNotice();
    res.render(pagePrefix + 'noticeList.html', { req: req, listNotice: listNotice[0], moment: moment });
});

router.all('/notice/create', async function (req, res, next) {
    res.render(pagePrefix + 'noticeRegi.html', { req: req, state: 0 });
});

router.all('/notice/update/:num', async function (req, res, next) {
    let noticeUID  = req.params.num;
    let result = await dataCacheManager.selectNoticeByNoticeUID(req.params.num);
    
    let notice = {};
    notice.noticeUID = noticeUID;
	notice.category = result[1][0]['category'];
	notice.state = result[2][0]['state'];
	notice.title = result[3][0]['title'];
	notice.contents = result[4][0]['contents'];
	notice.regDate = result[5][0]['regDate'];
	notice.uptDate = result[6][0]['uptDate'];
	notice.uspRtn = result[7][0]['uspRtn'];

    res.render(pagePrefix + 'noticeRegi.html', { req: req, notice: notice, state: 1 });
});

module.exports = router ;