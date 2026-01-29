const template = `<input v-bind:placeholder="t('input.placeholder')">`;
const attrRegex = /([a-zA-Z0-9_-]+)=(["'])(.*?)\2/g;

console.log('Template:', template);
console.log('---');

let match;
while ((match = attrRegex.exec(template)) !== null) {
    console.log('Found attr:', match[1], '=', match[3]);
}
