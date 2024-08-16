const Client = require("../models/clients")

exports.addClient = async (req, res) => {
    try {
        const data = req.body
        const client = await Client.create(data)
        if (client) {
            res.status(200).json({ success: true, message: 'client added successfully!!' });
        } else {
            res.status(400).json({ success: true, message: 'client not added!!' });
        }
    } catch (error) {
        res.status(500).json({ success: true, message: 'server error!!' });
    }
}

exports.getClients = async (req, res) => {
    try {
        const clients = await Client.find().sort({ createdAt: -1 })
        if (clients) {
            res.status(200).json({ success: true, message: 'clients fetched successfully!!', clients: clients });
        } else {
            res.status(400).json({ success: true, message: 'clients not found!!' });
        }
    } catch (error) {
        res.status(500).json({ success: true, message: 'server error!!' });
    }
}

exports.getClient = async (req, res) => {
    try {
        const { id } = req.params
        const client = await Client.findById(id)
        if (client) {
            res.status(200).json({ success: true, message: 'client fetched successfully!!', client: client });
        } else {
            res.status(400).json({ success: true, message: 'client not found!!' });
        }
    } catch (error) {
        res.status(500).json({ success: true, message: 'server error!!' });
    }
}

exports.deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await Client.findById(id);

        if (!client) {
            return res.status(404).json({ success: false, message: 'Client not found!' });
        }

        await client.deleteOne();

        res.status(200).json({ success: true, message: 'Client deleted successfully!' });
    } catch (error) {
        console.error('Error deleting client:', error);
        res.status(500).json({ success: false, message: 'Server error!' });
    }
};

exports.updateClient = async (req, res) => {
    try {
        const { id } = req.params
        const data = req.body
        const client = await Client.findByIdAndUpdate(id, data, { new: true })
        if (client) {
            res.status(200).json({ success: true, message: 'client updated successfully!!' });
        } else {
            res.status(400).json({ success: true, message: 'client not found!!' });
        }
    } catch (error) {
        res.status(500).json({ success: true, message: 'server error!!' });
    }
}

exports.searchClients = async (req, res) => {
    try {
        const query = {};
        const searchParams = req.query;

        console.log(searchParams);

        const fields = [
            "serialNo",
            "date",
            "company",
            "location",
            "address",
            "contactName",
            "contactEmail",
            "contactPhone",
            "contactName2",
            "contactEmail2",
            "contactPhone2",
        ];

        fields.forEach((field) => {
            if (searchParams[field]) {
                query[field] = { $regex: searchParams[field], $options: 'i' };
            }
        });

        const clients = await Client.find(query);
        if (clients.length > 0) {
            res.status(200).json({ success: true, message: 'Clients found successfully!', clients: clients });
        } else {
            res.status(404).json({ success: false, message: 'No clients found!' });
        }
    } catch (error) {
        console.error('Error searching clients:', error);
        res.status(500).json({ success: false, message: 'Server error!' });
    }
};

exports.getClientNames = async (req, res) => {
    try {
        const clientNames = await Client.find({}, 'company')
        if (clientNames) {
            res.status(200).json({ success: true, message: 'client fetched successfully!!', clientNames: clientNames });
        } else {
            res.status(400).json({ success: true, message: 'client not found!!' });
        }
    } catch (error) {
        res.status(500).json({ success: true, message: 'server error!!' });
    }
}

exports.countClients = async (req, res) => {
    try {
        const count = await Client.countDocuments();
        res.status(200).json({ count });
    } catch (error) {
        console.error('Error counting candidates:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

