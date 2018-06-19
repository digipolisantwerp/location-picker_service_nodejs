
// see https://stackoverflow.com/a/9862788/20980
const isLetter = (c: string) => c.toLowerCase() !== c.toUpperCase();
const isDigit = (c: string) => /[0-9]/.test(c);
const isWhitespace = (c: string) => /\s/.test(c);
const isSpecial = (c: string) => /[_\-']/.test(c);

/**
 * Filter an input string to keep only characters that are sql-safe
 * @param s String to filter
 */
export default function filterSqlVar(s: string): string {
    return s.split('').filter((c: string) =>
        isLetter(c) || isDigit(c) || isWhitespace(c) || isSpecial(c)).join('');
}
