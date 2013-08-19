var utils = require('./utils'),
    render = utils.render;

describe('fest:element', function () {

    beforeEach(utils.setupMatchers);

    it('should support nested elements', function () {
        var result = render('templates/expand_text.xml', {}, {expand_text: true});
        expect(
            result.contents
        ).toBe(
            'Привет, Василий!'
        );
    });
});