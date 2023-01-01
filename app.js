// LISTENING TO THE PORT
const {app, PORT} = require('./public/index');
app.listen(PORT, () => console.log(`Listening on the port: ${PORT}`));
