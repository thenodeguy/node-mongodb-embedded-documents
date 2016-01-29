'use strict';

const mongoose = require('mongoose');
const dbConfig = require('./configs/db');
const Employee = require('./models/employee');

mongoose.connect(dbConfig.url);

// Close the database connection when Node process ends.
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    process.exit(0);
  });
});

var promise = new Promise((resolve, reject) => {
  
  // Clear the local.Employee collection.
  Employee.remove({}, (err) => {
    if (err) {
      reject(err);
      return;
    }
    
    resolve();
  });
})
.then(() => {

  // Persist new Employee document.  
  return new Promise((resolve, reject) => {

    var date1 = new Date();
    var date2 = new Date();
    date2.setDate(date1.getDate() + 1);

    var flexitime1 = {
      date: date1, 
      duration: 60, 
      note: 'Started work one hour early on 1/1/2016',
    };
    var flexitime2 = {
      date: date2, 
      duration: 30, 
      note: 'Started work half an hour early on 2/1/2016',
    };

    var employee = new Employee();
    employee.email = 'root@localhost';
    employee.firstname = 'Benjamin';
    employee.lastname = 'Vickers';
    employee.flexitimeaccrued.push(flexitime1);
    employee.flexitimeaccrued.push(flexitime2);
    employee.isactive = true;
    
    employee.save((err) => {
      if (err) {
        reject(err);
        return;
      }
    
      console.log('Document created successfully.');
      resolve(employee._id);
    });
  });
})
.then((employeeId) => {

  // Update the new Employee document.
  return new Promise((resolve, reject) => {
  
    Employee.findById(employeeId, (err, employee) => {
      if (err) {
        reject(err);
        return;
      }
      
      // Insert another embedded document.
      var date = new Date();
      date.setDate(date.getDate() + 2);
      
      var flexitime3 = {
        date: date, 
        duration: 120,
        note: 'Early start on 3/1/2016',
      };
      
      employee.flexitimeaccrued.push(flexitime3);
      employee.save(function(err) {
        if (err) {
          reject(err);
          return;
        }
        
        console.log('Document updated successfully.');
        resolve(employee.flexitimeaccrued[0]._id);
      });
    });
  });
})
.then((flexitimeId) => {

  // Search for an embedded document using it's id.
  return new Promise((resolve, reject) => {
    Employee.findOne(
      { 'flexitimeaccrued._id': flexitimeId },
      (err, employee) => {
        if (err) {
          reject(err);
          return;
        }
        
        // The encapsulating Employe has been found.
        resolve(employee);
      });
  });
})
.then((employee) => {
  
  // Delete an embedded document.
  return new Promise((resolve, reject) => {

    employee.flexitimeaccrued[0].remove();
    employee.save((err) => {
      if (err) {
        reject(err);
        return;
      }
      
      // Finished.
      console.log('Press Ctrl-C to end...');
      resolve();
    });
  });
})
.catch((err) => {
  console.log('An error occured: ' + err);
});

