exports.get404 = (req, res, next) => {
    // res.status(404).sendFile(path.join(__dirname, 'views', '404.html')); // without any view engine


    res.status(404).render('404', {
        pageTitle: '404',
        path: '/404',
        views: process.env.views,
        isAuthenticated: req.session.isLoggedIn,
    }); // with view engine format not change with engine's
}