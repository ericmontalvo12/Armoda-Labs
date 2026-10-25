import { cookies } from "next/headers";
import { CUSTOMER_COOKIE, readCustomerToken } from "@/lib/customer-auth";
import { getCustomerById, type Customer } from "@/lib/customers-db";

/**
 * Resolves the signed-in customer, or null.
 *
 * The token names an id; the record is read fresh on every call. Approval
 * status is therefore never stale — revoking an account takes effect on the
 * next request rather than whenever the cookie happens to expire.
 */
export async function getCurrentCustomer(): Promise<Customer | null> {
  const store = await cookies();
  const id = await readCustomerToken(store.get(CUSTOMER_COOKIE)?.value);
  if (id === null) return null;
  return getCustomerById(id);
}
