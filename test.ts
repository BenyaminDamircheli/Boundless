function Capitalize(str: string) {
    return str.replace(/\b\w/g, (l) => l.toUpperCase());
}

console.log(Capitalize("machine learning and neural networks"));

