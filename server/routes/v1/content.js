const express = require('express');
const mysql = require('mysql2/promise');
const joi = require('joi');

const router = express.Router();

const { isLoggedIn } = require('../../middlewares/authControllers')
const { dbConfig } = require('../../config');

const tutorialSchema = joi.object({
    title: joi.string(),
    content: joi.string(),
    private: joi.boolean()
})
router.get('/user-tutorials', isLoggedIn, async (req, res) => {
    const { id } = req.token;
    
    try {
        const con = await mysql.createConnection(dbConfig);
        const [tutorials] = await con.execute(`
        SELECT * FROM tutorials
        WHERE user_id = ${mysql.escape(id)}
        `);
        await con.end();

        return res.status(200).send(tutorials)
    } catch (error) {
        console.log(error)
        res.status(404).send({ error: 'Not logged'})
    }
});


router.get('/tutorials', isLoggedIn, async (req, res) => {
    const { authorization }= req.headers;
    try {
        const con = await mysql.createConnection(dbConfig);
        const [tutorials] = await con.execute(`
        SELECT * FROM tutorials
        `);

        

        if (!authorization) {
            res.status(404).send({error: "Please log in"})
        } 

        return res.status(200).send({tutorials})
    } catch (error) {
        console.log(error)
        res.status(404).send({ error: 'Not logged'})
    }
});

router.get('/tutorials/tutorials', async (req, res) => {
    try {
        const con = await mysql.createConnection(dbConfig);
        const [tutorials] = await con.execute(`
        SELECT * FROM tutorials
        WHERE private = 0
        `);


        return res.status(200).send({tutorials})
    } catch (error) {
        console.log(error)
        res.status(404).send({ error: 'Not logged'})
    }
});

router.post('/tutorials', isLoggedIn, async (req, res) => {
    
    const user_id = await joi.number().validateAsync(req.token.id);
    const { title, content, private } = req.body;
    try {
        data = await tutorialSchema.validateAsync(req.body)
    } catch (error) {
        console.log(error)
    }

    try {
        const con = await mysql.createConnection(dbConfig);
        
        await con.execute(`
        INSERT INTO tutorials (user_id, title, content, private)
        VALUES (?, ?, ?, ?)
        `,[user_id, title, content, private])
        await con.end();

        return res.send({
            title,
            content,
            private
        })
    } catch (error) {
        console.log(error)
        res.status(404).send({ error: 'Incorrect data'})
    }
    
});

module.exports = router;