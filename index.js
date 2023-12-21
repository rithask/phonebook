require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/contact')

app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.static('dist'));

app.get('/api/persons', (request, response) => {
    Contact.find({})
        .then(contacts => {
            response.json(contacts)
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;

    Contact.findById(id)
        .then(contact => {
            response.json(contact)
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const name = request.body.name;
    const number = request.body.number;

    if (!name || !number) {
        const missingContent = (!name && !number)
                                ? "name and number" 
                                : (!name ? "name" : "number");
        return response.status(400).json({
            error: `${missingContent} missing`
        })
    }

    const contact = new Contact({
        name, number
    })

    contact.save()
        .then(savedContact => {
            response.json(savedContact)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response) => {
    const body = request.body

    const contact = {
        name: body.name,
        number: body.number
    }

    Contact.findByIdAndUpdate(request.params.id, contact, { new: true })
        .then(updatedContact => {
            response.json(updatedContact)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    Contact.findByIdAndDelete(id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.get('/info', (request, response) => {
    Contact.find({}).then(contacts => {
        const numOfContacts = contacts.length;
        const datetime = new Date();
        
        console.log(datetime);
        
        const msg = `<p>Phonebook has info for ${numOfContacts} people</p><p>${datetime}</p>`
        
        response.send(msg);
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name == 'CastError') {
        return response.static(404).send({error: 'malformatted id'})
    }

    next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port http://127.0.0.1:${PORT}`);
})
