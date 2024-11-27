//(...)
app.use('/health', healthRoute);

app.get('/', (req, res, next) => {
    res.send(response(status.SUCCESS, "루트 페이지!"));
})

// error handling
app.use((req, res, next) => {
    const err = new BaseError(status.NOT_FOUND);
    next(err);
});
// (...)