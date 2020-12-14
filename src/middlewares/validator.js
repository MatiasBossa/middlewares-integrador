const userHelp = require('../helpers/userHelp');
const path = require('path');
const { body } = require('express-validator');
const bcrypt = require('bcryptjs');

module.exports = {
    register: [
        body('email')
            .notEmpty().withMessage("Complete el campo email")
                .bail()
            .isEmail().withMessage("El campo ingresado no es valido")
                .bail()
            .custom(emailValue => {
                const users = userHelp.getAll();
    
                const userExists = users.find(user => user.email == emailValue);
    
                return !userExists;
            }).withMessage("El Email ya esta registrado"),
        body('password')
            .notEmpty().withMessage("Complete el campo password")
                .bail()
            .isLength({ min: 6 }).withMessage("Ingrese un minimo de 6 caracteres")
                .bail()
            .custom((passwordValue, { req }) => passwordValue == req.body.retype).withMessage("Las contraseñas no coinciden"),
        body('retype')
            .notEmpty().withMessage("Complete el campo retype password"),
        body('avatar')
            .custom((avatarValue, { req }) => req.files[0]).withMessage('El avatar es obligatorio')
                .bail()
            .custom((avatarValue, { req }) => {
                const validExtensions = ['.png', '.jpeg'];
                const fileExt = path.extname(req.files[0].originalname);
                return validExtensions.includes(fileExt);
            }).withMessage("Extension invalida, Las Extensiones validas son ['.png' , '.jpeg']")
    ],
    login: [
        body('email')
            .notEmpty().withMessage("Complete el campo email")
                .bail()
            .isEmail().withMessage("El campo ingresado no es valido")
                .bail()
            .custom( (emailValue, { req }) => {
                const users = userHelp.getAll();
                const userFound = users.find(user => user.email == emailValue)
                
                if (userFound) {
                    if (userFound.email == emailValue && bcrypt.compareSync(req.body.password, userFound.password)) {
                        return true;
                    }
                    return false
                }

                return false;
            }).withMessage("El usuario o password no coiciden")
    ]
}