var fs = require('fs');
var path = require('path');
var util = require('util');
var shell = require('shelljs');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors')

var DEPLOY_NGINX_PUBLIC = path.join(__dirname, '..', 'nginxPublic');
var NIGHTLY_VER = '[nightly]';

console.log('DEPLOY_NGINX_PUBLIC:', DEPLOY_NGINX_PUBLIC);

var mockData = require('../mockData');

// Middleware
function setupMiddleware () {
  app.use(bodyParser.json()); // for parsing application/json
  app.use(cors());
}

// Router
function configRouter () {
  var apiRouter = express.Router();
  var webhookRouter = express.Router();
  app.use('/api',apiRouter);
  app.use('/webhook',webhookRouter);
  app.use('/public/'
    , express.static(DEPLOY_NGINX_PUBLIC)
    , function  (req, res) {
      res.send('Please Add Version x.y.z!');
    });
  app.use('/build/', express.static(path.join(__dirname, '..', 'build')));

  // default
  app.get('/', function (req, res) {
    res.send('Welcome to GOT20\'s World!');
  });

  //backend mock api
  // var Endpoint = 'http://serverip:port/api/chart.json';
  apiRouter.route('/chart.json/')
  .get(function(req, res) {
    console.log('chart.json:', req.query);
    var chartId = req.query.chartId;
    var compareParam = req.query.compare ? req.query.compare : 7;
    if (!chartId) {
      return res.sendStatus(400);
    }
    var id2feature = {
      1: mockData.dsq.registerType,
      2: mockData.dsq.registerPlace,
      3: mockData.dsq.gatherType,
      4: mockData.dsq_place.subtitle,
      5: mockData.dsq_place.responseRange,
      6: mockData.dsq_place.topPeople,
      1001:mockData.dsq.gatherPlace,

      1004:mockData.dsq_place.dataSource,

      1002:mockData.dsq_people.policeData,
      1003:mockData.dsq_people.inHzData,
      1006:mockData.dsq_people.noFootHoldData,
      1005:mockData.dsq_people.internetData,

      1007:mockData.super_detail.naturalData,
      1008:mockData.super_detail.taobaoData,
      1009:mockData.super_detail.payData,
      1010:mockData.super_detail.naturalDetailData,
      1011:mockData.super_storage.hitTimeChart,
      1012:mockData.super_storage.list,
      1013:mockData.super_storage.hitCollectBO,
      1014:mockData.super_risk.riskTabData,

      1015:mockData.trend.venueWarningData,
      1016:mockData.trend.meetingInfoData,
      1017:mockData.trend.trendData,
      1018:mockData.trend.trendInfoData,
      1019:mockData.trend.venueData,

      1020:mockData.high_risk.warnListData,
      1021:mockData.high_risk.buyListData,
      1022:mockData.instruct.InstructData,

      1023:mockData.dsq_people.policeDetail,
      1024:mockData.high_risk.firstLevel
    }

    if (id2feature[chartId]) {
      return res.json(id2feature[chartId]);
    } else {
      return res.json({
        error: ('undefind chartId '+ chartId)
      });
    }
  });


  //webhook from gitlab
  webhookRouter.route('/gitlab/sd/data-got/')
  .post(function(req, res) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    res.json({'received': true});

    console.log('==================================================================');
    console.log('=> Receive webhookRouter from ip:', ip);
    console.log(req.body.ref);
    console.log(req.body.checkout_sha);
    console.log(req.body.user_id);
    console.log(req.body.user_name);
    console.log(req.body.user_username);
    console.log('commits length:', req.body.commits.length);

    //Check whether valid tags
    var ref = req.body.ref;

    // handle push tag
    var findTag = /^refs\/tags\/v(\d+.\d+.\d+)$/.exec(ref);
    if (findTag) {
      var tagVersion = findTag[1];
      buildAndDeploy(req.body, tagVersion);
    }

    // handle push temp tag
    findTag = /^refs\/tags\/freeStyle-v(\d+.\d+.\d+)$/.exec(ref);
    if (findTag) {
      var tagVersion = findTag[1];
      deployFreeStyleBuild(req.body, tagVersion);
    }

    // handle commit push: for nightly build
    if ('refs/heads/development' === ref) {
      if (req.body.user_id === 34182
        && req.body.user_username === 'wangren.wr'
        && req.body.commits.length > 0
        && req.body.commits[0].message.substr(0, NIGHTLY_VER.length) === NIGHTLY_VER ) {
        // trigger nightly build
        buildAndDeploy(req.body, NIGHTLY_VER);

      }
    }

    console.log('==================================================================');
  });
}


// feature function
var stepCnt = 1;
function stepLog(successFlag, description) {
  stepCnt++;
  var indicator = successFlag ? 'success' : 'failed';
  var msg = '';
  if (successFlag) {
    msg = util.format('[Step %d] -- Success: %s', stepCnt, indicator, description);
  } else {
    msg = util.format('[Step %d] -- Failed! ', stepCnt);
    if (description) {
      msg = msg + description;
    };
  }

  console.log(msg);
}

function deployFreeStyleBuild (hookbody, targetTag) {
  // body...
  stepCnt = 0;

  var repRootDir = makeRepRootDir();
  if (repRootDir) {
    stepLog(true, 'makeRepRootDir');
  } else {
    stepLog(false, 'makeRepRootDir');
  }

  // clone repo
  var appName = 'data-got';
  var retCode = cloneRep(repRootDir, hookbody.repository.url, hookbody.checkout_sha, appName);
  if (retCode === 0) {
    stepLog(true, 'cloneRep');
  } else {
    stepLog(false, 'cloneRep');
    return;
  }

  // check repo version vs tag version
  var pkg = require('../package.json');
  if (pkg.version !== targetTag && NIGHTLY_VER !== targetTag) {
    var msg = util.format('Version Not MATCH! --- Version in package.json: [%s] VS Version in Tag [%s]', pkg.version, targetTag);
    console.warn(msg);
    return;
  };

  // install bower modules && build
  var forTempPageDir = path.join(repRootDir, appName, "forTempPageUsage");
  var bowerInstallCmd = util.format('cd %s && bower install', forTempPageDir);
  retCode = shell.exec(bowerInstallCmd).code;
  if (retCode === 0) {
    stepLog(true, 'bowerInstallCmd');
  } else {
    stepLog(false, 'bowerInstallCmd');
    return;
  }

  // deploy to nginx
  retCode = deploy2nginxPublic(forTempPageDir, 'free-'+targetTag);
  if (retCode === 0) {
    stepLog(true, 'deploy2nginxPublic');
  } else {
    stepLog(false, 'deploy2nginxPublic');
    return;
  }

  // clean
  retCode = shell.exec('rm -rf ' +repRootDir).code;
  if (retCode === 0) {
    stepLog(true, 'clean');
  } else {
    stepLog(false, 'clean');
    return;
  }
}

function buildAndDeploy (hookbody, targetTag) {
  // body...
  stepCnt = 0;

  var repRootDir = makeRepRootDir();
  if (repRootDir) {
    stepLog(true, 'makeRepRootDir');
  } else {
    stepLog(false, 'makeRepRootDir');
  }

  // clone repo
  var appName = 'data-got';
  var retCode = cloneRep(repRootDir, hookbody.repository.url, hookbody.checkout_sha, appName);
  if (retCode === 0) {
    stepLog(true, 'cloneRep');
  } else {
    stepLog(false, 'cloneRep');
    return;
  }

  // check repo version vs tag version
  var pkg = require('../package.json');
  if (pkg.version !== targetTag && NIGHTLY_VER !== targetTag) {
    var msg = util.format('Version Not MATCH! --- Version in package.json: [%s] VS Version in Tag [%s]', pkg.version, targetTag);
    console.warn(msg);
    return;
  };

  // install node modules && build
  var appRootDir = path.join(repRootDir, appName);
  retCode = buildRep(appRootDir);
  if (retCode === 0) {
    stepLog(true, 'buildRep');
  } else {
    stepLog(false, 'buildRep');
    return;
  }

  // deploy to nginx
  var appBuildDir = path.join(repRootDir, appName, 'build');
  retCode = deploy2nginxPublic(appBuildDir, targetTag);
  if (retCode === 0) {
    stepLog(true, 'deploy2nginxPublic');
  } else {
    stepLog(false, 'deploy2nginxPublic');
    return;
  }

  // clean
  retCode = shell.exec('rm -rf ' +repRootDir).code;
  if (retCode === 0) {
    stepLog(true, 'clean');
  } else {
    stepLog(false, 'clean');
    return;
  }

}

function makeRepRootDir () {
  var ROOT_PATH = path.resolve(__dirname);
  var tempDir = path.join(__dirname, '..', '_temp');

  if (fs.existsSync(tempDir)) {
    var ret = shell.exec('rm -rf ' +tempDir);
    if (ret.code !== 0) {
      console.error('rm -rf failure:');
      return null;
    }
  }
  fs.mkdirSync(tempDir);
  return tempDir;
}

function cloneRep (targetDir, gitUrl, revision, appName) {
  // body...
  var cmdcdTargetDir = 'cd '+targetDir;
  var cmdClone = 'git clone '+ gitUrl+ ' '+appName;
  var cmdcdRepDir = 'cd '+appName;
  var cmdCheckoutRevision = 'git reset --hard '+revision;
  // var cmdInstallModule = 'tnpm install';
  // var cmdBuildModule = 'npm run build';
  var cmd = [cmdcdTargetDir, cmdClone, cmdcdRepDir,
  cmdCheckoutRevision].join(' && ');
  var ret = shell.exec(cmd, {
      silent: false
    });
  return ret.code;
}

function buildRep (projectRootDir) {
  // body...
  var cmdcdTargetDir = 'cd '+ projectRootDir;
  var cmdInstallModule = 'tnpm install';
  var cmdBuildModule = 'npm run build';
  var cmd = [cmdcdTargetDir, cmdInstallModule, cmdBuildModule].join(' && ');
  var ret = shell.exec(cmd, {
      silent: false
    });
  return ret.code;
}

function deploy2nginxPublic (srcDir, targetTag) {
  if (!fs.existsSync(DEPLOY_NGINX_PUBLIC)) {
    fs.mkdirSync(DEPLOY_NGINX_PUBLIC);
  }

  var deployPath = path.join(DEPLOY_NGINX_PUBLIC, targetTag);
  if (fs.existsSync(deployPath)) {
    var ret = shell.exec('rm -rf ' +deployPath);
    if (ret.code !== 0) {
      console.error('rm -rf failure:');
      return ret.code;
    }
  }

  // move
  var mvRet = shell.exec(['mv', srcDir, deployPath].join(' '));
  return mvRet.code;
}

setupMiddleware();
configRouter();

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('app listening at http://%s:%s', host, port);
});
