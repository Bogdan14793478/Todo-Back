const {Router} = require('express')
const router = Router()
const User = require('../models/User')
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const jwtToken = require('jsonwebtoken')

router.post('/registration',  
    [  //для валидации:
        check('email', 'Некорректный email').isEmail(),
        check('password','Некорректный password').isLength({min: 6}) 
    ]
    ,
async (req, res) => {  //роут для регистрации req-с фронта на бек, а res-с бека на фронт
    try{
        const errors = validationResult(req)   //анализ req на наличие ошибок
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при регистрации'
            })
        }

        const {email, password} = req.body

        const isUsed = await User.findOne({email})
        if (isUsed){
            return res.status(300).json({message: 'Данный email уже занят, попробуйте другой'})
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const user = new User({
            email, password: hashedPassword
        })

        await user.save()
        res.status(201).json({massage: 'Пользователь создан'})

    } catch (error){
        console.log(error, 'error')
    }
})


//LOGIN

router.post('/login',  
    [  //для валидации:
        check('email', 'Некорректный email').isEmail(),
        check('password','Некорректный password').exists() 
    ]
    ,
async (req, res) => {  //роут для регистрации req-с фронта на бек, а res-с бека на фронт
    try{
        const errors = validationResult(req)   //анализ req на наличие ошибок
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при регистрации'
            })
        }

        const {email, password} = req.body

        const user = await User.findOne({email})
        if (!user){
            return res.status(400).json({message: 'Такого email нет в базе'})
        }
        const isMatch = bcrypt.compare(password, user.password)
        if(!isMatch){
          return res.status(400).jsom({message: 'Пароли не совпадают'})  
        }
        const jwtSecret = '434rgfdbfdbfb353535dbfdfbsdbdsb33453'

        const token = jwtToken.sign(
            {userId: user.id},
            jwtSecret,
            {expiresIn: '1h'}
        )
        res.json({token, userId: user.id})
        
    } catch (error){
        console.log(error, 'error')
    }
})


module.exports = router