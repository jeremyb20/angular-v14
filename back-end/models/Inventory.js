const { Schema, model } = require('mongoose');

const inventorySchema = new Schema({
  nombreProducto: {type: String, required:true},
  marca: {type: String, required:true},
  tamanno: {type: String, required:true},
  peso: {type: String, required:true},
  precio: {type: String, required:true},
  cantidadInventario: {type: String, required:true},
  descripcion: {type: String, required:true},
  image: {type: String, required:true},
  image_id: {type: String, required:true},
},{
  timestamps: true,
  versionKey: false
});

module.exports = model("Inventory", inventorySchema);

