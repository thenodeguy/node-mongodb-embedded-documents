'use strict';

var mongoose = require('mongoose');
var dbConfig = require('./configs/db');
var Employee = require('./models/employee');


mongoose.connect(dbConfig.url);

// Close the database connection when Node process ends.
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    process.exit(0);
  });
});


var promise = new Promise(function(resolve, reject) {
  
  // Clear the local.Employee collection.
  Employee.remove({}, function(err) {
    if(err) {
      reject(err);
      return;
    }
    
    resolve();
  });
})
.then(function() {

  // Persist new Employee document.  
  return new Promise(function(resolve, reject) {

    var date1 = new Date();
    var date2 = new Date();
    date2.setDate(date1.getDate() + 1);

    var flexitime1 = {"date":date1, "duration":"60", "note":"Started work one hour early on 1/1/2016"};
    var flexitime2 = {"date":date2, "duration":"30", "note":"Started work half an hour early on 2/1/2016"};

    var employee = new Employee();
    employee.email = 'root@localhost';
    employee.firstname = 'Benjamin';
    employee.lastname = 'Vickers';
    employee.flexitimeaccrued.push(flexitime1);
    employee.flexitimeaccrued.push(flexitime2);
    employee.isactive = true;
    
    employee.save(function(err) {
      if(err) {
        reject(err);
        return;
      }
    
      console.log('Document created successfully.');
      resolve(employee._id);
    });
  });
})
.then(function(employeeId) {

  // Update the new Employee document.
  return new Promise(function(resolve, reject) {
  
    Employee.findById(employeeId, function(err, employee) {
      if(err) {
        reject(err);
        return;
      }
      
      // Insert another embedded document.
      var date = new Date();
      date.setDate(date.getDate() + 2);
      
      var flexitime3 = {"date":date, "duration":"120", "note":"Early start on 3/1/2016"};
      
      employee.flexitimeaccrued.push(flexitime3);
      employee.save(function(err) {
        if(err) {
          reject(err);
          return;
        }
        
        console.log('Document updated successfully.');
        resolve(employee.flexitimeaccrued[0]._id);
      });
    });
  });
})
.then(function(flexitimeId) {

  // Search for an embedded document using it's id.
  return new Promise(function(resolve, reject) {
    Employee.findOne({ 'flexitimeaccrued._id': flexitimeId }, function(err, employee) {
      if(err) {
        reject(err);
        return;
      }
      
      // The encapsulating Employe has been found.
      resolve(employee);
    });
  });
})
.then(function(employee) {
  
  // Delete an embedded document.
  return new Promise(function(resolve, reject) {

    employee.flexitimeaccrued[0].remove();
    employee.save(function(err) {
      if(err) {
        reject(err);
        return;
      }
      
      // Finished.
      console.log('Press Ctrl-C to end...');
      resolve();
    });
  });
})
.catch(function(err) {

  console.log('An error occured: ' + err);
});





