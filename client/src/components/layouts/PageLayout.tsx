import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
	className?: string;
	children: ReactNode;
}

export default function PageLayoutComponent({ className, children }: Props) {
	return <div className={twMerge('p-3', className)}>{children}</div>
}