module.exports = (sequelize, DataTypes) => {
  const Business = sequelize.define(
      'Business',
      {
        businessName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        natureOfBusiness: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        businessEmail: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        businessAddress: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        businessType: {
          type: DataTypes.ENUM,
          values: ['LLC', 'sole proprietorship', 'unregistered'],
          allowNull: false,
        },
        regNum: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        cacCertURL: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 'https://www.seekpng.com/png/full/332-3320905_shadow-768x364-light-gray-gradient-background.png',
          validate: {
            isUrl: true,
          },
        },
        formCO7: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 'https://www.seekpng.com/png/full/332-3320905_shadow-768x364-light-gray-gradient-background.png',
          validate: {
            isUrl: true,
          },
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
  );
  Business.associate = (models) => {
    Business.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
      },
    });
    Business.hasOne(models.Store, {
      foreignKey: {
        name: 'businessId',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  };

  return Business;
};
