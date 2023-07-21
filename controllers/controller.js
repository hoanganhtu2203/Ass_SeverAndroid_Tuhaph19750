const express = require('express')
const userModel = require('../model/usersp')
const multer = require('multer')
var storage = multer.diskStorage({
    destination :(req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now()+'-'+file.originalname)
    }
})
const upload = multer({storage: storage, limits:{fieldSize: 1*1024*1024}});
const app = express()
app.use(express.static(__dirname + '/images/'))


app.get('/add', function(req, res){

    res.render('themsanpham.hbs');
});

app.post('/insert',upload.single('anh'), async (req, res) => {
    console.log(req.body);
    if (req.body.id == '') {
        //them
        addsp(req, res);
    } else {
        //update
        updatesp(req, res);
    }


});
async function addsp(req, res) {
    const u = new userModel({
        idsp: req.body.idsp,
        namesp: req.body.namesp,
        giasp: req.body.giasp,
        mota: req.body.mota,
        anh: req.file.filename
    }) //Lấy thông tin nhập vào
    try {
        await u.save() //Thêm vào trong database
        userModel.find({}).then(user => {
            res.render('../views/danhsachsanpham.hbs', {
                arrayuser: user.map(user => user.toJSON())
            })
        })

    } catch (error) {
        console.log(error)
    }
    
}

function updatesp(req, res) {
    userModel.findOneAndUpdate({ _id: req.body.id }, req.body, { new: true }).then((err, doc) => {
        try {
            userModel.find({}).then(user => {
                res.render('../views/danhsachsanpham.hbs', {
                    arrayuser: user.map(user => user.toJSON())
                })
            })
        } catch (error) {
            console.log(error)
        }
    })
}


app.get('/danhsachsanpham', (req, res) => {
    userModel.find({}).then(user => {
        res.render('../views/danhsachsanpham.hbs', {
            arrayuser: user.map(user => user.toJSON())
        })
    })
    //res.render('../views/danhsachsanpham.hbs')
    // userModel.find({}). then(user=>{
    //     res.render('../views/danhsachsanpham.hbs',{
    //         arrayuser:user.map(user=>user.toJSON())
    //     })
    // })
})

//edit
app.get('/edit/:id', (req, res) => {
    userModel.findById(req.params.id).then(user => {
        res.render('../views/themsanpham.hbs', {
            user: user.toJSON()
        })
    })
});

//delete
app.get('/delete/:id', async (req, res) => {
    try {
        const user = await userModel.findByIdAndDelete(req.params.id, req.body);
        if (!user) response.status(404).send("No item");
        else {

            res.redirect('/dssanphams/danhsachsanpham')
        }
        res.status(200).send();
    } catch (err) {
        res.status(500).send(error);

    }


});
module.exports = app
