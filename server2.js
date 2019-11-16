/* ==================== START modules ==================== */
const mysql         = require('mysql');
const dbConfig      = require('./config/dbConfig');
const express       = require('express');
const hbs           = require('express-handlebars');
const server        = express();
const bodyParser    = require('body-parser');
const morgan        = require('morgan');
const crypto        = require('crypto');
/* ==================== END modules ==================== */


/* ==================== START DB Connection ==================== */
var dbOptions = {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database
};

var connection = mysql.createConnection(dbOptions);
connection.connect();
/* ==================== END DB Connection ==================== */


/* ==================== START lendering ==================== */
// template Engine == html 변형 engine을 이용
// pug, ejs, handlebars 세가지의 대표적인 엔진이 존재한다.
// 전체적인 페이지 view는 views에서 관리한다.
server.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname+'/views/layouts',
    partialsDir:__dirname+'/views/partials'    
}))
server.set("view engine", "hbs");

server.use(express.static(__dirname + "/public"));
server.use(morgan('combined'));

// 해당 use가 정상적으로 실행되어야 GET으로 넘어갈수 있다
// 확인은 로컬호스트의 로딩이 지속됨으로 확인가능하다.
server.use((request, response, next) => {
    //config
    next();
});
/* ==================== END lendering ==================== */


// crypto 암호화
var salt = '';
var pw = '';
crypto.randomBytes(64, (error, Buffer) => {
    if (error) {
        throw error;
    }
    salt = Buffer.toString('hex');
});
crypto.pbkdf2('password', salt, 100000, 64, 'sha512', (error, derivedKey) => {
    if (error) {
        throw error;
    }
    pw = derivedKey.toString('hex');
})


// querystring(path URL) & semantic(clean URL)
// url path의 차이가 있다.
// request.query.#### & request.params.####

// 현재 날짜 출력 npm node-datatime
// data formatt = ####-##-##
var datetime = require('node-datetime');
var dt = datetime.create();
var formatted = dt.format('Y-m-d');

// POST
// 회원가입
server.use(bodyParser.urlencoded({ extended: false }));
server.post("/user/signUp", (request, response) => {
    
    // let sqlQuery = 'INSERT INTO member (email, password, name, nickName, phoneNumber, regiDate) VALUES (?, ?, ?, ?, ?, ?)'
    // var email = request.body.email;
    // var password = request.body.password;
    // var name = request.body.name;
    // var nickName = request.body.nickName;
    // var phoneNumber = request.body.phoneNumber;
    // var regiDate = request.body.regiDate;
    // [email, password, name, nickName, phoneNumber, regiDate]
    
    // VALUES는 각 변수를 PARAM으로 이용하였다.
    // SET은 각 변수를 객를 PARAM으로 이용하였다.
    
    let sqlQuery = 'INSERT INTO member SET ?';
    var setValues = {
        'email': request.body.email,
        'password': request.body.password,
        'name': request.body.name,
        'nickName': request.body.nickName,
        'phoneNumber': request.body.phoneNumber
    };

    connection.query(sqlQuery, setValues, function(error, results, fields){
        if (error) {
            response.status(500).end("Server Error");
            console.log(error);
        } else {
            response.status(200).end("Success => User Insert Query");
            console.log("member index number => " + results.insertId);
            console.log(results);
        }
    });
});

// GET
// 회원 로그인
server.post("/user", (request, response) => {
    let email = request.body.email;
    let password = request.body.password;
    let sqlQuery = 'select * from member where email = ? && password = ?';

    connection.query(sqlQuery, [email, password], function(error, results, fields) {
        if (error) {
            response.status(500).end("Server Error");
            console.log("##### login error #####");
            console.log(error);
        }

        // 결과 값이 존재하지 않으면
        if (!results[0]) {
            response.status(500).end("Server Error");
            console.log("이건 에러");
            return response.send("please check your id.");
        }
    
        var user = results[0];
        
        crypto.pbkdf2(pw, user.salt, 100000, 64, 'sha512', function(error, derivedKey){
            if (error) {
                console.log(error)
            }
            
            if (derivedKey.toString('hex') === user.password) {
                return response.send("login success");
            }
            else { 
                return response.send("please check your password.");
            }
        });

        console.log(results);
        response.send({error: false, data: results[0], message: 'users list.'});
        response.status(200).end("Success => User login Query");
    });
});

// 특정한 유저의 데이터를 출력
server.get("/user/:memberNumber", (request, response) => {
    let memberNumber = request.params.memberNumber;
    let sqlQuery = 'SELECT * FROM member WHERE memberNumber=?';
    
    connection.query(sqlQuery, memberNumber, function (error, results, fields) {
        if (error) {
            response.status(500).end("Server Error");
            console.log(error);
        } 
        console.log(results);
        response.send({error: false, data: results[0], message: 'users list.'});
        response.status(200).end("Success => User Select Query");
      });
});

// put
// 회원정보 수정
server.put("/user/:memberNumber", (request, response) => {
    let memberNumber = request.params.memberNumber;
    let sqlQuery = 'UPDATE member SET password=?, nickName=?, phoneNumber=? WHERE memberNumber=?';
    
    var password = request.body.password;
    var nickName = request.body.nickName;
    var phoneNumber = request.body.phoneNumber;

    connection.query(sqlQuery, [password, nickName, phoneNumber, memberNumber], function(error, results, fields) {
        if (error) {
            response.status(500).end("Server Error");
            console.log(error);
        } else {
            response.status(200).end("Success => User Update Query");
            console.log("member index number => " + results.insertId);
            console.log(results);
        }
    });
});


// delete 
server.delete("/user/:memberNumber", (request, response) => {
    let memberNumber = request.params.memberNumber;
    let sqlQuery = 'DELETE FROM member WHERE memberNumber=?';

    connection.query(sqlQuery, memberNumber, function(error, result, fields){
        if (error) {
            response.status(500).end('Server Error');
            console.log(error);;
        } else {
            response.status(200).end("Success => User Delete Query");
            console.log("member index number => " + result.insertId);
            console.log(result);
        }
    });
});


// GET
server.get("/", (request, response) => {
    // 수신상태를 보고싶다면
    response.status(200).render('index', {
        name: "AAA",
        home: true,
    });
});

server.get("/features", (request, response)=> {
    response.status(200).render("features", {
        features: true
    })
})

server.get("/contact", (request, response)=>{
    response.status(200).render("contact", {
        contact: true,
        list:["Choi","Yong","Kwon","Enjoy"]
    })
})

server.listen(3000, () => {
    console.log("The server is running on Port 3000");
});