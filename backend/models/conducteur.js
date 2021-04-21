const {data} = require('joi')
const mongoose = require("mongoose");

const conducteurSchema = new mongoose.Schema(
            {
                matricule: {
                    type: String,
                    required: true,
                },
                nom: {
                    type: String,
                    required: true,
                },
                prenom: {
                    type: String,
                    required: true,
                },
                email: {
                    type: String,
                    required: true,
                },
                phone: {
                    type: String,
                    required: true,
                },
                address: {
                    type: String,
                },
                numPermis: {
                    type: String,
                    required: true,
                },
                numPoint: {
                    type: String,
                    default: 30
                },
                password: {
                    type: String,
                    required: true,
                },
                rol: {
                    type: String,
                    default : 1
                },
                isValide : {
                    type : Boolean,
                    default : false
                }
              
            },
            {
                timestamps: true,
            }
            );

module.exports = mongoose.model("conducteur", conducteurSchema);