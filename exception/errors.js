const ERROR_CODES = Object.freeze({
    
    //Bad Request Error
    MISSING_FIELDS: {
        code: '요청 파라미터 오류',
        status: 40000,
    },

    // Unauthorized Error
    
    INVALID_PASSWORD: {
        code: '비밀번호가 틀렸습니다',
        status: 40102,
    },
    LOGOUT_FAILED: {
        code: '로그아웃 실패',
        status: 40103,
    },

    //Not Found Error
    USER_NOT_FOUND: {
        code: '유저를 찾을 수 없습니다',
        status: 40101,
    },

    GET_POST_ERROR: {
        code: '게시물을 불러올 수 없습니다',
        status: 40401,
    },
    GET_COMMENT_ERROR: {
        code: '댓글을 불러올 수 없습니다',
        status: 40402,
    },



    //Server Error
    SERVER_ERROR: {
        code: '내부 서버 오류',
        status: 50000,
    },

    CREATE_POST_ERROR: {
        code: '게시물 생성 실패하였습니다',
        status: 50001,
    },

    UPDATE_POST_ERROR: {
        code: '게시물 수정 실패하였습니다',
        status: 50002,
    },
    DELETE_POST_ERROR: {
        code: '게시물 삭제 실패하였습니다',
        status: 50003,
    },
    DELETE_POST_COMMENT_ERROR: {
        code: '게시물 관련 댓글 삭제 실패하였습니다',
        status: 50004,
    },
   
    CREATE_COMMENT_ERROR: {
        code: '댓글 생성 실패하였습니다',
        status: 50005,
    },

    UPDATE_COMMENT_ERROR: {
        code: '게시물 업데이트 실패하였습니다',
        status: 50006,
    },

    DELETE_COMMENT_ERROR: {
        code: '게시물 삭제 실패하였습니다',
        status: 50007,
    },

    CREATE_POST_ERROR: {
        code: '게시물 생성 실패하였습니다',
        status: 50008,
    },

    CREATE_USER_ERROR: {
        code: '유저 생성 실패하였습니다',
        status: 50009,
    },

    DELETE_USER_ERROR: {
        code: '유저 삭제 실패하였습니다',
        status: 50010,
    },
    
    UPDATE_USER_ERROR: {
        code: '유저 업데이트 실패하였습니다',
        status: 50011,
    },

    UPDATE_PASSWORD_ERROR: {
        code: '비밀번호 수정 실패하였습니다',
        status: 50012,
    }

  
});

module.exports = ERROR_CODES;
