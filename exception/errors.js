const ERROR_CODES = Object.freeze({
    // Bad Request Error
    MISSING_FIELDS: (value) => ({
        code: `invalid_${value}`,
        status: 40000,
    }),

    // Unauthorized Error
    INVALID_PASSWORD: {
        code: '비밀번호가 틀렸습니다',
        status: 40101,
    },
    LOGOUT_FAILED: {
        code: '로그아웃에 실패하였습니다',
        status: 40102,
    },
    INVALID_JWT_TOKEN: {
        code: '계정 접속 정보가 올바르지 않습니다',
        status: 40103,
    },
    EXPIRED_JWT_TOKEN: {
        code: '접속 기간이 만료되었습니다. 다시 로그인 해주세요',
        status: 40104,
    },

    // Not Found Error
    USER_NOT_FOUND: {
        code: '회원 정보를 찾을 수 없습니다',
        status: 40401,
    },
    GET_POST_ERROR: {
        code: '해당 게시글을 작성한 사람만 수정 또는 삭제할 수 있습니다.',
        status: 40402,
    },
    GET_COMMENT_ERROR: {
        code: '댓글 정보를 찾을 수 없습니다',
        status: 40403,
    },

    // Server Error
    SERVER_ERROR: {
        code: '서버 내부 오류입니다',
        status: 50000,
    },
    CREATE_POST_ERROR: {
        code: '게시글 작성에 실패 하였습니다',
        status: 50001,
    },
    UPDATE_POST_ERROR: {
        code: '게시글 수정에 실패 하였습니다',
        status: 50002,
    },
    DELETE_POST_ERROR: {
        code: '게시물 삭제를 실패 하였습니다',
        status: 50003,
    },
    DELETE_POST_COMMENT_ERROR: {
        code: '댓글을 삭제하지 못하였습니다',
        status: 50004,
    },
    CREATE_COMMENT_ERROR: {
        code: '댓글을 작성하지 못하였습니다',
        status: 50005,
    },
    UPDATE_COMMENT_ERROR: {
        code: '댓글을 수정하지 못하였습니다',
        status: 50006,
    },
    DELETE_COMMENT_ERROR: {
        code: '좋아요 감소 실패입니다',
        status: 50007,
    },
    DUPLICATE_EMAIL_ERROR: {
        code: '중복된 이메일입니다',
        status: 50008,
    },
    DELETE_USER_ERROR: {
        code: '회원 탈퇴 실패하였습니다',
        status: 50009,
    },
    UPDATE_USER_ERROR: {
        code: '회원 정보 수정 실패하였습니다',
        status: 50010,
    },
    DUPLICATE_NICKNAME_ERROR: {
        code: '중복된 닉네임입니다',
        status: 50011,
    },
    UPDATE_PASSWORD_ERROR: {
        code: '비밀번호 수정을 실패하였습니다',
        status: 50012,
    },

});

module.exports = ERROR_CODES;
