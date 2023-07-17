import {
	ActionIcon,
	Button,
	Card,
	Center,
	Divider,
	Grid,
	Group,
	Modal,
	Pagination,
	PasswordInput,
	Space,
	Text,
	TextInput,
	Title,
} from "@mantine/core";
import {useEffect, useState} from "react";
import {createBackendContext} from "../../context/backend.context";
import Cookie from "js-cookie";
import {IconPencil, IconTrashX} from "@tabler/icons-react";

interface Props {
	onClose: () => void;
	opened: boolean;
}

const backend = createBackendContext();

export default function UserModal(props: Props) {
	const [logined, setLogined] = useState(false);
	const [username, setUsername] = useState(``);
	const [usernameError, setUsernameError] = useState<string | null>();
	const [password, setPassword] = useState(``);
	const [passwordError, setPasswordError] = useState<string | null>();

	const [todo, setTodo] = useState(``);
	const [todoArray, setTodoArray] = useState<{description: string; id: number}[]>([]);
	const [todoPage, setTodoPage] = useState(1);
	const [todoTotalPage, setTodoTotalPage] = useState(1);

	const controller = new AbortController();

	const checkUsername = (username: string) => {
		if (username.length < 3) {
			setUsernameError(`Имя должно быть не менее 3 символов`);
		} else {
			setUsername(username);
			setUsernameError(null);
		}
	};

	const checkPassword = (password: string) => {
		if (password.length < 3) {
			setPasswordError(`Пароль должен быть не менее 3 символов`);
		} else {
			setPassword(password);
			setPasswordError(null);
		}
	};

	const buttonDisabled = () => {
		if (usernameError || passwordError) return true;
		if (username === `` || password === ``) return true;

		return false;
	};

	const onSubmit = () => {
		if (usernameError || passwordError) return;
		if (username === `` || password === ``) return;

		backend.post(`/auth/login`, {username, password}).then(data => {
			Cookie.set(`access`, data.data.access);
			localStorage.setItem(`refresh`, data.data.refresh);
			setLogined(true);
		});
	};

	const logout = () => {
		Cookie.remove(`access`);
		localStorage.removeItem(`refresh`);
		setLogined(false);
	};

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

	const addTodo = () => {
		backend.post(`/todo/create`, {description: todo}).then(getTodo);
	};

	const updateTodo = (text: string, key: number) => {
		if (text === ``) return;
		backend.post(`/todo/update/${key}`, {description: text}).then(getTodo);
	};

	const removeTodo = (key: number) => {
		backend.post(`/todo/remove/${key}`).then(getTodo);
	};

	const showTodo = () => {
		let text = ``;
		return todoArray.map(todo => (
			<Grid.Col span={12} key={todo.id}>
				<Card p={5} w={`100%`}>
					<Grid columns={17}>
						<Grid.Col span={14}>
							<TextInput
								defaultValue={todo.description}
								onChange={e => (text = e.target.value)}
								color={`#ffffff`}
							/>
						</Grid.Col>
						<Grid.Col span={3}>
							<Group spacing={0} w={`100%`} position={`left`} mt={`3px`}>
								<ActionIcon onClick={() => updateTodo(text, todo.id)}>
									<IconPencil stroke={1} />
								</ActionIcon>
								<ActionIcon onClick={() => removeTodo(todo.id)}>
									<IconTrashX color={`red`} stroke={1} />
								</ActionIcon>
							</Group>
						</Grid.Col>
					</Grid>
				</Card>
			</Grid.Col>
		));
	};

	useEffect(() => {
		backend
			.get(`/auth/tokens`, {signal: controller.signal})
			.then(response => {
				if (response.status === 200) {
					Cookie.set(`access`, response.data.access);
					localStorage.setItem(`refresh`, response.data.refresh);
					setLogined(true);
					getTodo();
				}
			})
			.catch(() => {
				setLogined(false);
			});

		return () => {
			controller.abort();
		};
	}, []);

	useEffect(() => {
		getTodo();
	}, [todoPage]);

	if (!logined)
		return (
			<>
				<Modal withCloseButton={false} centered onClose={props.onClose} opened={props.opened}>
					<Grid>
						<Grid.Col span={12}>
							<Center>
								<Title>Пользователь</Title>
							</Center>
						</Grid.Col>

						<Grid.Col span={12}>
							<Divider />
						</Grid.Col>

						<Grid.Col span={12}>
							<TextInput
								placeholder={`Jourloy`}
								label={`Никнейм`}
								error={usernameError}
								onChange={e => checkUsername(e.target.value)}
							/>
						</Grid.Col>

						<Grid.Col span={12}>
							<PasswordInput
								placeholder={`Password`}
								label={`Пароль`}
								error={passwordError}
								onChange={e => checkPassword(e.target.value)}
							/>
						</Grid.Col>

						<Grid.Col span={12}>
							<Space h={`xs`} />
						</Grid.Col>

						<Grid.Col span={12}>
							<Button w={`100%`} color={`green`} disabled={buttonDisabled()} onClick={onSubmit}>
								Войти
							</Button>
						</Grid.Col>

						<Grid.Col span={12}>
							<Divider />
						</Grid.Col>

						<Grid.Col span={12}>
							<Text align={`center`} size={`sm`}>
								Если аккаунта нет, то вводи новые данные и он будет создан автоматически 😉
							</Text>
						</Grid.Col>
					</Grid>
				</Modal>
			</>
		);

	return (
		<>
			<Modal withCloseButton={false} centered onClose={props.onClose} opened={props.opened}>
				<Grid>
					<Grid.Col span={12}>
						<Center>
							<Title>Пользователь</Title>
						</Center>
					</Grid.Col>

					<Grid.Col span={12}>
						<Divider />
					</Grid.Col>

					<Grid.Col span={12}>
						<TextInput placeholder={`Хочу написать TODOшку`} onChange={e => setTodo(e.target.value)} />
					</Grid.Col>

					<Grid.Col span={12}>
						<Button w={`100%`} color={`indigo`} disabled={todo === ``} onClick={addTodo}>
							Добавить TODOшку
						</Button>
					</Grid.Col>

					<Grid.Col span={12}>
						<Divider />
					</Grid.Col>

					<Grid.Col span={12}>
						<Center>
							<Text size={`xl`}>Твои TODOшки:</Text>
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

					<Grid.Col span={12}>
						<Divider />
					</Grid.Col>

					<Grid.Col span={12}>
						<Button w={`100%`} color={`red`} variant={`outline`} onClick={logout}>
							Выйти
						</Button>
					</Grid.Col>
				</Grid>
			</Modal>
		</>
	);
}
