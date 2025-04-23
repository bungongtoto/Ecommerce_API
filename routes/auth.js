const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const AuthService = require("../services/AuthService");
const AuthServiceInstance = new AuthService();

module.exports = (app, passport) => {
    app.use("/auth", router);

    //registration Endpoint
    router.post("/register", async (req, res, next) => {
        try {
            let data = req.body;
            console.log(data);

            // if email and password was not provided reject
            if (!data.email || !data.password) {
                res.status(400).send("email and password required");
            }

            // setting default role for customers
            data = { ...data, role_id: 3 };

            // register user with auth service
            const response = await AuthServiceInstance.register(data);

            // res with success message
            res.status(200).send(response);
        } catch (error) {
            next(error);
        }
    });

    //Login Endpoint
    router.post(
        "/login",
        passport.authenticate("local"),
        async (req, res, next) => {
            try {
                const { username, password } = req.body;

                // if email and password was not provided reject
                if (!username || !password) {
                    res.status(400).send("email and password required");
                }

                const response = await AuthServiceInstance.login({
                    email: username,
                    password,
                });
                res.status(200).send(response);
            } catch (error) {
                next(error);
            }
        }
    );

    //Logout Endpoint
    router.get("/logout", (req, res, next) => {
        //clears for passport
        req.logout((err) => {
            if (err) {
                return next(err);
            }

            // detroys sessions
            req.session.destroy((err) => {
                if (err) {
                    return next(err);
                }

                res.clearCookie('connect.sid'); // clear the session cookie
                res.status(200).send("User logged out and session destroyed");
            });
        });
    });

};
