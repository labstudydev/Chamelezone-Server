const { ErrorHandler }      = require('../costomModules/customError')
const nodemailer            = require('nodemailer')

var mail = { }

mail.sendGmail = function(param, next) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        prot : 587,
        host :'smtp.gmlail.com',
        secure : false,
        requireTLS : true,
        auth: {
            user: 'hiyong27@gmail.com',
            pass: 'chldydrnjs1!'
        }
    })
    var mailOptions = {
            from: '샵인샵(#inshop)',
            to: param.toEmail,
            subject: '샵인샵(#inshop) - ' + param.toName + ' 회원님의 인증메일입니다.',
            text: param.text
    }
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            throw new ErrorHandler(500, error)
        }
        next()
    })
}

module.exports = mail