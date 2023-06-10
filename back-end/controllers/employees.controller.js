const employeeCtl = {}

const Employee = require('../models/Employee')

employeeCtl.getEmployees = async ( _req,res )=> {
  const employees = await Employee.find()
  res.send({listaEmpleados: employees, success: true});
}

employeeCtl.createEmployee = async( req,res )=> {
  const newEmployee = new Employee(req.body);
  await newEmployee.save();
  res.send({message: 'Empleado creado', success: true});
}

employeeCtl.getEmployee = async ( req,res )=> {
  const employee =  await Employee.findById(req.params.id);
  res.send({empleado: employee, success: true});

}
employeeCtl.editEmployee = async ( req,res )=> {
  await Employee.findByIdAndUpdate(req.params.id, req.body);
  res.send({message: 'Empleado actualizado', success: true});
}

employeeCtl.deleteEmployee = async( req,res )=> {
  await Employee.findByIdAndDelete(req.params.id);
  res.send({message: 'Empleado eliminado', success: true});

}

module.exports = employeeCtl;
