test( "Создание объекта Dictionary", function() {
  var dic = new Core.Dictionary(2, 4096);
  ok(typeof(dic) == "object", "Dictionary is object");
});

test( "Тест Dictionary.Hash", function() {
  var dic = new Core.Dictionary(2, 4096);
  var prefixes = [ "A", "BC" ];
  var hash = dic.GetHashCode(prefixes);
  equal(hash, 65 * 11 + 66 * 11 + 67 * 11, "hash equality");
});


test( "Тест Dictionary.Add", function() {
  var dic = new Core.Dictionary(2, 4096);
  var prefixes = [ "A", "B" ];
  var index = dic.Add(prefixes, "C");
  ok(dic.hash[index] instanceof Array, "Objects in hash must have array type");
  equal(dic.hash[index].length, 1, "one object has been added");
  equal(dic.hash[index][0].Suffixes.length, 1, "One suffix");
  equal(dic.hash[index][0].Suffixes[0], "C", "C must be suffix");
});


test( "Коллизия Dictionary.Add", function() {
  var dic = new Core.Dictionary(2, 4096);
  var prefixes = [ "A", "B" ];
  dic.Add(prefixes, "C");
  var index = dic.Add(prefixes, "D");
  ok(dic.hash[index] instanceof Array, "Objects in hash must have array type");
  equal(dic.hash[index].length, 1, "one object has been added");
  equal(dic.hash[index][0].Suffixes.length, 2, "Two suffix");
  equal(dic.hash[index][0].Suffixes[0], "C", "C must be suffix");
  equal(dic.hash[index][0].Suffixes[1], "D", "D must be suffix");
});
