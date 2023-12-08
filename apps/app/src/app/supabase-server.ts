"use server";
import { Database } from "@strukt/database";
import { createServerComponentClient as _create } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { cache } from "react";

export const createServerComponentClient = cache(() =>
	_create<Database>({ cookies }),
);

export async function getSession() {
	const supabase = createServerComponentClient();
	try {
		const {
			data: { session },
		} = await supabase.auth.getSession();
		return session;
	} catch (error) {
		console.error("Error:", error);
		return null;
	}
}

export async function getUserDetails() {
	const supabase = createServerComponentClient();
	try {
		const { data: userDetails } = await supabase
			.from("users")
			.select("*")
			.single();
		return userDetails;
	} catch (error) {
		console.error("Error:", error);
		return null;
	}
}

export async function getSubscription() {
	const supabase = createServerComponentClient();
	try {
		const { data: subscription } = await supabase
			.from("subscriptions")
			.select("*, prices(*, products(*))")
			.in("status", ["trialing", "active"])
			.single()
			.throwOnError();
		console.log({ subscription });
		return subscription;
	} catch (error) {
		console.error("Error:", error);
		return null;
	}
}

export const getActiveProductsWithPrices = async () => {
	const supabase = createServerComponentClient();
	const { data, error } = await supabase
		.from("products")
		.select("*, prices(*)")
		.eq("active", true)
		.eq("prices.active", true)
		.order("metadata->index")
		.order("unit_amount", { foreignTable: "prices" });

	if (error) {
		console.log(error.message);
	}
	return data ?? [];
};