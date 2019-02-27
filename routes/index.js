var express = require('express');
var router = express.Router();
const cheerio = require('cheerio');
const rp = require('request-promise');

const sites = ['https://www.marutitech.com/', 'https://www.marutitechs.com/', 'https://www.facebook.com/']
/* GET home page. */
router.get('/', function(req, res, next) {
  const promises = [];
  sites.forEach(site =>{
    promises.push(checkStatus(site));
  });

  Promise.all(promises).then(function(values) {
    console.log(values);
    res.render('index', { siteData: values, title: "Hello World" });
  }).catch(error =>{
    console.log('Line ---- 21',error);
  });

});

const checkStatus = (site) => {
  console.log('Line ---- 39',site);
  return new Promise(function(resolve, reject){
    rp.get(site)
    .then(webContent => {
      const home  = cheerio.load(webContent);
      const message = getElements(home);
      resolve({site, "status": message});
    }).catch(error =>{
      resolve({site, "status": false});
  })
  })
};

const getElements = ($) => {
  const foundIndex = $.html().indexOf("<script src=\"https://app.wotnot.io/");
  if(foundIndex > -1){
    return true;
  }
  else{
    return false;
  }
};

module.exports = router;
