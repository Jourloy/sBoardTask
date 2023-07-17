import { AppShell, Card, Center, Grid, Header, Pagination, Text } from "@mantine/core";
import HeaderComponent from "../components/header";
import { useEffect, useState } from "react";
import UserModal from "./user";
import { createBackendContext } from "../context/backend.context";

export default function Main() {
	const backend = createBackendContext();
	
	const [userModal, setUserModal] = useState(false);
	const [todoArray, setTodoArray] = useState<{description: string; id: number, author: {username: string}}[]>([]);
	const [todoPage, setTodoPage] = useState(1);
	const [todoTotalPage, setTodoTotalPage] = useState(1);

	const getTodo = () => {
		backend.get(`/todo/owned?page=${todoPage}`).then(response => {
			if (response.status === 200) {
				setTodoArray(response.data.data);
			}
		});

		backend.get(`/todo/owned/pages`).then(response => {
			if (response.status === 200) {
				setTodoTotalPage(response.data.data);
			}
		});
	};

	const showTodo = () => {
		return todoArray.map(todo => (
			<Grid.Col span={12} key={todo.id}>
				<Card p={5} w={`100%`}>
					<Grid>
						<Grid.Col span={12}>
							<Text color={`#ffffff`}>{todo.description}</Text>
						</Grid.Col>
						<Grid.Col span={12}>
							<Text color={`#ffffff`}>Автор: {todo.author.username}</Text>
						</Grid.Col>
					</Grid>
				</Card>
			</Grid.Col>
		));
	};

	useEffect(() => {
		getTodo();
	}, [todoPage]);
	
	return (
		<>
			<UserModal onClose={() => setUserModal(false)} opened={userModal}/>
			<AppShell
				padding={`md`}
				header={<Header height={60}><HeaderComponent toggleUser={() => setUserModal(true)}/></Header>}
			>
				<Center>
				<Grid maw={`850px`} w={`100%`}>
					<Grid.Col span={12}>
						<Center>
						<h1>TODOшки</h1>
						</Center>
					</Grid.Col>
					<Grid.Col span={12}>
						<Grid>{showTodo()}</Grid>
					</Grid.Col>
					<Grid.Col span={12}>
						<Center>
							<Pagination total={todoTotalPage} onChange={setTodoPage} color={`indigo`} />
						</Center>
					</Grid.Col>
				</Grid>
				</Center>
				
			</AppShell>
		</>
	);
}
