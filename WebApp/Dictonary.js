/**
 * Created by egortrubnikov on 14.10.13.
 */
/**
 * Функция построения слваря
 * @return {Object}
 * @param Arr
 **/
var Dictonary = function (Arr)
{
  console.time("Время составления Словаря");
  var Obj = {}, par;
  Arr.reduce(function (a, b, c)
  {
    1 != c && (Obj.hasOwnProperty(par) ? Obj[par].push(b) : Obj[par] = [b]);
    par = [a, b].join(" ");
    return b
  });
  console.timeEnd("Время составления Словаря");
  return Obj
};