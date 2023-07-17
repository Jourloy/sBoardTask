import {PropsWithChildren} from "react";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DefaultContainer(props: PropsWithChildren) {
	return (
		<>
			<ToastContainer />
			{props.children}
		</>
	);
}
