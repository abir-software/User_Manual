// data.js - data handling for system requirements manual
// Data structure from requirements document
const requirementsData = [
    {
        module: "1 Human Resource Management (HR) Module",
        submodules: [
            {
                name: "1.1 Employee Management",
                requirements: [
                    { code: "REQ-HR-001", title: "The system shall provide Employee Dashboards." },
                    { code: "REQ-HR-002", title: "The system shall support Employee Profile Management." },
                    { code: "REQ-HR-003", title: "The system shall allow for the attachment of joining letters and other employee-specific letters within the employee profile/portal." },
                    { code: "REQ-HR-004", title: "The system shall support employee joining and departure management." },
                    { code: "REQ-HR-005", title: "The system shall support Employee Office Item Requisitions." }
                ]
            },
            {
                name: "1.2 Leave Management",
                requirements: [
                    { code: "REQ-HR-006", title: "The system shall support Employee Leave Management based on company leave policy." },
                    { code: "REQ-HR-007", title: "The system shall implement a three-level leave approval workflow: Employee Leave Application > Approved by Dept. Head > Approved by HR Head. 1. Supervisor>HR> GM (Normal Employees) 2. HR> MD (Top management)" }
                ]
            },
            {
                name: "1.3 Attendance Management",
                requirements: [
                    { code: "REQ-HR-008", title: "The system shall support eAttendance. Both biometric and system check-in attendance reports will be prepared." },
                    { code: "REQ-HR-009", title: "The system shall integrate with the biometric machine for office attendance." },
                    { code: "REQ-HR-010", title: "The system shall allow multiple check-in/out with location tracking for field employees (sales or fieldwork)." }
                ]
            },
            {
                name: "1.4 Employee Expense Management",
                requirements: [
                    { code: "REQ-HR-011", title: "The system shall facilitate TA/DA (Travel Allowance/Daily Allowance) entry." },
                    { code: "REQ-HR-012", title: "The system shall manage tour expenses and approval for payment." }
                ]
            },
            {
                name: "1.5 Payroll & Approvals",
                requirements: [
                    { code: "REQ-HR-013", title: "The system shall include a Payroll Management System based on company payroll structure." },
                    { code: "REQ-HR-014", title: "The system shall support management approval before salary disbursement." }
                ]
            }
        ]
    },
    {
        module: "2. Purchase Management Module",
        submodules: [
            {
                name: "2.1 Purchase Request (PR) Management",
                requirements: [
                    { code: "REQ-PUR-001", title: "The system shall allow authorized users to create material purchase requests." },
                    { code: "REQ-PUR-002", title: "The system shall support multi-level approval workflows for purchase requests, configurable based on purchase type and value." },
                    { code: "REQ-PUR-003", title: "The system shall display the available quantity of items when creating a purchase request." }
                ]
            },
            {
                name: "2.2 Purchase Order (PO) Management",
                requirements: [
                    { code: "REQ-PUR-004", title: "The system shall facilitate the creation of Requests for Quotation (RFQs)." },
                    { code: "REQ-PUR-005", title: "The system shall allow the generation of Purchase Orders (POs) based on approved RFQs or direct requests." },
                    { code: "REQ-PUR-006", title: "The system shall support approval layers for purchase orders, with mandatory MD approval for both import and local purchases." }
                ]
            },
            {
                name: "2.3 Import Purchase Flow Specifics",
                requirements: [
                    { code: "REQ-PUR-007", title: "The system shall record details of Purchase Invoices (PIs) submitted by foreign suppliers." },
                    { code: "REQ-PUR-008", title: "The system shall support recording and tracking of Letter of Credit (LC) opening details from the bank." },
                    { code: "REQ-PUR-009", title: "The system shall facilitate the calculation of Landed Cost, incorporating all associated import expenses (e.g., customs, freight, duties)." },
                    { code: "REQ-PUR-010", title: "The system shall allow entry of product and cost details upon receipt of imported goods." },
                    { code: "REQ-PUR-011", title: "The system shall track payments made to banks for import LCs." }
                ]
            },
            {
                name: "2.4 General Purchase Features",
                requirements: [
                    { code: "REQ-PUR-012", title: "The system shall generate Item Receive Reports." },
                    { code: "REQ-PUR-013", title: "The system shall allow recording of Purchase Invoices." },
                    { code: "REQ-PUR-014", title: "The system shall maintain a comprehensive database of Vendor Details." },
                    { code: "REQ-PUR-015", title: "The system shall maintain a comprehensive database of Product Details relevant to purchases." }
                ]
            }
        ]
    },
    {
        module: "3. Inventory Management Module",
        submodules: [
            {
                name: "Inventory Management",
                requirements: [
                    { code: "REQ-INV-001", title: "The system shall support Stock Replenishment and Stock Transfers." },
                    { code: "REQ-INV-002", title: "The system shall support Batch Transfers and Inventory Adjustments." },
                    { code: "REQ-INV-003", title: "The system shall support Scrap Order creation and processing." },
                    { code: "REQ-INV-004", title: "The system shall maintain detailed Product master data, including Product Brand, Lots/Serial Numbers, and Pack Size (tracked at lot/serial level)." },
                    { code: "REQ-INV-005", title: "The system shall allow for expiry date entry for reagents and trigger alerts before expiry." },
                    { code: "REQ-INV-006", title: "The system shall support three distinct warehouse locations and track inventory within each." },
                    { code: "REQ-INV-007", title: "The system shall generate comprehensive inventory reports, including the Movement Report and the Valuation Report." }
                ]
            }
        ]
    },
    {
        module: "4. Sales & Distribution Order Management Module",
        submodules: [
            {
                name: "4.1 Sales Workflow",
                requirements: [
                    { code: "REQ-SAL-001", title: "The system shall support the creation of Sales Quotations." },
                    { code: "REQ-SAL-002", title: "The system shall include a \"Prepared by\" field on quotations to identify the preparer in the quotation." },
                    { code: "REQ-SAL-003", title: "The system shall implement an approval layer for quotations before sending to customers." },
                    { code: "REQ-SAL-004", title: "The system shall allow for the creation of separate price lists for customers and distributors." },
                    { code: "REQ-SAL-005", title: "The system shall allow sales orders to be created based on client confirmation and stock availability." },
                    { code: "REQ-SAL-006", title: "The system shall support the creation of Invoices." },
                    { code: "REQ-SAL-007", title: "The system shall track Product Delivery status." },
                    { code: "REQ-SAL-008", title: "The system shall manage Payment Received with options for cash, credit, and multiple partial payments (referred to as EMI)." },
                    { code: "REQ-SAL-009", title: "Salespersons shall be able to collect POs or order confirmations from clients, and sales admin shall create sales orders in the system." }
                ]
            },
            {
                name: "4.2 Sales Features",
                requirements: [
                    { code: "REQ-SAL-010", title: "The system shall support Sales Return and Replacement options." },
                    { code: "REQ-SAL-011", title: "The system shall provide a Customer Credit Report./Partner Leadger." },
                    { code: "REQ-SAL-012", title: "The system shall manage cases where free analyzer machines are provided as samples (with agreed increased reagent prices), ensuring machine ownership remains with Modern Biotech." },
                    { code: "REQ-SAL-013", title: "The system shall allow for soft copy attachment of agreements for each customer." },
                    { code: "REQ-SAL-014", title: "The system shall manage multiple partial payments (EMI) for sales agreements." },
                    { code: "REQ-SAL-015", title: "The system shall generate Sales Reports, Sales Return Reports, Item Issue Register Reports, and Sales Analysis." }
                ]
            }
        ]
    },
    {
        module: "5. Warranty and Servicing Management Module",
        submodules: [
            {
                name: "Warranty and Servicing",
                requirements: [
                    { code: "REQ-SVC-001", title: "The system shall support Warranty Validation for products." },
                    { code: "REQ-SVC-002", title: "The system shall allow Service Engineer Assignment for service requests." },
                    { code: "REQ-SVC-003", title: "The system shall record Problem and Servicing Details." },
                    { code: "REQ-SVC-004", title: "The system shall maintain Product-wise Servicing History." },
                    { code: "REQ-SVC-005", title: "The system shall manage Service Parts Invoicing and Payment Collection." },
                    { code: "REQ-SVC-006", title: "The system shall manage free warranty product servicing, including free parts replacement based on the sales agreement." },
                    { code: "REQ-SVC-007", title: "The system shall support post-warranty servicing where no machinery service charge applies, but parts/equipment will be charged/invoiced." }
                ]
            }
        ]
    },
    {
        module: "6. Accounting Management Module",
        submodules: [
            {
                name: "6.1 Reporting",
                requirements: [
                    { code: "REQ-ACC-001", title: "The system shall generate comprehensive accounting reports, including Received and Payment Report, Balance Sheet, Profit & Loss Report, Cash Book/Bank Book, Trial Balance, Partner Ledger, General Ledger, and Expense Report." }
                ]
            },
            {
                name: "6.2 Financial Operations",
                requirements: [
                    { code: "REQ-ACC-002", title: "The system shall provide an Accounting Overview." },
                    { code: "REQ-ACC-003", title: "The system shall support the Journal Entry process." },
                    { code: "REQ-ACC-004", title: "The system shall manage Vendor Bills, Refunds, and Payment Details." },
                    { code: "REQ-ACC-005", title: "The system shall support Bill Approval with Invoice Report." },
                    { code: "REQ-ACC-006", title: "The system shall manage Customer Invoice Details, Credit Notes, and All Payment Details." },
                    { code: "REQ-ACC-007", title: "The system shall manage Office Expense Management." },
                    { code: "REQ-ACC-008", title: "The system shall manage Employee Expense details." },
                    { code: "REQ-ACC-009", title: "The system shall allow for manual collection entry by the accounting department after receiving payments." }
                ]
            }
        ]
    },
    {
        module: "7. CRM Module",
        submodules: [
            {
                name: "CRM",
                requirements: [
                    { code: "REQ-CRM-001", title: "The system shall allow daily visit / lead entry by the sales team in CRM." },
                    { code: "REQ-CRM-002", title: "The system shall enable individual lead reports." },
                    { code: "REQ-CRM-003", title: "The system shall support lead assignment by salesperson." }
                ]
            }
        ]
    },
    {
        module: "8. Contact Module",
        submodules: [
            {
                name: "Contact Management",
                requirements: [
                    { code: "REQ-CNT-001", title: "The system shall allow for contact entry with category creation (By Tag)." },
                    { code: "REQ-CNT-002", title: "The system shall enable the export of categorized contact details in Excel format." },
                    { code: "REQ-CNT-003", title: "The system shall be able to send bulk email/SMS to persons in the contact module. In that case, the client will provide SMS for sending from the system." }
                ]
            }
        ]
    },
    {
        module: "9. Internal Notification System",
        submodules: [
            {
                name: "Notifications",
                requirements: [
                    { code: "REQ-NOTIF-001", title: "The system shall provide an internal notification to email system for alerts, approvals, rejections, and follow-ups." },
                    { code: "REQ-NOTIF-002", title: "Approval notifications may also be sent to email." }
                ]
            }
        ]
    }
];
