# HR_Management

# APIs for HR Management

 POST Req    /hr/login --> HR login <br />
 POST Req    /employee/login --> Employee Login<br />
 POST Req    /hr/:hrId/add-employee --> To add an employee<br />
 GET  Req    /hr/:hrId/employees --> To see all the employees under a particular HR<br />
 GET  Req    /hr/:hrId/employees/:empId --> To see a particular employee under a particular HR<br />
 POST Req    /employee/:empId/create-leave-req  --> To apply for leave request to your HR<br />
 GET  Req    /hr/:hrId/leave-reqs --> To see all the leave requests which are neither approved or rejected<br />
 POST Req    /employee/:empId/create-loan-req --> To apply for loan request to your HR<br />
 GET  Req    /hr/:hrId/loan-reqs --> To see all the loan requests which are neither approved or rejected<br />
 POST Req    /employee/:empId/create-bonus-req --> To request for bonus to your HR<br />
 GET  Req    /hr/:hrId/bonus-reqs --> To see all the bonus requests which are neither approved or rejected<br />

