const express = require('express');
const joi = require('joi');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { dbConfig, jwtSecret } = require('../../config');


const router = express.Router();

const userSchema = joi.object({
    email: joi.string().email().lowercase().required(),
    password: joi.string().min(8).required(),
});

router.post('/register', async (req, res) => {
    let userData = req.body;

    try {
        userData = await userSchema.validateAsync(userData)
    } catch (error) {
        return res.status(404).send({ error: 'Incorrect data sent' })
    }

    try {
        const hashedPw = bcrypt.hashSync(userData.password)

        const con = await mysql.createConnection(dbConfig);
        const [data] = await con.execute(`
        INSERT INTO users (email, password)
        VALUES (${mysql.escape(userData.email)}, '${hashedPw}')
        `);

        await con.end();

        return res.send(data)
    } catch (error) {
        return res.status(500).send({error: 'Please try again!!'})
    }
});

router.post('/login', async (req, res) => {
    let userData = req.body;
    try {
        userData = await userSchema.validateAsync(userData)
    } catch (error) {
        return res.status(404).send({ error: 'Incorrect email or password' })
    }

    try {
        const con = await mysql.createConnection(dbConfig)
        const [data] = await con.execute(`
        SELECT * FROM users
        WHERE email = ${mysql.escape(userData.email)}
        `);
        await con.end();

        if (data.length === 0) {
            return res.status(400).send({ error: 'Incorrect email or password'})
        };

            const isAuthed = bcrypt.compareSync(userData.password, data[0].password);

            if (isAuthed) {
                const token = jwt.sign({ id: data[0].id, email: data[0].email},
                    jwtSecret,
                    );
                return res.send({ msg: 'Succesfully loged', token})    
            }

            return res.status(400).send({ error: 'Incorrect email or password' })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ error: 'Please try again'})
    }
});


router.get('/users', async (req, res) => {
    try {
        const con = await mysql.createConnection(dbConfig);
        const [data] = await con.execute(`
        SELECT  COUNT(tutorials.user_id) AS COUNT FROM tutorials
        `);
        await con.end();
        
        if (!data) {
            return res.send({ error: 'No users and tutorials'})
        }
        
        return res.status(200).send(data)
    } catch (error) {
        
    }
});



module.exports = router;