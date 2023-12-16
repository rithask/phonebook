const express = require('express')
const app = express()
const morgan = require('morgan')

let contacts = [
    { 
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]

app.use(express.json());
app.use(morgan('tiny'));

app.get('/api/persons', (request, response) => {
    response.json(contacts);
})

app.post('/api/persons', (request, response) => {
    const id = Math.floor(Math.random() * 100);
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

    const nameExist = contacts.some(contact => contact.name.includes(name));
    if (nameExist) {
        return response.status(400).json({
            error: "name must be unique"
        })
    }

    const contact = {
        id, name, number
    }

    contacts = contacts.concat(contact);

    response.json(contact);
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const contact = contacts.find(contact => contact.id === id)

    if (contact) {
        response.json(contact);
    } else {
        response.status(404).end();
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    contacts = contacts.filter(contact => contact.id !== id)

    response.json(contacts);
})

app.get('/info', (request, response) => {
    const numOfContacts = contacts.length;
    const datetime = new Date();

    console.log(datetime);

    const msg = `<p>Phonebook has info for ${numOfContacts} people</p><p>${datetime}</p>`

    response.send(msg);
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server running on port http://127.0.0.1:${PORT}`);
})
