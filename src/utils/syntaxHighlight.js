/**
 * 简易语法高亮 — 支持 C/C++、Java、Python
 * 返回 token 数组: [{ text, type }]
 */

// 各语言关键字
const KEYWORDS = {
  c: new Set([
    'auto', 'break', 'case', 'char', 'const', 'continue', 'default', 'do',
    'double', 'else', 'enum', 'extern', 'float', 'for', 'goto', 'if',
    'int', 'long', 'register', 'return', 'short', 'signed', 'sizeof', 'static',
    'struct', 'switch', 'typedef', 'union', 'unsigned', 'void', 'volatile', 'while',
    'include', 'define', 'ifdef', 'ifndef', 'endif', 'pragma',
  ]),
  java: new Set([
    'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char',
    'class', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum',
    'extends', 'final', 'finally', 'float', 'for', 'goto', 'if', 'implements',
    'import', 'instanceof', 'int', 'interface', 'long', 'native', 'new', 'package',
    'private', 'protected', 'public', 'return', 'short', 'static', 'strictfp',
    'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient',
    'try', 'void', 'volatile', 'while',
  ]),
  python: new Set([
    'and', 'as', 'assert', 'break', 'class', 'continue', 'def', 'del', 'elif',
    'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in',
    'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try',
    'while', 'with', 'yield', 'True', 'False', 'None',
  ]),
  pseudocode: new Set([
    'function', 'if', 'else', 'while', 'for', 'return', 'swap',
    'in', 'to', 'and', 'or', 'not', 'each', 'true', 'false',
    'do', 'then', 'end', 'repeat', 'until', 'break', 'continue',
  ]),
};

// 常见类型/内置标识符（高亮为 type 色）
const TYPES = {
  c: new Set(['NULL', 'INT_MAX', 'bool', 'size_t', 'FILE']),
  java: new Set([
    'String', 'System', 'Integer', 'Boolean', 'Double', 'Float', 'Long',
    'Arrays', 'Math', 'Object', 'List', 'Map', 'Set', 'out', 'err',
  ]),
  python: new Set([
    'print', 'len', 'range', 'int', 'str', 'float', 'list', 'dict', 'set',
    'tuple', 'bool', 'enumerate', 'zip', 'map', 'filter', 'sorted', 'max', 'min',
    'abs', 'sum', 'type', 'isinstance', 'super', 'self', '__init__',
  ]),
  pseudocode: new Set([
    'quickSort', 'partition', 'swap', 'arr', 'pivot',
    'dijkstra', 'hanoi', 'dist', 'visited', 'prev', 'newDist',
    'src', 'dst', 'aux', 'start', 'neighbors', 'vertices',
    'G', 'V', 'E', 'w',
  ]),
};

/**
 * 为一行代码生成带类型的 token 数组
 * @param {string} line - 源代码行
 * @param {string} lang - 'c' | 'java' | 'python'
 * @returns {{ text: string, type: string }[]}
 */
export function tokenize(line, lang) {
  if (!line) return [{ text: '', type: 'plain' }];

  const tokens = [];
  let i = 0;

  const kw = KEYWORDS[lang] || new Set();
  const tp = TYPES[lang] || new Set();

  while (i < line.length) {
    // 空白
    if (line[i] === ' ' || line[i] === '\t') {
      let space = '';
      while (i < line.length && (line[i] === ' ' || line[i] === '\t')) {
        space += line[i++];
      }
      tokens.push({ text: space, type: 'plain' });
      continue;
    }

    // C/Java/伪代码: // 单行注释
    if ((lang === 'c' || lang === 'java' || lang === 'pseudocode') && line[i] === '/' && line[i + 1] === '/') {
      tokens.push({ text: line.slice(i), type: 'comment' });
      return tokens;
    }
    // C/Java: /* 块注释
    if ((lang === 'c' || lang === 'java') && line[i] === '/' && line[i + 1] === '*') {
      const end = line.indexOf('*/', i + 2);
      if (end >= 0) {
        tokens.push({ text: line.slice(i, end + 2), type: 'comment' });
        i = end + 2;
        continue;
      }
      tokens.push({ text: line.slice(i), type: 'comment' });
      return tokens;
    }
    // Python: # 注释
    if (lang === 'python' && line[i] === '#') {
      tokens.push({ text: line.slice(i), type: 'comment' });
      return tokens;
    }

    // 字符串 (双引号)
    if (line[i] === '"') {
      let str = '"';
      i++;
      while (i < line.length && line[i] !== '"') {
        if (line[i] === '\\') { str += line[i++]; }
        str += line[i++];
      }
      if (i < line.length) str += line[i++]; // closing "
      tokens.push({ text: str, type: 'string' });
      continue;
    }
    // 字符串 (单引号) — char in C/Java, string in Python
    if (line[i] === "'") {
      let str = "'";
      i++;
      while (i < line.length && line[i] !== "'") {
        if (line[i] === '\\') { str += line[i++]; }
        str += line[i++];
      }
      if (i < line.length) str += line[i++];
      tokens.push({ text: str, type: 'string' });
      continue;
    }

    // C/Java: 数字
    if ((lang === 'c' || lang === 'java') && /\d/.test(line[i])) {
      let num = '';
      while (i < line.length && /[\d.]/.test(line[i])) {
        num += line[i++];
      }
      tokens.push({ text: num, type: 'number' });
      continue;
    }
    // Python: 数字
    if (lang === 'python' && /\d/.test(line[i])) {
      let num = '';
      while (i < line.length && /[\d.eE_]/ .test(line[i])) {
        num += line[i++];
      }
      tokens.push({ text: num, type: 'number' });
      continue;
    }

    // C: # 预处理指令
    if (lang === 'c' && line[i] === '#') {
      let directive = '';
      while (i < line.length && !/[\s]/.test(line[i])) {
        directive += line[i++];
      }
      tokens.push({ text: directive, type: 'preprocessor' });
      continue;
    }

    // 标识符 / 关键字
    if (/[a-zA-Z_]/.test(line[i])) {
      let word = '';
      while (i < line.length && /[a-zA-Z0-9_]/.test(line[i])) {
        word += line[i++];
      }
      if (kw.has(word)) {
        tokens.push({ text: word, type: 'keyword' });
      } else if (tp.has(word)) {
        tokens.push({ text: word, type: 'type' });
      } else {
        tokens.push({ text: word, type: 'ident' });
      }
      continue;
    }

    // 其他字符 (运算符、括号等)
    tokens.push({ text: line[i++], type: 'plain' });
  }

  return tokens;
}
