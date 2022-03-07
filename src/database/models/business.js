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
        cacCertURL: {
          type: DataTypes.STRING,
          allowNull: true,
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
  };

  return Business;
};
