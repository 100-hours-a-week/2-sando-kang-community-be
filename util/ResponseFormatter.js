const responseFormatter = (success, message = null, data = null) => {
    return {
      success,
      message,
      data
    };
  };
  
  module.exports = responseFormatter;


