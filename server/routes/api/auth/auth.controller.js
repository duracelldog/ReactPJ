const User = require('../../../models/user');
const jwt = require('jsonwebtoken');

//회원 가입
exports.register = (req, res) =>{
    const {username, password} = req.body;

    let newUser = null;

    const create = (user) =>{
        if(user){
            throw new Error('username exists');
        }else{

            return User.create(username, password);
        }
    }

    const count = (user) =>{
        newUser = user;
        return User.count({}).exec();
    }

    const assign = (count) =>{
        if(count == 1){
            return newUser.assignAdmin();
        }else{
            return Promise.resolve(false);
        }
    }

    const respond = (isAdmin) =>{
        res.json({
            message: 'register successfully',
            admin: isAdmin ? true : false
        });
    }

    const onError = (error) =>{
        res.status(409).json({
            message: error.message
        });
    }

    User.findOneByUsername(username)
        .then(create)
        .then(count)
        .then(assign)
        .then(respond)
        .catch(onError)
}

//로그인
exports.login = (req, res) =>{

    const {username, password} = req.body;
    const secret = req.app.get('jwt-secret');

    const check = (user) =>{
        if(!user){
            new Error('login Failed');
        }else{
            if(user.verify(password)){
                const p = new Promise((resolve, reject) =>{
                    jwt.sign({
                        _id: user._id,
                        username: user.username,
                        admin: user.admin
                    }, secret, {
                        expiresIn: '7d',
                        issure: 'beomgeun.com',
                        subject: 'userInfo'
                    }, (err, token) =>{
                        if(err) reject(err);
                        resolve(token);
                    });
                });
                return p;
            }else{
                new Error('login Failed');
            }
        }
    }

    const respond = (token) =>{
        res.json({
            message: 'logged in successfully',
            token
        });
    }

    const onError = (error) =>{
        res.status(403).json({
            message: error.message
        });
    }

    User.findOneByUsername(username)
        .then(check)
        .then(respond)
        .catch(onError);
}

exports.check = (req, res) =>{
    res.json({
        success: true,
        info: req.decoded
    });
}
