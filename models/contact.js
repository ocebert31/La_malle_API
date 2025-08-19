const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    name: { type: String, required: true},
    firstName: { type: String, required: true},
    email: { type: String, required: true},
    phone: { type: String, required: true},
    description: { type: String, required: true},
    typeRequest: { type: String, required: true},
    desiredDate: { type: Date, required: true},
    urgence: {
        type: String,
        enum: ['Faible', 'Moyenne', 'Élevée'],
        required: true,
    },
    status: {
        type: String,
        enum: ['En attente', 'Acceptée', 'Rejetée', 'En cours'],
        default: 'En attente',
    },
    rgpd: { type: Boolean, required: true},
}, {timestamps: true});

module.exports = mongoose.model('Contact', contactSchema);