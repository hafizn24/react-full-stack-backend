import express from "express";
import { db, connectToDb } from './db.js'

const app = express()
app.use(express.json())

app.get('/api/articles/:name', async (req, res) => {
    const { name } = req.params

    // const client = new MongoClient('mongodb://127.0.0.1:27017')
    // await client.connect()

    // const db = client.db('react-blog-db')

    const article = await db.collection('articles').findOne({ name })
    if (article) {
        res.json(article)
    } else {
        res.sendStatus(404).send('Article not found!')
    }
})


app.put('/api/articles/:name/upvote', async (req, res) => {
    const { name } = req.params

    // const client = new MongoClient('mongodb://127.0.0.1:27017')
    // await client.connect()

    // const db = client.db('react-blog-db')
    await db.collection('articles').updateOne({ name }, {
        $inc: { upvotes: 1 },
    })

    const article = await db.collection('articles').findOne({ name })

    // const article = articlesInfo.find((a) => a.name === name)
    if (article) {
        res.send(`The ${name} article now has ${article.upvotes} upvotes !`)
    } else {
        res.send('That article doesnt exist')
    }
})

app.post('/api/articles/:name/comments', async (req, res) => {
    const { name } = req.params
    const { postedBy, text } = req.body

    // const client = new MongoClient('mongodb://127.0.0.1:27017')
    // await client.connect()

    // const db = client.db('react-blog-db')
    await db.collection('articles').updateOne({ name }, {
        $push: ({ comments: { postedBy, text } })
    })

    const article = await db.collection('articles').findOne({ name })

    // const article = articlesInfo.find(a => a.name === name)

    if (article) {
        res.send(article.comments)
    } else {
        res.send('That article doesnt exist')
    }

})

app.post('/hello', (req, res) => {
    console.log(req.body)
    res.send(`Hello ${req.body.name}`)
})

app.get('/hello/:name', (req, res) => {
    const { name } = req.params
    res.send(`Hi ${name}`)
})

connectToDb(() => {
    console.log('👍')
    app.listen(8000, () => {
        console.log('Server is listening on port 8000')
    })
})

