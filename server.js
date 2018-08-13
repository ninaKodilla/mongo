const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://ninczasek:Abc123@ds235251.mlab.com:35251/ds119000');

const userSchema = new Schema({
    name: String,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: Boolean,
    created_at: Date,
    updated_at: Date
});

userSchema.methods.manify = function(next) {
    this.name = this.name + '-boy';

    return next(null, this.name);
};

userSchema.pre('save', function(next) {
    const currentDate = new Date();
    this.updated_at = currentDate;

    if (!this.created_at)
        this.created_at = currentDate;

    next();
});

const User = mongoose.model('User', userSchema);

const kenny = new User({
    name: 'Kenny',
    username: 'Kenny_the_boy',
    password: 'password'
});

kenny.manify(function(err, name) {
    if (err) throw err;
    console.log('Twoje nowe imię to: ' + name);
});

const nina = new User({
    name: 'nina',
    username: 'nina_the_boy',
    password: 'password'
});

nina.manify(function(err, name) {
    if (err) throw err;
    console.log('Twoje nowe imię to: ' + name);
});

const findAllUsers = function() {
    return User.find({}, function(err, res) {
        if (err) throw err;
        console.log('Actual database records are ' + res);
    });
}

const findSpecificRecord = function() {
    return User.find({ username: 'Kenny_the_boy' }, function(err, res) {
        if (err) throw err;
        console.log('Record you are looking for is ' + res);
    })
}

const updadeUserPassword = function() {
    return User.findOne({ username: 'Kenny_the_boy' })
    .then(function(user) {
        console.log('Old password is ' + user.password);
        console.log('Name ' + user.name);
        user.password = 'newPassword';
        console.log('New password is ' + user.password);
        return user.save(function(err) {
            if (err) throw err;

            console.log('Uzytkownik ' + user.name + ' zostal pomyslnie zaktualizowany');
        })
    })
}

const updateUsername = function() {
    return User.findOneAndUpdate({ username: 'Benny_the_boy' }, { username: 'Benny_the_man' }, { new: true }, function(err, user) {
        if (err) throw err;

        console.log('Nazwa uzytkownika po aktualizacji to ' + user.username);
    })
}

const findKennyAndDelete = function() {
    return User.findOne({ username: 'Kenny_the_boy' })
    .then(function(user) {
        return user.remove(function() {
            console.log('User successfully deleted');
        });
    });
}

Promise.all([kenny.save()])
    .then(findAllUsers)
    .then(findSpecificRecord)
    .then(updadeUserPassword)
    .then(updateUsername)
    .then(findKennyAndDelete)
    .catch(console.log.bind(console))