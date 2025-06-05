"use client"
import { useEffect } from "react"
import { useSession } from "next-auth/react";
import { syncUserDataIfOnline } from "./utils/syncUser"

export default function SyncUserData() {
	const { status } = useSession();
	useEffect(() => {
		if (status === "authenticated") {
			syncUserDataIfOnline();
		}
	}, [status]);
	return null;
}