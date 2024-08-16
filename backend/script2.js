const { faker } = require('@faker-js/faker');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvWriter = createCsvWriter({
    path: 'clients.csv',
    header: [
        { id: 'serialNo', title: 'serialNo' },
        { id: 'date', title: 'date' },
        { id: 'company', title: 'company' },
        { id: 'location', title: 'location' },
        { id: 'address', title: 'address' },
        { id: 'contactName', title: 'contactName' },
        { id: 'contactEmail', title: 'contactEmail' },
        { id: 'contactPhone', title: 'contactPhone' },
        { id: 'contactName2', title: 'contactName2' },
        { id: 'contactEmail2', title: 'contactEmail2' },
        { id: 'contactPhone2', title: 'contactPhone2' }
    ]
});

const clients = [];

for (let i = 0; i < 600; i++) {
    clients.push({
        serialNo: i + 1,
        date: faker.date.recent().toISOString().split('T')[0],
        company: faker.company.name(),
        location: faker.location.country(),
        address: faker.location.streetAddress(),
        contactName: faker.person.fullName(),
        contactEmail: faker.internet.email(),
        contactPhone: faker.phone.number(), // 10-digit phone number
        contactName2: '',
        contactEmail2: '',
        contactPhone2: ''
    });
}

csvWriter.writeRecords(clients)
    .then(() => {
        console.log('CSV file created successfully.');
    })
    .catch((err) => {
        console.error('Error writing CSV file:', err);
    });
