const { faker } = require('@faker-js/faker');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvWriter = createCsvWriter({
    path: 'candidates.csv',
    header: [
        { id: 'mainFunction', title: 'mainFunction' },
        { id: 'subFunction', title: 'subFunction' },
        { id: 'position', title: 'position' },
        { id: 'candidateName', title: 'candidateName' },
        { id: 'dob', title: 'dob' },
        { id: 'nationality', title: 'nationality' },
        { id: 'company', title: 'company' },
        { id: 'location', title: 'location' },
        { id: 'currentDesignation', title: 'currentDesignation' },
        { id: 'yearsOfExperience', title: 'yearsOfExperience' },
        { id: 'currentSalary', title: 'currentSalary' },
        { id: 'noticePeriod', title: 'noticePeriod' },
        { id: 'reportingTo', title: 'reportingTo' },
        { id: 'comments', title: 'comments' },
        { id: 'positionStatus', title: 'positionStatus' },
        { id: 'recruiter', title: 'recruiter' }
    ]
});

const candidates = [];

for (let i = 0; i < 600; i++) {
    candidates.push({
        mainFunction: faker.person.jobTitle(),
        subFunction: faker.person.jobType(),
        position: faker.person.jobTitle(),
        candidateName: faker.person.fullName(),
        dob: faker.date.past().toISOString().split('T')[0],
        nationality: faker.location.country(),
        company: faker.company.name(),
        location: faker.location.country(),
        currentDesignation: faker.person.jobTitle(),
        yearsOfExperience: faker.number.int({ min: 1, max: 20 }),
        currentSalary: faker.number.int({ min: 30000, max: 150000 }),
        noticePeriod: `${faker.number.int({ min: 1, max: 3 })} months`,
        reportingTo: '', // Empty string
        comments: '', // Empty string
        // client: '', // Empty string
        // positionName: '', // Empty string
        // remarks: '', // Empty string,
        positionStatus: '',
        recruiter: 'Karan Singh'
    });
}

csvWriter.writeRecords(candidates)
    .then(() => {
        console.log('CSV file created successfully.');
    })
    .catch((err) => {
        console.error('Error writing CSV file:', err);
    });
