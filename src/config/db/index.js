const mongoose = require('mongoose');

async function connect() {

    try {
        await mongoose.connect('mongodb+srv://admin:Abc1234@cluster0.wvmvl.mongodb.net/advanced-web?retryWrites=true&w=majority');

        console.log("connect successfully!!!");
    } catch (error) {
        console.log("connect failure");
    }

}

module.exports = { connect };