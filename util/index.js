const _ = require('lodash');
const colors = require('colors');
module.exports = {
  print: (() => {
    /**
     * print the text with color
     * 'reset',  'bold',  'dim',  'italic',  'underline',  'inverse',  'hidden',  'strikethrough',  'black',  'red',  'green',  'yellow',  'blue',  'magenta',  'cyan',  'white',  'gray',  'grey',  'bgBlack',  'bgRed',  'bgGreen',  'bgYellow',  'bgBlue',  'bgMagenta',  'bgCyan',  'bgWhite',  'blackBG',  'redBG',  'greenBG',  'yellowBG',  'blueBG',  'magentaBG',  'cyanBG',  'whiteBG'
     */
    const maps = Object.keys(colors.maps);
    const methods = [...Object.keys(colors.styles), ...maps]
    const output = {};
    methods.forEach(item => {
      if (/bg/gi.test(item) || /(bold|italic)/.test(item)) {
        return output[item] = (str, color = 'gray') => {
          if (_.isNil(str) || (!_.isString(str) && !_.isNumber(str))) return;
          return console.log(colors[item](colors[color](str)));
        }
      }
      output[item] = str => {
        if (_.isNil(str) || (!_.isString(str) && !_.isNumber(str))) return;
        return console.log(colors[item](str));
      }
    });
    output.getColors = () => {
      console.log(colors.red('如果使用bg打印，第二个参数选择颜色，颜色默认:gray\n字体风格：bold、italic可以和颜色一起嵌套使用，只要第二个参数为颜色\n') + colors.green(methods.join(' , ')));
    }
    // console.log(colors)
    return output;
  })()
};