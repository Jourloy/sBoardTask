import { ActionIcon, Flex, Group } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";

interface Props {
	toggleUser: () => void;
}
export default function HeaderComponent(props: Props) {

	return (<>
			<Flex justify={`center`} align={`center`} style={{width: `100%`, height: `60px`}}>
			<Group position={`apart`} style={{maxWidth: `850px`, width: `100%`}}>
				<Flex>
					<h1>J</h1>
					<h1>O</h1>
					<h1>U</h1>
					<h1 style={{rotate: `180deg`}} className={`mainR`}>R</h1>
					<h1>L</h1>
					<h1>O</h1>
					<h1>Y</h1>
				</Flex>
				<ActionIcon size={32} onClick={props.toggleUser}>
					<IconUser color={`white`} stroke={1.5} size={32}/>
				</ActionIcon>
			</Group>
			</Flex>
	</>)
}