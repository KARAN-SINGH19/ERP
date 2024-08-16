const Candidate = require("../models/candidates");
const Position = require("../models/positions");
const Client = require("../models/clients")
const Hiring = require("../models/hirings")

exports.addPosition = async (req, res) => {
    try {
        const data = req.body;

        console.log("Request Data:", data); // Log incoming data

        const { id } = req.user;

        const newData = { ...data, recruiter: id };

        console.log("New Position Data:", newData); // Log data to be saved

        const position = await Position.create(newData);

        console.log("Created Position:", position); // Log the created position

        if (position) {
            res.status(200).json({ success: true, message: 'Position added successfully!', statusId: position._id });
        } else {
            res.status(400).json({ success: false, message: 'Position not added!' });
        }
    } catch (error) {
        console.error('Error adding position:', error);
        res.status(500).json({ success: false, message: 'Server error!' });
    }
};

exports.getPositions = async (req, res) => {
    try {
        const positions = await Position.find()

            .populate('client')
            .populate('recruiter')
            .sort({ createdAt: -1 });

        if (positions) {
            res.status(200).json({ success: true, message: 'positions fetched successfully!!', positions: positions });
        } else {
            res.status(400).json({ success: false, message: 'positions not found!!' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'server error!!' });
    }
}


exports.deletePosition = async (req, res) => {
    const positionId = req.params.id;

    try {
        const position = await Position.findByIdAndDelete(positionId);
        if (!position) {
            return res.status(404).json({ success: false, message: 'Position not found' });
        }
        res.status(200).json({ success: true, message: 'Position and references deleted successfully' });
    } catch (error) {
        console.error('Error deleting position:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


exports.getPosition = async (req, res) => {
    try {
        const { id } = req.params
        console.log(id)
        const position = await Position.findById(id)
            .populate({
                path: 'client',
                model: 'Client'
            })
        if (position) {
            res.status(200).json({ success: true, message: 'position fetched successfully!!', position: position });
        } else {
            res.status(400).json({ success: true, message: 'position not found!!' });
        }
    } catch (error) {
        res.status(500).json({ success: true, message: 'server error!!' });
    }
}

exports.updatePosition = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        // Prepare the update object based on the fields provided in the request
        const updateObject = {
            position: data.positionName,
            salary: data.salary,
            keyCriteria: data.keyCriteria,
            jobDescription: data.jobDescription,
            remarks: data.remarks
        };

        // Add client to the update object if it's present in the request body
        if (data.client) {
            updateObject.client = data.client;
        }

        // Perform the update using findByIdAndUpdate
        const position = await Position.findByIdAndUpdate(id, updateObject, {
            new: true // To return the updated document
        });

        if (position) {
            res.status(200).json({ success: true, message: 'Position updated successfully!', position });
        } else {
            res.status(404).json({ success: false, message: 'Position not found.' });
        }
    } catch (error) {
        console.error('Error updating position:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};

exports.searchPositions = async (req, res) => {
    try {
        const query = {};
        const searchParams = req.query;

        const fields = [
            "salary",
            "keyCriteria",
            "jobDescription",
            "candidatesProposed.candidateName",
            "recruiter.name",
            "client.company"
        ];

        fields.forEach((field) => {
            if (searchParams[field]) {
                query[field] = { $regex: new RegExp(searchParams[field], 'i') };
            }
        });

        console.log("Constructed Query: ", query);

        const positions = await Position.find(query)
            .populate({
                path: 'recruiter',
                select: 'name'
            })
            .populate({
                path: 'candidatesProposed',
                select: 'candidateName'
            })
            .populate({
                path: 'client',
                select: 'company'
            });

        if (positions.length > 0) {
            res.status(200).json({ success: true, message: 'Positions found successfully!', positions: positions });
        } else {
            res.status(404).json({ success: false, message: 'No positions found!' });
        }
    } catch (error) {
        console.log("Server Error: ", error);
        res.status(500).json({ success: false, message: 'Server error!' });
    }
};



exports.countPositions = async (req, res) => {
    try {
        const count = await Position.countDocuments();
        res.status(200).json({ count });
    } catch (error) {
        console.error('Error counting candidates:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.fetchPositions = async (req, res) => {
    try {
        const { client } = req.params;

        const positions = await Position.find({ client: client });

        console.log(positions)

        if (positions.length > 0) {
            return res.status(200).json({ success: true, message: 'Positions found successfully!', positions: positions });
        } else {
            return res.status(404).json({ success: false, message: 'No positions found for this client!' });
        }
    } catch (error) {
        console.error('Server Error: ', error);
        return res.status(500).json({ success: false, message: 'Server error!' });
    }
};

exports.addHiring = async (req, res) => {
    try {
        const data = req.body;
        const { id } = req.user;
        const newData = { ...data, recruiter: id };

        const hiring = await Hiring.create(newData);

        if (!hiring) {
            return res.status(400).json({ success: false, message: 'Hiring not added!' });
        }

        const { client, position, remarks, location } = hiring;

        const candidates = await Candidate.find({ _id: hiring.candidate });

        for (let candidate of candidates) {
            candidate.status.push({
                hiring: hiring._id,
                client: client,
                position: position,
                remark: remarks,
                location: location
            });
            await candidate.save();
        }

        res.status(200).json({ success: true, message: 'Hiring added successfully!', Id: hiring._id });
    } catch (error) {
        console.error('Error adding hiring:', error);
        res.status(500).json({ success: false, message: 'Server error!' });
    }
};

exports.getHirings = async (req, res) => {
    try {
        const hirings = await Hiring.find()
            .populate('recruiter', 'name email phoneNo')
            .populate('client', 'company location contactName contactEmail')
            .populate('position', 'position salary keyCriteria jobDescription')
            .populate('candidate', 'candidateName nationality currentDesignation yearsOfExperience noticePeriod salary remarks status')
            .sort({ createdAt: -1 });

        if (hirings) {
            res.status(200).json({ success: true, message: 'Hirings fetched successfully!', hirings });
        } else {
            res.status(400).json({ success: false, message: 'Hirings not found!' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error!' });
    }
};

exports.updateRemark = async (req, res) => {
    try {
        const { id } = req.params;
        const { remarks } = req.body;

        const updatedHiring = await Hiring.findByIdAndUpdate(
            id,
            { remarks },
            { new: true }
        );

        if (!updatedHiring) {
            return res.status(404).json({
                success: false,
                message: 'Hiring record not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Remark updated successfully',
            hiring: updatedHiring
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

exports.deleteHiring = async (req, res) => {
    try {
        const { id } = req.params;
        const hiring = await Hiring.findById(id);

        if (hiring) {
            // Delete hiring record
            await hiring.deleteOne();

            // Remove the reference from related candidates
            const candidates = await Candidate.find({ 'status.hiring': hiring._id });
            for (let candidate of candidates) {
                candidate.status = candidate.status.filter(s => !s.hiring.equals(hiring._id));
                await candidate.save();
            }

            res.status(200).json({ success: true, message: 'Hiring deleted successfully!' });
        } else {
            res.status(404).json({ success: false, message: 'Hiring not found!' });
        }
    } catch (error) {
        console.error('Error deleting hiring:', error);
        res.status(500).json({ success: false, message: 'Server error!' });
    }
}

exports.countPositionsByClient = async (req, res) => {
    try {
        const counts = await Position.aggregate([
            {
                $group: {
                    _id: "$client",
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'clients',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'clientDetails'
                }
            },
            {
                $unwind: "$clientDetails"
            },
            {
                $project: {
                    _id: 1,
                    count: 1,
                    clientName: "$clientDetails.company"
                }
            }
        ]);

        if (counts.length) {
            return res.status(200).json({ success: true, message: 'Counts retrieved successfully!', counts: counts });
        } else {
            return res.status(404).json({ success: false, message: 'No counts found!' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error!', error: error.message });
    }
};

exports.countHiringStatus = async (req, res) => {
    try {
        const hiredCount = await Hiring.find({ remarks: "Hired" }).count()
        const rejectedCount = await Hiring.find({ remarks: "Rejected" }).count()

        if (hiredCount !== null && rejectedCount !== null) {
            return res.status(200).json({
                success: true,
                message: 'Counts retrieved successfully!',
                hiredCount: hiredCount,
                rejectedCount: rejectedCount
            });
        } else {
            return res.status(404).json({ success: false, message: 'No counts found!' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error!', error: error.message });
    }
};

exports.countActivePosition = async (req, res) => {
    const count = await Position.find({ status: "Open" }).count()
    console.log(count)
    if (count !== null) {
        return res.status(200).json({
            success: true,
            message: 'Counts retrieved successfully!',
            count: count,
        });
    } else {
        return res.status(404).json({ success: false, message: 'No counts found!' });
    }
}

exports.displayActivePosition = async (req, res) => {
    try {
        const positions = await Position.find({ status: "Open" }).populate('client', 'company');
        if (positions.length > 0) {
            return res.status(200).json({
                success: true,
                message: 'Active positions retrieved successfully!',
                positions: positions,
            });
        } else {
            return res.status(404).json({ success: false, message: 'No active positions found!' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.displayClosePosition = async (req, res) => {
    try {
        const positions = await Position.find({ status: "Close" }).populate('client', 'company');
        if (positions.length > 0) {
            return res.status(200).json({
                success: true,
                message: 'Close positions retrieved successfully!',
                positions: positions,
            });
        } else {
            return res.status(404).json({ success: false, message: 'No close positions found!' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.updateComment = async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;

    console.log(comment, id)

    if (!comment) {
        return res.status(400).json({ success: false, message: "Comment is required" });
    }

    try {
        const hiring = await Hiring.findByIdAndUpdate(id, { comment }, { new: true });

        if (!hiring) {
            return res.status(404).json({ success: false, message: "Hiring not found" });
        }

        res.json({ success: true, hiring });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const position = await Position.findByIdAndUpdate(id, { status }, { new: true });

        if (!position) {
            return res.status(404).json({ success: false, message: "Position not found" });
        }

        res.json({ success: true, position });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


exports.updateLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const { location } = req.body;

        const hiring = await Hiring.findByIdAndUpdate(id, { location }, { new: true });

        if (!hiring) {
            return res.status(404).json({ success: false, message: 'Hiring not found' });
        }

        res.status(200).json({ success: true, message: 'Location updated successfully', hiring });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}