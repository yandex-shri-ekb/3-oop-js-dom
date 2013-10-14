postMessage('hello');

self.addEventListener('message', function(e, ta) {
  self.postMessage('I got ' + e.data);
  console.log(ta);
}, false);

// jQuery.get('habr.1500.html', function (data, ta) {
//     postMessage('ready');
// });