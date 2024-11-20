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
    CREATE_USER_ERROR: {
        code: 'user_creation_failed',
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
    UPDATE_NICKNAME_ERROR: {
        code: 'nickname_update_failed',
        status: 50011,
    },
    UPDATE_PASSWORD_ERROR: {
        code: 'password_update_failed',
        status: 50012,
    },
});

module.exports = ERROR_CODES;
