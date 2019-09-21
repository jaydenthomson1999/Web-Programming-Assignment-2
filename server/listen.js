module.exports = {
    listen: function(app, PORT) {
        app.listen(PORT, () => {
            let d = new Date();
            let h = d.getHours();
            let m = d.getMinutes();
            console.log(`server has been started on port ${PORT} at ${h}:${m}`);
        });
    }
}