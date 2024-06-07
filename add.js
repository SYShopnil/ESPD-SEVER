const fs = require('fs');
const acorn = require('acorn');
const walk = require('acorn-walk');

function appendItemToArrayInFile(filePath, arrayVariableName, newItem) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    let ast;
    try {
      ast = acorn.parse(data, { ecmaVersion: 2020 });
    } catch (parseErr) {
      console.error('Error parsing the JavaScript source:', parseErr);
      return;
    }

    let foundArray = false;

    walk.simple(ast, {
      VariableDeclarator(node) {
        if (node.id.type === 'Identifier' && node.id.name === arrayVariableName) {
          if (node.init && node.init.type === 'ArrayExpression') {
            node.init.elements.push(acorn.parseExpression(newItem));
            foundArray = true;
          }
        }
      },
    });

    if (!foundArray) {
      console.error(`Array variable "${arrayVariableName}" not found in the file.`);
      return;
    }

    const newCode = acorn.generate(ast);
    fs.writeFile(filePath, newCode, 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error writing the file:', writeErr);
        return;
      }
      console.log(`Item appended to array variable "${arrayVariableName}" in the file.`);
    });
  });
}

// Example usage:
const filePath = 'path/to/your/javascript/file.js';
const arrayVariableName = 'myArray';
const newItem = 'newItemValue';

appendItemToArrayInFile(filePath, arrayVariableName, newItem);
