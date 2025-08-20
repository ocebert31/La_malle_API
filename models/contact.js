const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    name: { type: String, required: true},
    firstName: { type: String, required: true},
    email: { type: String, required: true},
    phone: { type: String, required: true},
    description: { type: String, required: true},
    typeRequest: { type: String, required: true},
    desiredDate: { 
        type: Date, 
        required: true,
        validate: {
            validator: function(value) {
                const today = new Date();
                today.setHours(0,0,0,0);
                return value > today;
            },
            message: 'La date désirée doit être supérieure à la date du jour.'
        }
    },
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