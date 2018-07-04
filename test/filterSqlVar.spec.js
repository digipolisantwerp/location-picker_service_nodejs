const filterSqlVar = require('../dist/helpers/filterSqlVar').default;

describe('filterSqlVar', () => {
    it('should filter out bad characters', () => {
        let result = filterSqlVar('foo&bar');
        expect(result).toEqual('foobar');
    });

    it('should keep good special characters', () => {
        let source = "abcé'-";
        let result = filterSqlVar(source);
        expect(result).toEqual(source);
    });
});