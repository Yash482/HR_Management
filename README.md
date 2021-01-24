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
PUT Req      /hr/:hrId/employees/:empId/edit --> To update employee details like team, salary etc.<br/>
 POST  Req    /hr/:hrId/loan-reqs/:loanId/:status --> Respond to loan request<br />
 POST  Req    /hr/:hrId/leave-reqs/:leaveId/:status --> Respond to leave request<br />
 POST  Req    /hr/:hrId/bonus-reqs/:bonusId/:status --> Respond to bonus request<br />
 POST  Req    /hr/:hrId/open-attendance --> Open the attendance form and mark everyone absent at start.<br />
 POST  Req    /employee/:empId/mark-attendance --> Mark your attendance<br />
 GET  Req    /hr/:hrId/get-specific-attendance --> Get attendance of all the employees on a particular day<br />
 GET  Req    /hr/:hrId/employees/:empId/get-attendance --> Get attendance of a particular month of any employee<br />
 GET  Req    /employee/:empId/leave-reqs --> Get leave requests<br />
 GET  Req    /employee/:empId/loan-reqs --> Get loan requests<br />
 GET  Req    /employee/:empId/bonus-reqs --> Get bonus requests<br />

