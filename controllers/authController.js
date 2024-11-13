const authModel = require('../models/authModel');
const responseFormatter = require('../util/ResponseFormatter');

// NOTE: 로그인
exports.login = (req, res) => {
    const { email, password } = req.body;

    authModel.findUserByEmailAndPassword(email, password, (err, user) => {
        if (err) {
            return res.status(500).json(responseFormatter(false, 'server_error'));
        } else if (user) {

            req.session.user = {
                user_id: user.id,
                email: user.email,
                nickname: user.nickname,
                profile: user.profile,
            };

            const responseData = {
                user_id: user.id,
                email: user.email,
                nickname: user.nickname,
                profile: user.profile,
            };

            return res.json(responseFormatter(true, 'login_success', responseData));
        } else {
            return res.status(400).json(responseFormatter(false, 'invalid_request'));
        }
    });
};

// NOTE: 인증 미들웨어
exports.isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next(); 
    } else {
        return res.status(401).json(responseFormatter(false, 'unauthorized'));
    }
};

// NOTE: 로그아웃
exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json(responseFormatter(false, 'server_error'));
        }
        res.clearCookie('connect.sid');
        return res.json(responseFormatter(true, 'logout_success'));
    });
};


//NOTE: 회원 가입
exports.signin = (req, res) => {
    const { email, password, nickname, profile } = req.body;
    console.log('here');
    authModel.createUser(email, password, nickname, profile, (err) => {
        if (err) {
            return res.status(500).json(responseFormatter(false, 'server_error'));
        } else {
            return res.json(responseFormatter(true, 'signin_success'));
        }
    });
};

//NOTE: 회원 탈퇴
exports.withdraw = (req, res) => {
    const { user_id } = req.body;

    authModel.deleteUser(user_id, (err) => {
        if (err) {
            return res.status(500).json(responseFormatter(false, 'server_error'));
        } else {
            return res.json(responseFormatter(true, 'withdraw_success'));
        }
    });
};

//NOTE: 닉네임 수정
exports.updateNickname = (req, res) => {
    const { user_id, nickname } = req.body;

    authModel.updateNickname(user_id, nickname, (err) => {
        if (err) {
            return res.status(500).json(responseFormatter(false, 'server_error'));
        } else {
            return res.json(responseFormatter(true, 'update_nickname_success'));
        }
    });
};

//NOTE: 비밀번호 수정
exports.updatePassword = (req, res) => {
    const { user_id, password } = req.body;

    authModel.updatePassword(user_id, password, (err) => {
        if (err) {
            return res.status(500).json(responseFormatter(false, 'server_error'));
        } else {
            return res.json(responseFormatter(true, 'update_password_success'));
        }
    });
};
