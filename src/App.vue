<template>
	<div>
		<v-app>
			<v-content>
				<v-app-bar color="primary" dark app mb-5>
					<v-toolbar-title>
						<h1>TODOリスト</h1>
					</v-toolbar-title>
				</v-app-bar>

				<v-container>
					<h2 class="mt-5 text-center">新しい作業の追加</h2>
					<form class="add-item pt-5" @submit.prevent="addTodo">
						タスク内容: <input type="text" ref="name" class="newtask" />
						<v-btn rounded type="submit" color="primary">追加</v-btn>
					</form>
					<hr />
				</v-container>

				<v-container>
					<h2 class="mt-5 text-center">登録済の作業一覧</h2>
					<div class="mb-5 mt-5 text-right">
						<label v-for="[state, text] in Array.from(labels)" :key="state">
							<input type="radio" v-model="current" :value="state" />
							{{ text }}
						</label>
					</div>

					<p class="ml-5 mb-5">
						<span class="number-display">{{ filteredTodos.length }} 件</span
						>を表示中
					</p>

					<table class="mt-5 mb-5">
						<thead>
							<tr>
								<th class="id">ID</th>
								<th class="comment">タスク</th>
								<th class="state">状況</th>
								<th class="button">削除</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="todo in filteredTodos" :key="todo.id">
								<th>{{ todo.id }}</th>
								<td>{{ todo.name }}</td>
								<td class="state">
									<button @click="toggleState(todo)">
										<v-btn color="yellow">{{ labels.get(todo.state) }}</v-btn>
									</button>
								</td>
								<td class="button">
									<v-btn
										small
										class="ma-1"
										color="error"
										fab
										@click="removeTodo(todo)"
									>
										<v-icon>mdi-trash-can-outline</v-icon>
									</v-btn>
								</td>
							</tr>
						</tbody>
					</table>
				</v-container>

				<v-footer color="primary" dark app>
					TODOリスト -Vue/TypeScript
				</v-footer>
			</v-content>
		</v-app>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import TodoStorage from "@/todoStorage";
import { State, TodoItem } from "@/todoItem.ts";

const todoStorage = new TodoStorage();

@Component
export default class App extends Vue {
  private todos: TodoItem[] = [];

  justify = ["start", "end", "center", "space-between", "space-around"];

  private labels = new Map<State, string>([
    [State.All, "全て"],
    [State.Working, "作業中"],
    [State.Done, "完了"]
  ]);

  private current: State = State.All;

  private get filteredTodos() {
    return this.todos.filter(t =>
      this.current === State.All ? true : this.current === t.state
    );
  }

  private created() {
    this.todos = todoStorage.fetchAll();
  }

  private addTodo() {
    const name = this.$refs.name as HTMLInputElement;
    if (!name.value.length) {
      return;
    }
    this.todos.push({
      id: todoStorage.nextId,
      name: name.value,
      state: State.Working
    });
    name.value = "";
  }

  private removeTodo(todo: TodoItem) {
    const index = this.todos.indexOf(todo);
    this.todos.splice(index, 1);
  }

  private toggleState(todo: TodoItem) {
    todo.state = todo.state === State.Working ? State.Done : State.Working;
  }

  @Watch("todos", { deep: true })
  private onTodoChanged(todos: TodoItem[]) {
    todoStorage.save(todos);
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}

#app {
  max-width: 640px;
  margin: 0 auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  border-bottom: 2px solid #1a76d2;
  color: #1a76d2;
}

th,
th {
  padding: 0 8px;
  line-height: 40px;
}

thead th.id {
  width: 50px;
}

thead th.state {
  width: 100px;
}

thead th.button {
  width: 60px;
}

tbody td.button,
tbody td.state {
  text-align: center;
}

tbody tr td,
tbody tr th {
  border-bottom: 1px solid #ccc;
  transition: All 0.4s;
}

tbody tr.Done td,
tbody tr.Done th {
  background: #f8f8f8;
  color: #bbb;
}

tbody tr:hover td,
tbody tr:hover th {
  background: #f4fbff;
}

.add-item {
  margin: 0 auto;
  text-align: center;
}
.newtask {
  border: 0;
  padding: 5px;
  font-size: 1.4em;
  border: solid 2px #ccc;
  margin: 0 20px 50px 0;
  width: 50%;
}
.number-display {
  font-weight: bold;
}
h1 {
  font-size: 24px;
  text-align: center;
}
.v-toolbar__title {
  margin: 0 auto;
}
</style>
