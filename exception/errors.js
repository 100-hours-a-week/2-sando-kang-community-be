const ERROR_CODES = Object.freeze({
    // Bad Request Error
    MISSING_FIELDS: (value) => ({
        code: `invalid_${value}`,
        status: 40000,
    }),

    // Unauthorized Error
    INVALID_PASSWORD: {
        code: 'invalid_password',
        status: 40101,
    },
    LOGOUT_FAILED: {
        code: 'logout_failed',
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
        code: 'user_not_found',
        status: 40401,
    },
    GET_POST_ERROR: {
        code: 'post_not_found',
        status: 40402,
    },
    GET_COMMENT_ERROR: {
        code: 'comment_not_found',
        status: 40403,
    },

    // Server Error
    SERVER_ERROR: {
        code: 'internal_server_error',
        status: 50000,
    },
    CREATE_POST_ERROR: {
        code: 'post_creation_failed',
        status: 50001,
    },
    UPDATE_POST_ERROR: {
        code: 'post_update_failed',
        status: 50002,
    },
    DELETE_POST_ERROR: {
        code: 'post_deletion_failed',
        status: 50003,
    },
    DELETE_POST_COMMENT_ERROR: {
        code: 'post_comment_deletion_failed',
        status: 50004,
    },
    CREATE_COMMENT_ERROR: {
        code: 'comment_creation_failed',
        status: 50005,
    },
    UPDATE_COMMENT_ERROR: {
        code: 'comment_update_failed',
        status: 50006,
    },
    DELETE_COMMENT_ERROR: {
        code: 'comment_deletion_failed',
        status: 50007,
    },
    DUPLICATE_EMAIL_ERROR: {
        code: 'duplicated email',
        status: 50008,
    },
    DELETE_USER_ERROR: {
        code: 'user_deletion_failed',
        status: 50009,
    },
    UPDATE_USER_ERROR: {
        code: 'user_update_failed',
        status: 50010,
    },
    DUPLICATE_NICKNAME_ERROR: {
        code: 'duplicated nickname',
        status: 50011,
    },
    UPDATE_PASSWORD_ERROR: {
        code: 'password_update_failed',
        status: 50012,
    },

});

module.exports = ERROR_CODES;
