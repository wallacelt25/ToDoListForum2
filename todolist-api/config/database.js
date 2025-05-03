// config/database.js
// Custom Sequelize adapter for MongoDB
const mongoose = require('mongoose');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Create a custom MongoDB dialect adapter
class MongoDBDialect {
  constructor() {
    this.mongoose = mongoose;
    this.connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true
    };
  }

  async connect(uri) {
    try {
      await this.mongoose.connect(uri, this.connectionOptions);
      console.log('MongoDB connected via adapter');
      return true;
    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }
}

// Custom Sequelize MongoDB adapter
class SequelizeMongoDB extends Sequelize {
  constructor(uri, options = {}) {
    super('mongodb', null, null, {
      dialect: 'mysql', // We're hijacking the MySQL dialect as a base
      logging: options.logging || false,
      ...options
    });
    
    this.uri = uri;
    this.mongoDialect = new MongoDBDialect();
    this.models = {};
  }

  async authenticate() {
    return await this.mongoDialect.connect(this.uri);
  }

  define(modelName, attributes, options = {}) {
    // Create mongoose schema from sequelize attributes
    const schemaDefinition = {};
    
    Object.entries(attributes).forEach(([field, config]) => {
      if (config.type === DataTypes.STRING) {
        schemaDefinition[field] = { type: String };
      } else if (config.type === DataTypes.INTEGER) {
        schemaDefinition[field] = { type: Number };
      } else if (config.type === DataTypes.BOOLEAN) {
        schemaDefinition[field] = { type: Boolean };
      } else if (config.type === DataTypes.DATE) {
        schemaDefinition[field] = { type: Date };
      }
      
      // Handle other options
      if (config.primaryKey) {
        schemaDefinition[field].unique = true;
      }
      if (config.allowNull === false) {
        schemaDefinition[field].required = true;
      }
      if (config.unique) {
        schemaDefinition[field].unique = true;
      }
    });
    
    // Create mongoose schema and model
    const schema = new mongoose.Schema(schemaDefinition, {
      timestamps: true, // This will add createdAt and updatedAt fields
      ...options
    });
    
    // Create mongoose model
    const MongooseModel = mongoose.model(modelName, schema);
    
    // Create sequelize-like model interface
    const model = {
      create: async (data) => {
        const instance = new MongooseModel(data);
        await instance.save();
        return instance;
      },
      findAll: async (query = {}) => {
        const where = query.where || {};
        const order = query.order || [];
        
        // Convert sequelize where to mongoose query
        let mongoQuery = MongooseModel.find(where);
        
        // Handle ordering
        if (order.length > 0) {
          const sort = {};
          order.forEach(([field, direction]) => {
            sort[field] = direction === 'DESC' ? -1 : 1;
          });
          mongoQuery = mongoQuery.sort(sort);
        }
        
        return await mongoQuery.exec();
      },
      findOne: async (query = {}) => {
        const where = query.where || {};
        return await MongooseModel.findOne(where).exec();
      },
      update: async (data, query = {}) => {
        const where = query.where || {};
        return await MongooseModel.updateMany(where, { $set: data }).exec();
      },
      destroy: async (query = {}) => {
        const where = query.where || {};
        return await MongooseModel.deleteMany(where).exec();
      }
    };
    
    // Store the model in the models object
    this.models[modelName] = model;
    
    return model;
  }

  async sync() {
    // MongoDB doesn't need explicit syncing as collections are created on demand
    return true;
  }
}

// Export custom MongoDB adapter class and DataTypes
const sequelize = new SequelizeMongoDB(process.env.MONGO_URI);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { 
  sequelize, 
  connectDB,
  DataTypes 
};