import mongoose, { Schema } from "mongoose";

// Define sub-schemas for each section
const BasicInfoSchema = new Schema({
  clientName: {
    type: String,
    required: function () { return this.basicInfo != null; }
  },
  projectName: {
    type: String,
    required: function () { return this.basicInfo != null; },
  },
  contactNo: {
    type: String,
    required: function () { return this.basicInfo != null; },
  },
  mahareraNo: {
    type: String,
    required: function () { return this.basicInfo != null; }
  },
  registrationDate: {
    type: Date,
    required: function () { return this.basicInfo != null; },
  },
  expiryDate: {
    type: Date,
    required: function () { return this.basicInfo != null; },
  },
  units: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Unit'
  }]
});

const estimationInfoSchema = new Schema({
  estimatedCost: {
    type: Number,
    required: function () { return this.estimationInfo != null; }
  },
  incurredCost: {
    type: Number,
    required: function () { return this.estimationInfo != null; }
  }
});


const SiteProgressSchema = new Schema({
  internalRoadsFootpaths: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  waterSupply: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  sewerage: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  stormWaterDrains: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  landscapingTreePlanting: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  streetLighting: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  communityBuildings: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  sewageTreatment: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  solidWasteManagement: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  waterConservation: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  energyManagement: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  fireProtection: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  electricalMeterRoom: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  }
}, { timestamps: true });


const ProjectSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  basicInfo: BasicInfoSchema,
  estimationInfo: estimationInfoSchema,
  siteProgress: SiteProgressSchema
}, { timestamps: true });

export default mongoose.model("Project", ProjectSchema);
