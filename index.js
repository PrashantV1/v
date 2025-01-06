




const apiValidator = (schema) => (req, res, next) => {
  const validRequest = verifyRequest(schema, req);

  if (!validRequest.valid)
    return res.status(500).send({ message: validBody.message })

  next()
}



module.exports.apiValidator = apiValidator