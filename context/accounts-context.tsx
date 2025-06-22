import {
	createContext,
	useContext,
	useState,
	useCallback,
	useMemo,
	ReactNode,
} from "react";
import {
	Property,
	PropertyPermission,
	ServiceAccount,
	Provider,
	Bill,
	Payment,
	PaySystem,
	AccountsContextType,
} from "@/types/accounts";
import {
	MOCK_PROPERTIES,
	MOCK_PROVIDERS,
	MOCK_SERVICE_ACCOUNTS,
	MOCK_PAYSYSTEMS,
	MOCK_BILLS,
} from "@/data/mock";

// Create context with default values
const AccountsContext = createContext<AccountsContextType>({
	properties: MOCK_PROPERTIES,
	propertyPermissions: [],
	serviceAccounts: MOCK_SERVICE_ACCOUNTS,
	providers: MOCK_PROVIDERS,
	bills: MOCK_BILLS,
	payments: [],
	paySystems: MOCK_PAYSYSTEMS,
	addProperty: async () => {},
	updateProperty: async () => {},
	deleteProperty: async () => {},
	getUserProperties: () => [],
	addServiceAccount: async () => {},
	updateServiceAccount: async () => {},
	deleteServiceAccount: async () => {},
	getPropertyServices: () => [],
	getBillsByProperty: () => [],
	getBillsByServiceAccount: () => [],
	getPendingBills: () => [],
	getPaidBills: () => [],
	createPayment: async () => {},
	payBill: async () => {},
	payAllBills: async () => {},
	getMonthlySpending: () => [],
	getTotalDebt: () => 0,
});

// Provider implementation
export function AccountsProvider({ children }: { children: ReactNode }) {
	// Initialize state with mock data
	const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
	const [propertyPermissions, setPropertyPermissions] = useState<
		PropertyPermission[]
	>([]);
	const [serviceAccounts, setServiceAccounts] = useState<ServiceAccount[]>(
		MOCK_SERVICE_ACCOUNTS,
	);
	const [providers, setProviders] = useState<Provider[]>(MOCK_PROVIDERS);
	const [bills, setBills] = useState<Bill[]>(MOCK_BILLS);
	const [payments, setPayments] = useState<Payment[]>([]);
	const [paySystems, setPaySystems] = useState<PaySystem[]>(MOCK_PAYSYSTEMS);

	// Property operations
	const addProperty = useCallback(async (property: Omit<Property, "id">) => {
		setProperties((current) => [...current, { ...property, id: Date.now() }]);
	}, []);

	const updateProperty = useCallback(
		async (id: number, data: Partial<Property>) => {
			setProperties((current) =>
				current.map((property) =>
					property.id === id ? { ...property, ...data } : property,
				),
			);
		},
		[],
	);

	const deleteProperty = useCallback(async (id: number) => {
		setProperties((current) =>
			current.filter((property) => property.id !== id),
		);
		// Also remove related service accounts
		setServiceAccounts((current) =>
			current.filter((sa) => sa.property_id !== id),
		);
	}, []);

	const getUserProperties = useCallback(() => {
		// For now, return all properties. In real app, filter by user permissions
		return properties;
	}, [properties]);

	// Service account operations
	const addServiceAccount = useCallback(
		async (
			propertyId: number,
			service: Omit<ServiceAccount, "id" | "property_id">,
		) => {
			setServiceAccounts((current) => [
				...current,
				{
					...service,
					id: Date.now(),
					property_id: propertyId,
				},
			]);
		},
		[],
	);

	const updateServiceAccount = useCallback(
		async (id: number, data: Partial<ServiceAccount>) => {
			setServiceAccounts((current) =>
				current.map((service) =>
					service.id === id ? { ...service, ...data } : service,
				),
			);
		},
		[],
	);

	const deleteServiceAccount = useCallback(async (id: number) => {
		setServiceAccounts((current) =>
			current.filter((service) => service.id !== id),
		);
		// Also remove related bills
		setBills((current) =>
			current.filter((bill) => bill.service_account_id !== id),
		);
	}, []);

	const getPropertyServices = useCallback(
		(propertyId: number) => {
			return serviceAccounts.filter(
				(service) => service.property_id === propertyId,
			);
		},
		[serviceAccounts],
	);

	// Bill operations with enriched data
	const enrichBill = useCallback(
		(bill: Bill): Bill => {
			const serviceAccount = serviceAccounts.find(
				(sa) => sa.id === bill.service_account_id,
			);
			const provider = serviceAccount?.provider_id
				? providers.find((p) => p.id === serviceAccount.provider_id)
				: undefined;

			return {
				...bill,
				service_account: serviceAccount
					? {
							...serviceAccount,
							provider,
						}
					: undefined,
			};
		},
		[serviceAccounts, providers],
	);

	const getBillsByProperty = useCallback(
		(propertyId: number) => {
			const propertyServiceIds = serviceAccounts
				.filter((sa) => sa.property_id === propertyId)
				.map((sa) => sa.id);

			return bills
				.filter((bill) => propertyServiceIds.includes(bill.service_account_id))
				.map(enrichBill);
		},
		[bills, serviceAccounts, enrichBill],
	);

	const getBillsByServiceAccount = useCallback(
		(serviceAccountId: number) => {
			return bills
				.filter((bill) => bill.service_account_id === serviceAccountId)
				.map(enrichBill);
		},
		[bills, enrichBill],
	);

	const getPendingBills = useCallback(() => {
		return bills
			.filter((bill) => bill.status !== "paid" && !bill.payed_date)
			.map(enrichBill);
	}, [bills, enrichBill]);

	const getPaidBills = useCallback(() => {
		return bills
			.filter((bill) => bill.status === "paid" || bill.payed_date)
			.map(enrichBill);
	}, [bills, enrichBill]);

	// Payment operations
	const createPayment = useCallback(
		async (billId: number, paySystemId: number) => {
			const bill = bills.find((b) => b.id === billId);
			if (!bill) return;

			const payment: Payment = {
				id: Date.now(),
				bill_id: billId,
				paysystem_id: paySystemId,
				create_date: new Date().toISOString(),
				amount_total: bill.amount,
				amount_provider: bill.amount,
				amount_fee: 0,
				status: "pending",
			};

			setPayments((current) => [...current, payment]);
		},
		[bills],
	);

	const payBill = useCallback(async (billId: number) => {
		setBills((current) =>
			current.map((bill) =>
				bill.id === billId
					? {
							...bill,
							status: "paid",
							payed_date: new Date().toISOString(),
						}
					: bill,
			),
		);
	}, []);

	const payAllBills = useCallback(async () => {
		const pendingBills = bills.filter(
			(bill) => bill.status !== "paid" && !bill.payed_date,
		);
		const now = new Date().toISOString();

		setBills((current) =>
			current.map((bill) =>
				pendingBills.find((pb) => pb.id === bill.id)
					? {
							...bill,
							status: "paid",
							payed_date: now,
						}
					: bill,
			),
		);
	}, [bills]);

	// Analytics
	const getMonthlySpending = useCallback(() => {
		const paidBills = bills.filter((bill) => bill.payed_date);

		return paidBills.reduce(
			(acc: { month: string; amount: number }[], bill) => {
				const date = new Date(bill.payed_date!);
				const monthYear = date.toLocaleString("default", {
					month: "long",
					year: "numeric",
				});

				const existingMonth = acc.find((item) => item.month === monthYear);
				if (existingMonth) {
					existingMonth.amount += bill.amount;
				} else {
					acc.push({ month: monthYear, amount: bill.amount });
				}
				return acc;
			},
			[],
		);
	}, [bills]);

	const getTotalDebt = useCallback(() => {
		const pendingBills = bills.filter(
			(bill) => bill.status !== "paid" && !bill.payed_date,
		);
		return pendingBills.reduce((total, bill) => total + bill.amount, 0);
	}, [bills]);

	// Memoize context value to prevent unnecessary rerenders
	const value = useMemo(
		() => ({
			properties,
			propertyPermissions,
			serviceAccounts,
			providers,
			bills,
			payments,
			paySystems,
			addProperty,
			updateProperty,
			deleteProperty,
			getUserProperties,
			addServiceAccount,
			updateServiceAccount,
			deleteServiceAccount,
			getPropertyServices,
			getBillsByProperty,
			getBillsByServiceAccount,
			getPendingBills,
			getPaidBills,
			createPayment,
			payBill,
			payAllBills,
			getMonthlySpending,
			getTotalDebt,
		}),
		[
			properties,
			propertyPermissions,
			serviceAccounts,
			providers,
			bills,
			payments,
			paySystems,
			addProperty,
			updateProperty,
			deleteProperty,
			getUserProperties,
			addServiceAccount,
			updateServiceAccount,
			deleteServiceAccount,
			getPropertyServices,
			getBillsByProperty,
			getBillsByServiceAccount,
			getPendingBills,
			getPaidBills,
			createPayment,
			payBill,
			payAllBills,
			getMonthlySpending,
			getTotalDebt,
		],
	);

	return (
		<AccountsContext.Provider value={value}>
			{children}
		</AccountsContext.Provider>
	);
}

export function useAccounts() {
	const context = useContext(AccountsContext);

	if (context === undefined) {
		throw new Error("useAccounts must be used within an AccountsProvider");
	}
	return context;
}
