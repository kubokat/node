const http = require('http');

function dateTick (date) {
  return new Promise(function (resolve, reject) {
    let date = new Date().toISOString();

    let timerId = setInterval(function () {
      date = new Date().toISOString();
      console.log(date);
    }, 1000);

    setTimeout(function () {
      clearInterval(timerId);
      resolve(date);
    }, 5000);
  });
}

http.createServer(function (req, res) {
  dateTick().then(function (result) { res.end(result.toString()); });
}).listen(8080);
