const { ErrorHandler }      = require('../costomModules/customError')
const nodemailer            = require('nodemailer')

var mail = { }

// 메일발송 함수
mail.sendGmail = function(param, next) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        prot : 587,
        host :'smtp.gmlail.com',
        secure : false,
        requireTLS : true,
        auth: {
            user: 'chldydrnjs94@gmail.com',
            pass: '!dydrnjs94'
        }
    })
    // 메일 옵션
    var mailOptions = {
            from: 'chldydrnjs94@gmail.com',
            to: param.toEmail,                                                      // 수신할 이메일
            subject: '카멜레존 - ' + param.toName + ' 회원님의 인증메일입니다.',       // 메일 제목
            text: param.text                                                        // 메일 내용
    }
    // 메일 발송    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            throw new ErrorHandler(500, error)
        }
        console.log('Email sent info: ' + info.response)
        next()
    })
}

module.exports = mail