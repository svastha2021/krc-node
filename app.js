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
const { BusinessAction } = require('./lib/action/business_action');
const { ProductAction } = require('./lib/action/product_action');
const { BillingAction } = require('./lib/action/billing_action');
const { MasterAction } = require('./lib/action/master_action');
const { ConsultAction } = require('./lib/action/consulting_action');
var debug = require('debug')('v2:app:app');
var event = {
  stageVariables: {
    'env': process.env.ENV
  }
}

var userAction = new UserAction();
var doctorAction = new DoctorAction();
var patientAction = new PatientAction();
var appointmentAction = new AppointmentAction();
var businessAction = new BusinessAction();
var productAction = new ProductAction();
var billingAction = new BillingAction();
var masterAction = new MasterAction();
var consultAction = new ConsultAction();

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

app.get('/business/:org_id', function (req, res) {
  event.headers = req.headers;
  event.pathParameters = req.params;
  event.queryParameters = aqp(req.query);
  businessAction.GetBusiness(event, {
    done: function (rescode, resmsg) {
      res.header(resmsg.headers);
      res.status(resmsg.statusCode);
      res.send(resmsg.body)
    }
  })
})

app.get('/business/:org_id/:bu_id', function (req, res) {
  event.headers = req.headers;
  event.pathParameters = req.params;
  event.queryParameters = aqp(req.query);
  businessAction.GetBusinessDetail(event, {
    done: function (rescode, resmsg) {
      res.header(resmsg.headers);
      res.status(resmsg.statusCode);
      res.send(resmsg.body)
    }
  })
})

app.get('/products/:branch_id', function (req, res) {
  event.headers = req.headers;
  event.pathParameters = req.params;
  event.queryParameters = aqp(req.query);
  productAction.GetProducts(event, {
    done: function (rescode, resmsg) {
      res.header(resmsg.headers);
      res.status(resmsg.statusCode);
      res.send(resmsg.body)
    }
  })
})

app.get('/productsorg/:org_id', function (req, res) {
  event.headers = req.headers;
  event.pathParameters = req.params;
  event.queryParameters = aqp(req.query);
  productAction.GetProductsOrgId(event, {
    done: function (rescode, resmsg) {
      res.header(resmsg.headers);
      res.status(resmsg.statusCode);
      res.send(resmsg.body)
    }
  })
})

app.get('/product/:product_id', function (req, res) {
  event.headers = req.headers;
  event.pathParameters = req.params;
  event.queryParameters = aqp(req.query);
  productAction.GetProductDetail(event, {
    done: function (rescode, resmsg) {
      res.header(resmsg.headers);
      res.status(resmsg.statusCode);
      res.send(resmsg.body)
    }
  })
})

app.post('/billing', function (req, res) {
  event.headers = req.headers;
  event.body = req.body;
  event.queryParameters = aqp(req.query);
  billingAction.CreateBilling(event, {
    done: function (rescode, resmsg) {
      res.header(resmsg.headers);
      res.status(resmsg.statusCode);
      res.send(resmsg.body)
    }
  })
})

app.get('/billings/:branch_id', function (req, res){
  event.header = req.headers;
  event.body = req.body;
  event.pathParameters = req.params;
  event.queryParameters = aqp(req.query);
  billingAction.GetBillingListsByBranchId(event, {
    done: function (rescode, resmsg) {
      res.header(resmsg.headers);
      res.status(resmsg.statusCode);
      res.send(resmsg.body)
    }
  })  
})

app.get('/billingsorg/:org_id', function (req, res){
  event.header = req.headers;
  event.body = req.body;
  event.pathParameters = req.params;
  event.queryParameters = aqp(req.query);
  billingAction.GetBillingListsByOrgId(event, {
    done: function (rescode, resmsg) {
      res.header(resmsg.headers);
      res.status(resmsg.statusCode);
      res.send(resmsg.body)
    }
  })  
})

app.get('/billing/:invoice_no', function (req, res){
  event.header = req.headers;
  event.body = req.body;
  event.pathParameters = req.params;
  event.queryParameters = aqp(req.query);
  billingAction.GetBillingDetail(event, {
    done: function (rescode, resmsg) {
      res.header(resmsg.headers);
      res.status(resmsg.statusCode);
      res.send(resmsg.body)
    }
  })  
})

app.get('/patientheader/:patient_id', function (req, res){
  event.header = req.headers;
  event.body = req.body;
  event.pathParameters = req.params;
  event.queryParameters = aqp(req.query);
  billingAction.GetPatientHeaderDetail(event, {
    done: function (rescode, resmsg) {
      res.header(resmsg.headers);
      res.status(resmsg.statusCode);
      res.send(resmsg.body)
    }
  })  
})

app.get('/references/:ref_type', function (req, res){
  event.header = req.headers;
  event.pathParameters = req.params;
  event.queryParameters = aqp(req.query);
  masterAction.GetReferenceList(event, {
    done: function (rescode, resmsg) {
      res.header(resmsg.headers);
      res.status(resmsg.statusCode);
      res.send(resmsg.body)
    }
  })  
})

app.post('/paymentcreation', function (req, res){
  event.header = req.headers;
  event.pathParameters = req.params;
  event.queryParameters = aqp(req.query);
  event.body = req.body;
  billingAction.CreatePaymentsDetail(event, {
    done: function (rescode, resmsg) {
      res.header(resmsg.headers);
      res.status(resmsg.statusCode);
      res.send(resmsg.body)
    }
  })  
})

app.put('/cancelbilling', function (req, res) {
  event.headers = req.headers;
  event.body = req.body;
  event.pathParameters = req.params;
  event.queryParameters = aqp(req.query);
  billingAction.UpdateBilling(event, {
    done: function (rescode, resmsg) {
      res.header(resmsg.headers);
      res.status(resmsg.statusCode);
      res.send(resmsg.body)
    }
  })
})

app.put('/cancelbillingdtl', function (req, res) {
  event.headers = req.headers;
  event.body = req.body;
  event.pathParameters = req.params;
  event.queryParameters = aqp(req.query);
  billingAction.UpdateBillingdtl(event, {
    done: function (rescode, resmsg) {
      res.header(resmsg.headers);
      res.status(resmsg.statusCode);
      res.send(resmsg.body)
    }
  })
})

app.post('/consulting', function (req, res) {
  event.headers = req.headers;
  event.body = req.body;
  event.queryParameters = aqp(req.query);
  consultAction.CreateConsulting(event, {
    done: function (rescode, resmsg) {
      res.header(resmsg.headers);
      res.status(resmsg.statusCode);
      res.send(resmsg.body)
    }
  })
})

app.post('/dialysisconsulting', function (req, res) {
  event.headers = req.headers;
  event.body = req.body;
  event.queryParameters = aqp(req.query);
  consultAction.CreateDialysisConsulting(event, {
    done: function (rescode, resmsg) {
      res.header(resmsg.headers);
      res.status(resmsg.statusCode);
      res.send(resmsg.body)
    }
  })
})

app.get('/consult/:branch_id', function (req, res){
  event.header = req.headers;
  event.body = req.body;
  event.pathParameters = req.params;
  event.queryParameters = aqp(req.query);
  consultAction.GetConsultingListsByBranchId(event, {
    done: function (rescode, resmsg) {
      res.header(resmsg.headers);
      res.status(resmsg.statusCode);
      res.send(resmsg.body)
    }
  })  
})

app.get('/consultorg/:org_id', function (req, res){
  event.header = req.headers;
  event.body = req.body;
  event.pathParameters = req.params;
  event.queryParameters = aqp(req.query);
  consultAction.GetConsultingListsByOrgId(event, {
    done: function (rescode, resmsg) {
      res.header(resmsg.headers);
      res.status(resmsg.statusCode);
      res.send(resmsg.body)
    }
  })  
})

app.get('/consultdetail/:visit_no', function (req, res){
  event.header = req.headers;
  event.body = req.body;
  event.pathParameters = req.params;
  event.queryParameters = aqp(req.query);
  consultAction.GetConsultingDetail(event, {
    done: function (rescode, resmsg) {
      res.header(resmsg.headers);
      res.status(resmsg.statusCode);
      res.send(resmsg.body)
    }
  })  
})

app.get('/labtests', function (req, res){
  event.header = req.headers;
  event.queryParameters = aqp(req.query);
  masterAction.LabTestList(event, {
    done: function (rescode, resmsg) {
      res.header(resmsg.headers);
      res.status(resmsg.statusCode);
      res.send(resmsg.body)
    }
  })  
})

module.exports = app;