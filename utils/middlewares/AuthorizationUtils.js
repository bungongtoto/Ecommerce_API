module.exports = class AuthorizationUtils {
    async isAuthenticated(req, res, next){
        if (req?.isAuthenticated()){
            return next()
        }

        res?.status(401).send("Unauthorized")
    }
}