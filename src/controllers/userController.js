const { validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const userHelp = require("../helpers/userHelp");


module.exports = {
    showRegister: (req, res) => {
        return res.render('user/user-register-form');
    },
    processRegister: (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render('user/user-register-form', {
                errors: errors.errors,
                old: req.body
            });
        }
        
        const user = {
            id: userHelp.generateNewId(),
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
            avatar: req.files[0].filename
        }

        userHelp.writeNewUser(user);

        res.redirect('/user/login');
    },
    showLogin: (req, res) => {
        return res.render('user/user-login-form');
    },
    processLogin: (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render('user/user-login-form', {
                errors: errors.errors,
                old: req.body
            });
        }

        const userFound = userHelp.getAll().find( user => user.email == req.body.email)

        req.session.user = userFound;

        if (req.body.remember) {
            res.cookie('user', userFound.id, { maxAge: 24 * 3600000 }) //Cookie con maximo de vida 1 dia.
        }

        return res.redirect('/');
    },
    showProfile: (req, res) => {
        return res.render('user/profile');
    },
    logout: (req, res) => {
        
        req.session.destroy();

        if (req.cookies.user) {
            res.clearCookie('user');
        }
        return res.redirect('/');
    }

}