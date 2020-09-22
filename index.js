// const spawnSync = require('child_process').spawnSync;
const spawn = require('child_process').spawn;
const through = require('through2');
const pngquant = require('pngquant-bin');

const log = require('fancy-log');
const PluginError = require('plugin-error');

const packageConfig = require('./package.json');
const PLUGIN_NAME = packageConfig.name;

let cache;

// plugin level function (dealing with files)
function gulpPngquant(options, customPngquantPath) {
    options = options || {};

    if (options.cache) {
        cache = require('./cache');
        // 自定义缓存
        if (options.cachePath) {
            cache.setOptions({
                directory: options.cachePath
            });
            delete options.cachePath;
        }
        delete options.cache;
    }

    let opts = [];
    for (let key in options) {
        opts.push('--' + key, options[key]);
    }
    opts.push('-');

    // creating a stream through which each file will pass
    let stream = through.obj(function (file, enc, cb) {

        if (file.isStream()) {
            this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
            return cb();
        }

        if (cache && cache.has(file)) {
            const result = cache.get(file);
            this.push(result);
            cb();
            return;
        }

        if (file.isBuffer()) {
            const pngquantBin = customPngquantPath || pngquant;

            console.log('compressing: ' + file.relative);
            const compressed = file.clone();

            const child = spawn(pngquantBin, opts);
            child.stdin.write(file.contents);
            child.stdin.end();

            const buffers = [];
            child.stdout.on("data", data => {
                buffers.push(data);
            });

            child.on('exit', (code) => {
                compressed.contents = Buffer.concat(buffers);
                if (cache) {
                    cache.set(file, compressed);
                }
                this.push(compressed);
                cb();
            });

            // compressed.contents = spawnSync(customPngquantPath || pngquant, opts, {
            //     input: file.contents
            // }).stdout;
            // if (cache) {
            //     cache.set(file, compressed);
            // }
            // this.push(compressed);
            // cb();

        } else {
            cb();
        }

    }, function (flush) {
        log('Finished : ', PLUGIN_NAME);
        flush();
    });

    // returning the file stream
    return stream;
};

// exporting the plugin main function
module.exports = gulpPngquant;
