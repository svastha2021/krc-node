const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({origin:'*'}));
const aqp = require('api-query-params');
const { UserAction } = require('./lib/action/user_action');
const { DoctorAction } = require('./lib/action/doctor_action');
const { PatientAction } = require('./lib/action/patient_action');
const { AppointmentAction } = require('./lib/action/appointment_action');
var debug = require('debug')('v2:users:app');
var event = {
  stageVariables: {
    'env': process.env.ENV
  }
}

var userAction = new UserAction();
var doctorAction = new DoctorAction();
var patientAction = new PatientAction();
var appointmentAction = new AppointmentAction();

app.post('/login', function (req, res) {
  event.headers = req.headers;
  event.body = req.body;
  event.queryParameters = aqp(req.query);
  userAction.getUserLogin(event, {
    done: function (rescode, resmsg) {
      res.header(resmsg.headers);
      res.status(resmsg.statusCode);
      res.send(resmsg.body)
    }
  })
})

app.post('/createpatient', function (req, res) {
  event.headers = req.headers;
  event.body = req.body;
  event.queryParameters = aqp(req.query);
  patientAction.CreatePatients(event, {
    done: function (rescode, resmsg) {
      res.header(resmsg.headers);
      res.status(resmsg.statusCode);
      res.send(resmsg.body)
    }
  })
})

app.put('/updatepatient/:patient_id', function (req, res) {
  event.headers = req.headers;
  event.body = req.body;
  event.pathParameters = req.params;
  event.queryParameters = aqp(req.query);
  patientAction.UpdatePatient(event, {
    done: function (rescode, resmsg) {
      res.header(resmsg.headers);
      res.status(resmsg.statusCode);
      res.send(resmsg.body)
    }
  })
})

app.get('/patients/:branch_id', function (req, res) {
  event.headers = req.headers;
  event.pathParameters = req.params;
  event.queryParameters = aqp(req.query);
  patientAction.GetPatients(event, {
    done: function (rescode, resmsg) {
      res.header(resmsg.headers);
      res.status(resmsg.statusCode);
      res.send(resmsg.body)
    }
  })
})

app.post('/bookappointments', function (req, res) {
  event.headers = req.headers;
  event.body = req.body;
  event.queryParameters = aqp(req.query);
  appointmentAction.BookAppointments(event, {
    done: function (rescode, resmsg) {
      res.header(resmsg.headers);
      res.status(resmsg.statusCode);
      res.send(resmsg.body)
    }
  })
})

app.put('/updateappointment/:appoint_id', function (req, res) {
  event.headers = req.headers;
  event.body = req.body;
  event.pathParameters = req.params;
  event.queryParameters = aqp(req.query);
  appointmentAction.UpdateAppointment(event, {
    done: function (rescode, resmsg) {
      res.header(resmsg.headers);
      res.status(resmsg.statusCode);
      res.send(resmsg.body)
    }
  })
})

app.get('/appointments/:branch_id', function (req, res){
  event.header = req.headers;
  event.body = req.body;
  event.pathParameters = req.params;
  event.queryParameters = aqp(req.query);
  appointmentAction.GetAppointments(event, {
    done: function (rescode, resmsg) {
      res.header(resmsg.headers);
      res.status(resmsg.statusCode);
      res.send(resmsg.body)
    }
  })  
})

app.get('/appointment/:appointment_id', function (req, res){
  event.header = req.headers;
  event.body = req.body;
  event.pathParameters = req.params;
  event.queryParameters = aqp(req.query);
  appointmentAction.GetAppointment(event, {
    done: function (rescode, resmsg) {
      res.header(resmsg.headers);
      res.status(resmsg.statusCode);
      res.send(resmsg.body)
    }
  })  
})

app.get('/doctor/:doctor_id', function (req, res) {
  event.headers = req.headers;
  event.pathParameters = req.params;
  event.queryParameters = aqp(req.query);
  doctorAction.GetDoctorDetail(event, {
    done: function (rescode, resmsg) {
      res.header(resmsg.headers);
      res.status(resmsg.statusCode);
      res.send(resmsg.body)
    }
  })
})

app.get('/doctors/:branch_id', function (req, res) {
  event.headers = req.headers;
  event.pathParameters = req.params;
  event.queryParameters = aqp(req.query);
  doctorAction.GetDoctors(event, {
    done: function (rescode, resmsg) {
      res.header(resmsg.headers);
      res.status(resmsg.statusCode);
      res.send(resmsg.body)
    }
  })
})

module.exports = app;