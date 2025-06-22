import { Property, PropertyKind, Provider, ServiceAccount, Bill, PaySystem } from '@/types/accounts';

// Mock property kinds
export const MOCK_PROPERTY_KINDS: PropertyKind[] = [
  { id: 1, title: "Apartment", commercial: false },
  { id: 2, title: "House", commercial: false },
  { id: 3, title: "Commercial Building", commercial: true },
  { id: 4, title: "Office", commercial: true }
];

// Mock properties using your database structure
export const MOCK_PROPERTIES: Property[] = [
  {
    id: 1,
    address_txt: "Булевар краља Александра 28, Београд 11000",
    address: { street: "Булевар краља Александра", number: "28", city: "Београд", postal: "11000" },
    commercial: false,
    property_kind_id: 1,
    data: { 
      name: "Belgrade City Apartments",
      contractNumber: "BG-2024-001"
    }
  },
  {
    id: 2,
    address_txt: "Змај Јовина 15, Нови Сад 21000",
    address: { street: "Змај Јовина", number: "15", city: "Нови Сад", postal: "21000" },
    commercial: false,
    property_kind_id: 2,
    data: { 
      name: "Novi Sad Residence",
      contractNumber: "NS-2024-002"
    }
  },
  {
    id: 3,
    address_txt: "Трг слободе 1, Суботица 24000",
    address: { street: "Трг слободе", number: "1", city: "Суботица", postal: "24000" },
    commercial: false,
    property_kind_id: 2,
    data: { 
      name: "Subotica House",
      contractNumber: "SU-2024-003"
    }
  }
];

// Mock providers
export const MOCK_PROVIDERS: Provider[] = [
  { id: 1, title: "Електропривреда Србије", active: true, created: "2024-01-01T00:00:00Z", kind: "electricity" },
  { id: 2, title: "Београдски водовод", active: true, created: "2024-01-01T00:00:00Z", kind: "water" },
  { id: 3, title: "Србијагас", active: true, created: "2024-01-01T00:00:00Z", kind: "gas" },
  { id: 4, title: "Електровојводина", active: true, created: "2024-01-01T00:00:00Z", kind: "electricity" },
  { id: 5, title: "ЈКП Водовод и канализација Нови Сад", active: true, created: "2024-01-01T00:00:00Z", kind: "water" },
  { id: 6, title: "Суботица Гас", active: true, created: "2024-01-01T00:00:00Z", kind: "heating" },
  { id: 7, title: "ЈКП Водовод и канализација Суботица", active: true, created: "2024-01-01T00:00:00Z", kind: "water" }
];

// Mock service accounts using your database structure
export const MOCK_SERVICE_ACCOUNTS: ServiceAccount[] = [
  {
    id: 1,
    property_id: 1,
    provider_id: 1,
    account_number: "EPS-12345",
    description: "Main electricity meter",
    billing_day: 15,
    flat_rate: false,
    account_type: "personal"
  },
  {
    id: 2,
    property_id: 1,
    provider_id: 2,
    account_number: "BVK-67890",
    description: "Water supply",
    billing_day: 20,
    flat_rate: false,
    account_type: "personal"
  },
  {
    id: 3,
    property_id: 1,
    provider_id: 3,
    account_number: "SRB-11111",
    description: "Gas heating",
    billing_day: 25,
    flat_rate: false,
    account_type: "personal"
  },
  {
    id: 4,
    property_id: 2,
    provider_id: 4,
    account_number: "EV-22222",
    description: "Electricity meter",
    billing_day: 1,
    flat_rate: false,
    account_type: "personal"
  },
  {
    id: 5,
    property_id: 2,
    provider_id: 5,
    account_number: "VNS-33333",
    description: "Water supply",
    billing_day: 5,
    flat_rate: false,
    account_type: "personal"
  },
  {
    id: 6,
    property_id: 3,
    provider_id: 6,
    account_number: "SUG-44444",
    description: "Heating system",
    billing_day: 10,
    flat_rate: true,
    account_type: "personal"
  },
  {
    id: 7,
    property_id: 3,
    provider_id: 7,
    account_number: "VSU-55555",
    description: "Water and sewage",
    billing_day: 12,
    flat_rate: false,
    account_type: "personal"
  }
];

// Mock payment systems
export const MOCK_PAYSYSTEMS: PaySystem[] = [
  { id: 1, title: "Credit Card" },
  { id: 2, title: "Bank Transfer" },
  { id: 3, title: "PayPal" },
  { id: 4, title: "Crypto" }
];

// Mock bills using your database structure
export const MOCK_BILLS: Bill[] = [
  {
    id: 1,
    service_account_id: 1,
    issue_date: "2025-01-15",
    due_date: "2025-02-15",
    amount: 150.00,
    status: "pending"
  },
  {
    id: 2,
    service_account_id: 2,
    issue_date: "2025-01-20",
    due_date: "2025-02-20",
    amount: 75.50,
    status: "pending"
  },
  {
    id: 3,
    service_account_id: 3,
    issue_date: "2024-12-25",
    due_date: "2025-01-25",
    amount: 95.25,
    status: "paid",
    payed_date: "2025-01-25T10:30:00Z",
    payment_id: 1
  },
  {
    id: 4,
    service_account_id: 4,
    issue_date: "2025-02-01",
    due_date: "2025-03-01",
    amount: 120.75,
    status: "pending"
  },
  {
    id: 5,
    service_account_id: 5,
    issue_date: "2024-12-05",
    due_date: "2025-01-05",
    amount: 45.00,
    status: "paid",
    payed_date: "2025-01-05T15:45:00Z",
    payment_id: 2
  },
  // Historical data for analytics
  {
    id: 6,
    service_account_id: 1,
    issue_date: "2024-11-15",
    due_date: "2024-12-15",
    amount: 142.50,
    status: "paid",
    payed_date: "2024-12-16T09:30:00Z",
    payment_id: 3
  },
  {
    id: 7,
    service_account_id: 2,
    issue_date: "2024-11-20",
    due_date: "2024-12-20",
    amount: 68.75,
    status: "paid",
    payed_date: "2024-12-19T14:20:00Z",
    payment_id: 4
  },
  {
    id: 8,
    service_account_id: 3,
    issue_date: "2024-10-25",
    due_date: "2024-11-25",
    amount: 88.90,
    status: "paid",
    payed_date: "2024-11-24T11:15:00Z",
    payment_id: 5
  },
  {
    id: 9,
    service_account_id: 4,
    issue_date: "2024-10-01",
    due_date: "2024-11-01",
    amount: 115.30,
    status: "paid",
    payed_date: "2024-11-01T08:45:00Z",
    payment_id: 6
  },
  {
    id: 10,
    service_account_id: 5,
    issue_date: "2024-09-05",
    due_date: "2024-10-05",
    amount: 42.80,
    status: "paid",
    payed_date: "2024-10-05T16:30:00Z",
    payment_id: 7
  }
];