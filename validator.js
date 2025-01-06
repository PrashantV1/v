

class Validator {
   requestTypes = {
    all: true,
    any: true
  };

  checkNestedData = (schema) => {
    if (schema.any || schema.all)
      return true;
    return false;
  };


  validType = (desired, input) => {
    const type = {
      enum: (data, input) => {
        if (!input.every((input) => data.data.join(',').includes(input))) return false;
        return true;
      }
    };

    if (type[desired.type])
      return type[desired.type](desired, input);
    return typeof input === desired.type;
  };


  checkMandatoryKeys = (schema, inputData) => {
    for (const key of Object.keys(schema)) {

      const inputField = inputData[key];
      if (!inputField) return this.getErrorData(`Missing ${key}`);

      //check if nesting is present 
      if (this.checkNestedData(schema[key])) return this.checkFields(schema[key], inputField);

      // check if input is valid 
      const validField = this.validType(schema[key], inputField);
      if (!validField) return validField;
    }

    return { valid: true };
  };


  assignRequestChecker = (type, schema, inputData) => {
    const requestType = {
      all: this.checkMandatoryKeys,
      any: this.checkMandatoryKeys
    }
    return requestType[type](schema, inputData);
  };



  checkFields = (schema, inputData) => {
    for (const key of Object.keys(schema)) {

      const validateInput = this.assignRequestChecker(key, schema[key], inputData);
      if (!validateInput.valid) return validateInput;

    }

    return { valid: true };
  };

  verifyRequest = (schema, req) => {
    for (const key of Object.keys(schema)) {
      const checkValidations = this.checkFields(schema[key], req[key])
      if (!checkValidations.valid)
        return this.getErrorData(checkValidations.message)
    }
    return { valid: true }
  };


  getErrorData = (message) => {
    return { message, valid: false }
  };


}








const validator =new Validator()

const schema={
  body:{
    all:{
      user:{
        type:'string'
      }
    }
  }
}

const req={
  body:{
    user:11
  }
}

console.log(validator.verifyRequest(schema,req))