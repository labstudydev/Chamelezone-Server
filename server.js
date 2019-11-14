const http = require('http');   // java에서 lib라고 생각하면 됨
                                // const는 finally 라고 생각하면됨
const fs = require("fs");
                                

const server = http.createServer((request, response)=>{
    console.log(request.url);
    console.log(request.method);

    fs.readFile("./index.html", null, (err, data)=>{
        response.writeHead(200, {
            "Content-Type" : "text/html"
        })
        response.write(data);
        response.end();
    })
});

server.listen(3000);
