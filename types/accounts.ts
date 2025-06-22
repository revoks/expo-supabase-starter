// Database types from your schema

// Property types
export interface PropertyKind {
	id: number;
	title: string;
	commercial: boolean;
}

export interface Property {
	id: number;
	address_txt?: string;
	address?: any; // JSON field
	commercial: boolean;
	property_kind_id: number;
	data?: any; // JSON field for extra data like name, etc
}

// User permission types
export type UserRole = "owner" | "family" | "tenant" | "other";

export interface PropertyPermission {
	id: number;
	property_id: number;
	user_id: string;
	user_role: UserRole;
	expire?: string;
}

// Provider types
export type ProviderKind =
	| "electricity"
	| "water"
	| "gas"
	| "internet"
	| "heating"
	| "other";

export const PROVIDER_KINDS: { type: ProviderKind | "all"; label: string }[] = [
	{ type: "all", label: "All Services" },
	{ type: "electricity", label: "Electricity" },
	{ type: "water", label: "Water" },
	{ type: "gas", label: "Gas" },
	{ type: "internet", label: "Internet" },
	{ type: "heating", label: "Heating" },
	{ type: "other", label: "Other" },
] as const;

export interface Provider {
	id: number;
	name: string;
	title: string;
	active: boolean;
	created: string;
	kind: ProviderKind;
}

// Service account types
export interface ServiceAccount {
	id: number;
	property_id: number;
	provider_id?: number;
	account_number?: string;
	description?: string;
	billing_day: number;
	flat_rate: boolean;
	account_type: string;
	provider?: Provider; // Joined data
	property?: Property; // Joined data
}

// Bill types
export interface Bill {
	id: number;
	service_account_id: number;
	property_id: number;
	issue_date: string;
	due_date?: string;
	amount: number;
	status?: string;
	details?: any; // JSON field
	payment_id?: number;
	payed_date?: string;
	service_account?: ServiceAccount; // Joined data
	payment?: Payment; // Joined data
}

// Payment system types
export interface PaySystem {
	id: number;
	title: string;
}

// Payment types
export interface Payment {
	id: number;
	bill_id: number;
	paysystem_id: number;
	create_date: string;
	process_date?: string;
	expire_date?: string;
	finish_date?: string;
	paid_at?: string;
	amount: number;
	amount_total: number;
	amount_provider: number;
	amount_fee: number;
	paysystem_order?: string;
	status?: string;
	success?: boolean;
	paysystem_data?: any; // JSON field
	user_id?: string;
}

// Context type definition
export interface AccountsContextType {
	// Data
	properties: Property[];
	propertyPermissions: PropertyPermission[];
	serviceAccounts: ServiceAccount[];
	providers: Provider[];
	bills: Bill[];
	payments: Payment[];
	paySystems: PaySystem[];

	// Property operations
	addProperty: (property: Omit<Property, "id">) => Promise<void>;
	updateProperty: (id: number, data: Partial<Property>) => Promise<void>;
	deleteProperty: (id: number) => Promise<void>;
	getUserProperties: () => Property[];

	// Service account operations
	addServiceAccount: (
		propertyId: number,
		service: Omit<ServiceAccount, "id" | "property_id">,
	) => Promise<void>;
	updateServiceAccount: (
		id: number,
		data: Partial<ServiceAccount>,
	) => Promise<void>;
	deleteServiceAccount: (id: number) => Promise<void>;
	getPropertyServices: (propertyId: number) => ServiceAccount[];

	// Bill operations
	getBillsByProperty: (propertyId: number) => Bill[];
	getBillsByServiceAccount: (serviceAccountId: number) => Bill[];
	getPendingBills: () => Bill[];
	getPaidBills: () => Bill[];

	// Payment operations
	createPayment: (billId: number, paySystemId: number) => Promise<void>;
	payBill: (billId: number) => Promise<void>;
	payAllBills: () => Promise<void>;

	// Analytics
	getMonthlySpending: () => { month: string; amount: number }[];
	getTotalDebt: () => number;
}
