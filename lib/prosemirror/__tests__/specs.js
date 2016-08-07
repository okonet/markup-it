const fs = require('fs');
const path = require('path');

const encode = require('../encode');
const JSONUtils = require('../../json');

const FIXTURES = path.resolve(__dirname, 'specs');

const files = fs.readdirSync(FIXTURES);

describe('encode', function() {
    files.forEach(function(file) {
        if (path.extname(file) !== '.js') return;

        it(file, function () {
            let content = require(path.join(FIXTURES, file));
            let contentState = JSONUtils.decode(content.json);

            encode(contentState).should.deepEqual(content.prosemirror);
        });
    });
});

describe('decode', function() {
    files.forEach(function(file) {
        if (path.extname(file) !== '.md') return;

        it(file, function () {

        });
    });
});
