const handleLoginSuccess = async (req, res, next) => {
    if (req.user) {
        res.json({
            success: true,
            message: "user has successfully authenticated",
            user: req.user,
            cookies: req.cookies
        });
    }
}

const handleLogout = async (req, res, next) => {
    try {
        req.logout();
        res.redirect(CLIENT_HOME_PAGE_URL);
    } catch (err) {
        console.error(err.message);
        next(err);
    }
}

const handleLoginFailed = async (req, res, next) => {
    req.logout();
    res.redirect(CLIENT_HOME_PAGE_URL);
}

module.exports = { handleLoginSuccess, handleLogout, handleLoginFailed };