/**
 * Created by egortrubnikov on 13.10.13.
 */

/**
 * Функция построения слваря
 * @param {Array}
 * @return {Object}
 **/
var Dictonary = function (Arr)
{
  var Obj = {}, par;
  Arr.reduce(function (a, b, c)
  {
    1 != c && (Obj.hasOwnProperty(par) ? Obj[par].push(b) : Obj[par] = [b]);
    par = [a, b].join(" ");
    return b
  });
  return Obj
};