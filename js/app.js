(function (window) {
	// Your starting point. Enjoy the ride!
	let STORAGE_KEY = "todos";
	let todolistlocalStorage = {
		save: function (todos) {
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
		},
		fetch: function () {
			let todos = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
			return todos;
		},
	};
	new Vue({
		data: {
			title: "Liang's Todolist",
			todos: todolistlocalStorage.fetch() || [],
			newTodo: "",
			currentEdit: null,
			todolistFilterParam: "all",
		},
		directives: {
			focus: function (el) {
				el.focus();
			},
		},
		mounted: function () {
			this.$refs.headerInput.focus();
			console.log(this.todos.length)
		},
		computed: {
			// 计算属性的 getter
			todosFiltered() {
				switch (this.todolistFilterParam) {
					case "all":
						return this.todos;
						break;
					case "active":
						return this.todos.filter((todo) => todo.completed == false);
						break;
					case "completed":
						return this.todos.filter((todo) => todo.completed == true);
						break;
				}
			},
			itemToBeDoneLeft(){
				return this.todos.filter(e=>e.completed==false).length
			},
			itemCompleted(){
				return this.todos.filter(e=>e.completed).length
			}
		},

		methods: {
			addTodo: function () {
				var value = this.newTodo.trim();
				if (!value) {
					return;
				}
				this.todos.push({
					id: this.todos.length ? this.todos[this.todos.length - 1].id + 1 : 0,
					title: value,
					completed: false,
				});
				this.todolistFilterParam = "all";
				this.newTodo = "";
			},
			removeTodo(todo, index) {
				//注意随着增加和删除对数据的改变，index和todo.id 可能不相等
				console.log(index, todo.id);

				console.log(this.todos.findIndex((e) => e.id === todo.id));
				this.todos.splice(index, 1);
			},

			//定义一个中间变量 currentEdit,根据双击的todoItem动态添加类名：editing
			editTodo(todo, $event) {
				this.currentEdit = todo;
			},

			doneEdit(todo, index, $event) {
				let value = $event.target.value.trim();
				if (!value.length) {
					this.removeTodo(todo, index);
				} else {
					todo.title = value;
				}
				console.log($event.target);

				this.currentEdit = null;
			},

			handlerFilter(pram) {
				this.todolistFilterParam = pram;
			},
			clearCompleted(){
			this.todos=	this.todos.filter(e=>e.completed==false)
			}
		},
		watch: {
			todos: {
				handler(todos) {
					todolistlocalStorage.save(todos);
				},
				deep: true,
			},
		},
	}).$mount("#app");
})(window);
