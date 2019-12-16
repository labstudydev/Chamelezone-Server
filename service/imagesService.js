/* ==================== START modules ==================== */

const Images = require('../dao/imagesDao.js');
const multer = require('multer');
// const upload = multer({dest: '/uploads/'});
// const upload = multer({dest: '../public/uploads'});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../public/uploads') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname) // cb 콜백함수를 통해 전송된 파일 이름 설정
    }
})

const upload = multer({ storage: storage });



/* ==================== END modules ==================== */

// var upload = function(request, response) {
//     var deferred = Q.defer();
//     var storage = multer.diskStorage({
//         //서버에 저장할 폴더
//         destination: function(request, file, cb) {
//             cb(null, '../public/uploads');
//         },

//         //서버에 저장할 파일 명
//         filename: function(request, file, cb) {
//             file.uploadFile = {
//                 name: request.params.filename,
//                 ext: file.mimetype.split('/')[1]
//             };
//             cb(null, file.uploadFile.name + '.' + file.uploadFile.ext);
//         }
//     });
//     var upload = multer({ storage: storage}).single('file');
//     upload(request, response, function(error) {
//         if (error) {
//             deferred.reject();
//         } else {
//             deferred.resolve(request.file.uploadFile);
//         }
//     });

//     return deferred.promist;
// }


exports.getImageFile = function(request, response, next) {
    let fileName = request.body.fileName;
    console.log(__filename + " fileName : " + fileName);

    Images.getImageFile(fileName, function(error, images) {
      if (error) {
        response.send(error);
        }
        response.send(images);
    });
};


        // upload(request, response).then(function(file) {
        //     response.send(file);    
        // }, function(error) {
        //     response.send(500, error);
        // });
        // if (error) {
        //     response.send(error);
        // }
        // response.send(images);