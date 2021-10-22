'use strict';
var fs = require("fs");
var path = require("path");

hexo.extend.deployer.register('delete-sth', function cosHelper(config) {
    // check configs
    let cfgs = checkConfigs(config);
    cfgs.publicDir = this.public_dir;
    deleteFiles(cfgs, this.public_dir);
});


function deleteFiles(cfgs, dir) {
    let files = fs.readdirSync(dir);
    let count = 0;
    files.forEach(function (file, index) {
        let fPath = path.join(dir, file);
        let info = fs.statSync(fPath);
        if (info.isDirectory()) {
            count += deleteFiles(cfgs, fPath);
        } else {
            let rPath = fPath.replace(cfgs.publicDir, '').replace(/\\/g, '/');
            if (checkRules(cfgs, rPath)) {
                fs.unlink(fPath, (err) => {
                    if (err) throw err;
                });
                console.log("Delete file: ", rPath);
            } else {
                count += 1;
            }
        }
    });
    if (cfgs.deleteEmptyFolder && !count) {
        fs.rmdir(dir, (err) => {
            if (err) throw err;
        });
        console.log("Delete empty folder: ", dir.replace(cfgs.publicDir, '').replace(/\\/g, '/'));
    }
    return count;
}
function checkRules(cfgs, file) {
    for (let rule of cfgs.deleteFiles) {
        if (rule.test(file)) {
            return true;
        }
    }
    return false;
}
function checkConfigs(config) {
    let deleteFiles = config.deleteFiles || []
    deleteFiles = deleteFiles.map((s) => {
        return s.replace(/\\/, '/').replace(/[-\/\\^$+?.()|[\]{}]/g, '\\$&');
    }).map(s => s.replace(/\*/g, '.*?')).map(s => new RegExp(`^${s}$`));
    return {
        deleteFiles: deleteFiles,
        deleteEmptyFolder: Boolean(config.deleteEmptyFolder)
    };
}