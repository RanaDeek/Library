const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your_secret_key';
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/Library", { useNewUrlParser: true, useUnifiedTopology: true });

const UserSchema = new mongoose.Schema({
    name: String,
    Email: String,
    password: String,
    schoolID: String,
    role: String
});

const UserModel = mongoose.model("students", UserSchema);

app.get("/getStudent", (req, res) => {
    UserModel.find({})
        .then(users => {
            res.json({ students: users });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send("Error retrieving students");
        });
});

app.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password, schoolID, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
        const newUser = new UserModel({
            name: `${firstName} ${lastName}`,
            Email: email,
            password: hashedPassword,
            schoolID,
            role
        });

        var nodemailer = require('nodemailer');

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: '1201724@student.birzeit.edu',
                pass: 'mdmr hupa camg kidt'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        var mailOptions = {
            from: '1201724@student.birzeit.edu',
            to: 'ranadeek2002@gmail.com',
            subject: 'Email From Birzeit Library',
            text: 'That was easy!'
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        const user = await newUser.save();
        res.json(user);
    } catch (err) {
        res.status(500).send("Error creating user");
    }
});

app.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const student = await UserModel.findOne({ Email: email });
        if (student) {
            const isMatch = bcrypt.compareSync(password, student.password);
            if (isMatch) {
                const token = jwt.sign(
                    { id: student._id, name: student.name, role: student.role, Email: student.Email, schoolID: student.schoolID },
                    JWT_SECRET,
                    { expiresIn: '1h' }
                );
                console.log(token);
                res.json({ message: "Sign in successful", token });
            } else {
                res.status(401).json({ message: "Incorrect password" });
            }
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error signing in");
    }
});



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
