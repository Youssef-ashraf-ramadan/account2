import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TitleProvider } from './shared/hooks/TitleContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './shared/components/Layout';
import Login from './features/pages/Auth/Login';
import Register from './features/pages/Auth/Register';
import Profile from './features/pages/Profile/Profile';
import PrivateRoute from './shared/components/PrivateRoute';
import Home from './features/pages/Home/Home';
import Employees from './features/pages/Hr/employees/Employees';
import AddEmployee from './features/pages/Hr/employees/AddEmployee';
import EditEmployee from './features/pages/Hr/employees/EditEmployee';
import EmployeeDetails from './features/pages/Hr/employees/EmployeeDetails';
import Attendance from './features/pages/Hr/attendance/Attendance';
import Salaries from './features/pages/Hr/salaries/Salaries';
import AddSalary from './features/pages/Hr/salaries/AddSalary';
import EditSalary from './features/pages/Hr/salaries/EditSalary';
import Vacations from './features/pages/Hr/vacations/Vacations';
import AddVacation from './features/pages/Hr/vacations/AddVacation';
import EditVacation from './features/pages/Hr/vacations/EditVacation';
import VacationDetails from './features/pages/Hr/vacations/VacationDetails';
import LeaveRequests from './features/pages/Hr/leave-requests/LeaveRequests';
import AddLeaveRequest from './features/pages/Hr/leave-requests/AddLeaveRequest';
import EditLeaveRequest from './features/pages/Hr/leave-requests/EditLeaveRequest';
import LeaveRequestDetails from './features/pages/Hr/leave-requests/LeaveRequestDetails';
import SalaryDetails from './features/pages/Hr/salaries/SalaryDetails';
import Payslips from './features/pages/Hr/payslips/Payslips';
import PayslipDetails from './features/pages/Hr/payslips/PayslipDetails';
import GeneratePayslip from './features/pages/Hr/payslips/GeneratePayslip';
import PayrollReport from './features/pages/Hr/reports/PayrollReport';
import AttendanceReport from './features/pages/Hr/reports/AttendanceReport';
import LeaveReport from './features/pages/Hr/reports/LeaveReport';
import Shifts from './features/pages/Hr/shifts/Shifts';
import AddShift from './features/pages/Hr/shifts/AddShift';
import EditShift from './features/pages/Hr/shifts/EditShift';
import ShiftDetails from './features/pages/Hr/shifts/ShiftDetails';
import JobTitles from './features/pages/Hr/job-titles/JobTitles';
import AddJobTitle from './features/pages/Hr/job-titles/AddJobTitle';
import EditJobTitle from './features/pages/Hr/job-titles/EditJobTitle';
import JobTitleDetails from './features/pages/Hr/job-titles/JobTitleDetails';
import Departments from './features/pages/Hr/departments/Departments';
import AddDepartment from './features/pages/Hr/departments/AddDepartment';
import EditDepartment from './features/pages/Hr/departments/EditDepartment';
import DepartmentDetails from './features/pages/Hr/departments/DepartmentDetails';
import AccountsTree from './features/pages/Accounting/AccountsTree';
import CostCentersTree from './features/pages/Accounting/CostCentersTree';
import JournalEntries from './features/pages/Accounting/JournalEntries/JournalEntries';
import AddJournalEntry from './features/pages/Accounting/JournalEntries/AddJournalEntry';
import EditJournalEntry from './features/pages/Accounting/JournalEntries/EditJournalEntry';
import JournalEntryDetails from './features/pages/Accounting/JournalEntries/JournalEntryDetails';
import Currencies from './features/pages/Accounting/Currencies/Currencies';
import AddCurrency from './features/pages/Accounting/Currencies/AddCurrency';
import EditCurrency from './features/pages/Accounting/Currencies/EditCurrency';
import CurrencyDetails from './features/pages/Accounting/Currencies/CurrencyDetails';
import ExchangeRates from './features/pages/Accounting/ExchangeRates/ExchangeRates';
import AddExchangeRate from './features/pages/Accounting/ExchangeRates/AddExchangeRate';
import ExchangeRateDetails from './features/pages/Accounting/ExchangeRates/ExchangeRateDetails';
import Vendors from './features/pages/Accounting/Vendors/Vendors';
import AddVendor from './features/pages/Accounting/Vendors/AddVendor';
import EditVendor from './features/pages/Accounting/Vendors/EditVendor';
import VendorDetails from './features/pages/Accounting/Vendors/VendorDetails';
import Customers from './features/pages/Accounting/Customers/Customers';
import AddCustomer from './features/pages/Accounting/Customers/AddCustomer';
import EditCustomer from './features/pages/Accounting/Customers/EditCustomer';
import CustomerDetails from './features/pages/Accounting/Customers/CustomerDetails';
import Banks from './features/pages/Accounting/Banks/Banks';
import AddBank from './features/pages/Accounting/Banks/AddBank';
import EditBank from './features/pages/Accounting/Banks/EditBank';
import BankDetails from './features/pages/Accounting/Banks/BankDetails';
import Safes from './features/pages/Accounting/Safes/Safes';
import AddSafe from './features/pages/Accounting/Safes/AddSafe';
import EditSafe from './features/pages/Accounting/Safes/EditSafe';
import SafeDetails from './features/pages/Accounting/Safes/SafeDetails';
import AccountLinks from './features/pages/Accounting/AccountLinks/AccountLinks';

import './App.css';

function App() {
  const { i18n } = useTranslation();

  return (
    <TitleProvider>
      <Router>
        <div className="App" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          
            <Route path="/" element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }>
              <Route index element={<Home />} />
              {/* HR Routes */}
              <Route path="employees" element={<Employees />} />
              <Route path="add-employee" element={<AddEmployee />} />
              <Route path="employees/view/:id" element={<EmployeeDetails />} />
              <Route path="edit-employee/:id" element={<EditEmployee />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="salaries" element={<Salaries />} />
              <Route path="add-salary" element={<AddSalary />} />
              <Route path="edit-salary/:id" element={<EditSalary />} />
              <Route path="vacations" element={<Vacations />} />
              <Route path="vacations/add" element={<AddVacation />} />
              <Route path="vacations/edit/:id" element={<EditVacation />} />
              <Route path="vacations/details/:id" element={<VacationDetails />} />
            <Route path="leave-requests" element={<LeaveRequests />} />
            <Route path="leave-requests/add" element={<AddLeaveRequest />} />
            <Route path="leave-requests/edit/:id" element={<EditLeaveRequest />} />
            <Route path="leave-requests/details/:id" element={<LeaveRequestDetails />} />
            <Route path="salaries" element={<Salaries />} />
            <Route path="salaries/add" element={<AddSalary />} />
            <Route path="salaries/details/:id" element={<SalaryDetails />} />
            <Route path="payslips" element={<Payslips />} />
            <Route path="payslips/generate" element={<GeneratePayslip />} />
            <Route path="payslips/:id" element={<PayslipDetails />} />
              <Route path="shifts" element={<Shifts />} />
              <Route path="add-shift" element={<AddShift />} />
              <Route path="job-titles" element={<JobTitles />} />
              <Route path="add-job-title" element={<AddJobTitle />} />
              <Route path="job-titles/add" element={<AddJobTitle />} />
              <Route path="job-titles/edit/:id" element={<EditJobTitle />} />
              <Route path="job-titles/details/:id" element={<JobTitleDetails />} />
              <Route path="departments" element={<Departments />} />
              <Route path="departments/add" element={<AddDepartment />} />
              <Route path="departments/edit/:id" element={<EditDepartment />} />
              <Route path="departments/details/:id" element={<DepartmentDetails />} />
              <Route path="reports/payroll" element={<PayrollReport />} />
              <Route path="reports/attendance" element={<AttendanceReport />} />
              <Route path="reports/leave" element={<LeaveReport />} />
              <Route path="accounts/tree" element={<AccountsTree />} />
              <Route path="cost-centers/tree" element={<CostCentersTree />} />
              <Route path="journal-entries" element={<JournalEntries />} />
              <Route path="journal-entries/add" element={<AddJournalEntry />} />
              <Route path="journal-entries/edit/:id" element={<EditJournalEntry />} />
              <Route path="journal-entries/view/:id" element={<JournalEntryDetails />} />
              <Route path="currencies" element={<Currencies />} />
              <Route path="currencies/add" element={<AddCurrency />} />
              <Route path="currencies/edit/:id" element={<EditCurrency />} />
              <Route path="currencies/view/:id" element={<CurrencyDetails />} />
              <Route path="exchange-rates" element={<ExchangeRates />} />
              <Route path="exchange-rates/add" element={<AddExchangeRate />} />
              <Route path="exchange-rates/view/:id" element={<ExchangeRateDetails />} />
              <Route path="vendors" element={<Vendors />} />
              <Route path="vendors/add" element={<AddVendor />} />
              <Route path="vendors/edit/:id" element={<EditVendor />} />
              <Route path="vendors/view/:id" element={<VendorDetails />} />
              <Route path="customers" element={<Customers />} />
              <Route path="customers/add" element={<AddCustomer />} />
              <Route path="customers/edit/:id" element={<EditCustomer />} />
              <Route path="customers/view/:id" element={<CustomerDetails />} />
              <Route path="banks" element={<Banks />} />
              <Route path="banks/add" element={<AddBank />} />
              <Route path="banks/edit/:id" element={<EditBank />} />
              <Route path="banks/view/:id" element={<BankDetails />} />
              <Route path="safes" element={<Safes />} />
              <Route path="safes/add" element={<AddSafe />} />
              <Route path="safes/edit/:id" element={<EditSafe />} />
              <Route path="safes/view/:id" element={<SafeDetails />} />
              <Route path="account-links" element={<AccountLinks />} />

              <Route path="shifts" element={<Shifts />} />
              <Route path="shifts/add" element={<AddShift />} />
              <Route path="shifts/edit/:id" element={<EditShift />} />
              <Route path="shifts/details/:id" element={<ShiftDetails />} />

              <Route path="profile" element={<Profile />} />
              <Route path="positions" element={<JobTitles />} />
            </Route>
          </Routes>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={true}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Router>
    </TitleProvider>
  );
}

export default App;
