module.exports = class AuthorizationUtils {
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * @returns 
     */
    async isAuthenticated(req, res, next){
        if (req?.isAuthenticated()){
            return next()
        }

        res?.status(401).send("Unauthorized")
    }
}