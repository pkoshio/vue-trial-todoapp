var STORAGE_KEY = 'todos-vuejs-demo'
var todoStorage = {
    fetch: function() {
        var todos = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || '[]'
        )
        todos.forEach(function(todo, index) {
            todo.id = index
        })
        todoStorage.uid = todos.length
        return todos
    },
    save: function(todos) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    }
}

var app = new Vue({
    el: '#app',
    data: {
        headers: [
            {text: 'ID', value: 'id', class: "light-blue--text text--accent-4 font-weight-bold"},
            {text: 'コメント', value: 'comment', class: "light-blue--text text--accent-4 font-weight-bold"},
            {text: '状態', value: 'state', class: "light-blue--text text--accent-4 font-weight-bold"},
            {text: '-', value: 'deletebutton', class: "light-blue--text text--accent-4 font-weight-bold"},
        ],
        todos: [],
        options: [
            {value: -1, label: 'すべて'},
            {value:  0, label: '作業中'},
            {value:  1, label: '完了'}
        ],
        current: -1,
        questionList: [],
        comment: "",
        required: value => !!value || "入力してください",
    },
    methods: {
        doAdd: function(event, value) {
            var comment = this.comment
            this.todos.push({
                id: todoStorage.uid++,
                comment: comment,
                state: 0
            })
            this.$refs.form.reset()
        },
        doChangeState: function(item) {
            item.state = item.state ? 0: 1
        },
        doRemove: function(item) {
            var index = this.todos.indexOf(item)
            this.todos.splice(index, 1)
        }
    },
    watch: {
        todos: {
            handler: function(todos) {
                todoStorage.save(todos)
            },
            deep: true
        }
    },
    created() {
        this.todos = todoStorage.fetch()
    },
    computed: {
        computedTodos: function() {
            return this.todos.filter(function(el) {
                return this.current < 0 ? true : this.current == el.state
            }, this)
        },
        labels() {
            return this.options.reduce(function(a, b) {
                return Object.assign(a, { [b.value]: b.label })
            }, {})
        }
    },
    mounted() {
        axios
            .get('http://localhost:8000/api/')
            .then(response => {
                console.log("status:", response.status);
                this.questionList = response.data
            })
            .catch(err => {
                console.error(err)
            })
    },
    filters: {
        moment: function(date) {
            return moment(date).format("YYYY/MM/DD HH:mm");
        }
    }
})
