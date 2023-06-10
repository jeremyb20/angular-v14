const inventoryCtl = {}

const Inventory = require('../models/Inventory');
const cloudinary = require('./../cloudinary.config');
const fs = require('fs-extra');
const moment = require('moment');

inventoryCtl.getAllInventory = async ( _req,res )=> {
  const inventory = await Inventory.find();
  if(inventory.length == 0){
    res.json({ success: false, message: 'No hay lista de inventarios disponibles'});
  }else{
    res.json({listaInventarios: inventory, success: true});
  }

}

inventoryCtl.createInventory = async( req, res, next ) => {
  const {nombreProducto, tamanno, marca, peso, precio, cantidadInventario, descripcion} = req.body;
  try {
    const result = await cloudinary.uploader.upload((req.file != undefined) ? req.file.path: req.body.image, {folder: "inventory"});
    let inventory = new Inventory({
      nombreProducto,
      tamanno,
      marca,
      peso,
      precio,
      cantidadInventario,
      descripcion,
      image: result.secure_url,
      image_id: result.public_id
    });
    await inventory.save();
    await fs.unlink(req.file.path);
    res.send({message: 'Inventario creado', success: true});
  } catch (err) {
    res.json({success: false, message: 'Hubo un error en el registro, intentelo mas tarde..!'});
    next(err);
  }
}

inventoryCtl.getInventoryById = async ( req,res )=> {
  const inventoryInfo =  await Inventory.findById(req.query.id);
  if(inventoryInfo){
    res.send({success: true, productInfo: inventoryInfo});
  }else{
    res.send({success: false, productInfo: [], mesaje: 'El producto que estas leyendo no esta en la lista'});
  }

}
inventoryCtl.editInventory = async ( req,res )=> {
  const {nombreProducto, tamanno, marca, peso, precio, cantidadInventario, descripcion} = req.body;
  try {
    const result = await cloudinary.uploader.upload((req.file != undefined) ? req.file.path: req.body.image, {folder: "inventory"});
    const updateInventory = await Inventory.findByIdAndUpdate(req.body.id,{
      nombreProducto,
      tamanno,
      marca,
      peso,
      precio,
      cantidadInventario,
      descripcion,
      image: result.secure_url,
      image_id: result.public_id
    });
    await cloudinary.uploader.destroy(updateInventory.image_id);
    await fs.unlink(req.file.path);
    res.send({message: 'Inventario actualizado', success: true});
  } catch (err) {
    res.json({success: false, message: 'Hubo un error en el registro, intentelo mas tarde..!'});
    next(err);
  }
}

inventoryCtl.deleteInventory = async( req,res )=> {
  const photo = await Inventory.findByIdAndDelete(req.query.id);
  await cloudinary.uploader.destroy(photo.image_id);
  res.send({success: true, message: 'Inventario eliminado'});
}

module.exports = inventoryCtl;
