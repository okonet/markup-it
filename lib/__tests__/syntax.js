const MarkupIt = require('../');

describe('Custom Syntax', function() {
    let syntax = new MarkupIt.Syntax('mysyntax', {
        inline: [
            MarkupIt.Rule(MarkupIt.STYLES.BOLD)
                .regExp(/^\*\*([\s\S]+?)\*\*/, function(state, match) {
                    return {
                        text: match[1]
                    };
                })
                .toText('**%s**')
        ]
    });
    let markup = new MarkupIt(syntax);

    describe('.toContent', function() {
        it('should return correct syntax name', function() {
            let content = markup.toContent('Hello');
            content.getSyntax().should.equal('mysyntax');
        });

        it('should parse as unstyled', function() {
            let content = markup.toContent('Hello World');

            let doc = content.getToken();
            let blocks = doc.getTokens();

            blocks.size.should.equal(1);
            let p = blocks.get(0);

            p.getType().should.equal(MarkupIt.BLOCKS.TEXT);
            p.getAsPlainText().should.equal('Hello World');
        });

        it('should parse inline', function() {
            let content = markup.toContent('Hello **World**');
            let doc = content.getToken();
            let blocks = doc.getTokens();

            blocks.size.should.equal(1);
            let p = blocks.get(0);

            p.getType().should.equal(MarkupIt.BLOCKS.TEXT);
            p.getAsPlainText().should.equal('Hello World');
        });
    });

    describe('.toText', function() {
        it('should output correct string', function() {
            let content = MarkupIt.JSONUtils.decode({
                syntax: 'mysyntax',
                token: {
                    type: MarkupIt.BLOCKS.DOCUMENT,
                    tokens: [
                        {
                            type: MarkupIt.BLOCKS.PARAGRAPH,
                            tokens: [
                                {
                                    type: MarkupIt.STYLES.TEXT,
                                    text: 'Hello '
                                },
                                {
                                    type: MarkupIt.STYLES.BOLD,
                                    text: 'World'
                                }
                            ]
                        }
                    ]
                }
            });
            let text = markup.toText(content);
            text.should.equal('Hello **World**\n');
        });
    });
});
