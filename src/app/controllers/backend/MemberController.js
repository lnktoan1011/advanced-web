const Department = require('../../models/Department');
const Member = require('../../models/Member');
const User = require('../../models/User');
const { body, validationResult } = require('express-validator');
const nodeMailer = require('nodemailer')


const { mutipleMongooseToObject } = require('../../../util/mongoose');
const { mongooseToObject } = require('../../../util/mongoose');

class MemberController {
    async listMember(req, res, next) {

        const members = await User.find({});
        const admin_name = req.user;
        // console.log(admin_name);
        const member_check = await Member.find({}).populate({ path: 'departments' })
        // console.log(member_check);
        // console.log('%j', member_check);


        res.render('backend/Admin', {
            members: mutipleMongooseToObject(members),
            admin: mongooseToObject(admin_name),
            layout: 'backend'
        });
    }

    async memberForm(req, res, next) {
        
        const departments = await Department.find({});
        // console.log(departments);

        res.render('backend/member/add', {
            departments: mutipleMongooseToObject(departments)
        });
    }


    async addMember(req, res, next) {
        const admin_name = req.user;
        const departments = await Department.find({});
        res.render('backend/member/add1',{
            admin: mongooseToObject(admin_name),
            departments: mutipleMongooseToObject(departments),
            layout: 'backend'
        });    
    }

    async post(req, res, next) {

        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
        // return res.status(400).json({ errors: errors.array() });
        }
        console.log(req.body.departments);
        const department_arr = req.body.departments;

        const member = new User();

        member.email = req.body.email;
        member.username = req.body.username;
        member.password = member.encryptPassword('123456');

        department_arr.forEach((element, index) => { 
            member.departments.push(element);
        })
        

        member.role = 1;

        member.save(async function(err,user) {
            if (err) console.log(err);
            console.log(user._id);
            // Department.findByIdAndUpdate(req.body.department_id, { $push: { members: user._id } })

            // const department = await Department.findById(req.body.department_id);

            // department.users = user._id;

            // await department.save();
            department_arr.forEach( async (element, index) =>  { 
                const department = await Department.findById(element)
                department.users.push(user._id);
                await department.save();
                
            })
        });

        
        



        // //sendmail
        // const transporter = nodeMailer.createTransport({
        //     host: 'smtp.gmail.com',
        //     port: 587,
        //     secure: false, // n???u c??c b???n d??ng port 465 (smtps) th?? ????? true, c??n l???i h??y ????? false cho t???t c??? c??c port kh??c
        //     auth: {
        //         user: 'ltuanminh049@gmail.com',
        //         pass: '0913205175'
        //     }
            
        // })
        // const options = {
        //     from: 'ltuanminh049@gmail.com', // ?????a ch??? admin email b???n d??ng ????? g???i
        //     to: req.body.email, // ?????a ch??? g???i ?????n
        //     subject: 'New account for teacher', // Ti??u ????? c???a mail
        //     html: '<p>You have got a new message</p><ul><li>Username:' + req.body.username + '</li><li>Email:' + req.body.email + '</li><li>Password: 123456</li></ul>' // Ph???n n???i dung mail m??nh s??? d??ng html thay v?? thu???n v??n b???n th??ng th?????ng.
        //   }
        
        // transporter.sendMail(options)

        return res.redirect('/admin/index');
        
    }
}

module.exports = new MemberController;