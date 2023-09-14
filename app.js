const app = Vue.createApp({
    data() {
        return {
            tasks: [],
            projects: [],
            selectedProject: null,
            taskForm: {
                title: '',
                projectId: '',
            },
            projectForm: {
                name: '',
            },
            feedback: '',
        };
    },
    methods: {
        addTask() {
            if (this.taskForm.title && this.taskForm.projectId) {
                const newTask = {
                    id: Date.now(),
                    title: this.taskForm.title,
                    completed: false,
                    projectId: this.taskForm.projectId,
                };
                this.tasks.push(newTask);
                this.taskForm.title = '';
                this.taskForm.projectId = '';
                this.feedback = 'Task added successfully.';
                this.saveData();
            } else {
                this.feedback = 'Please enter a task title and select a project.';
            }
        },
        deleteTask(taskId) {
            this.tasks = this.tasks.filter(task => task.id !== taskId);
            this.saveData();
        },
        toggleTaskStatus(taskId) {
            const task = this.tasks.find(task => task.id === taskId);
            if (task) {
                task.completed = !task.completed;
                this.saveData();
            }
        },
        addProject() {
            if (this.projectForm.name) {
                const newProject = {
                    id: Date.now(),
                    name: this.projectForm.name,
                };
                this.projects.push(newProject);
                this.projectForm.name = '';
                this.feedback = 'Project added successfully.';
                this.saveData();
            } else {
                this.feedback = 'Please enter a project name.';
            }
        },
        deleteProject(projectId) {
            this.projects = this.projects.filter(project => project.id !== projectId);
            this.tasks = this.tasks.filter(task => task.projectId !== projectId);
            this.selectedProject = null;
            this.saveData();
        },
        saveData() {
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
            localStorage.setItem('projects', JSON.stringify(this.projects));
        },
    },
    computed: {
        filteredTasks() {
            return this.selectedProject
                ? this.tasks.filter(task => task.projectId === this.selectedProject.id)
                : this.tasks;
        },
    },
});

app.component('task-list', {
    template: `
        <div class="task-list">
            <h2>Task List</h2>
            <ul>
                <li v-for="task in $parent.tasks" :key="task.id">
                    <input type="checkbox" v-model="task.completed" @change="$parent.toggleTaskStatus(task.id)">
                    {{ task.title }}
                    <button @click="$parent.deleteTask(task.id)" class="delete-button">Delete</button>
                </li>
            </ul>
        </div>
    `,
});

app.component('task-form', {
    template: `
        <div class="task-form">
            <h2>Add New Task</h2>
            <form @submit.prevent="$parent.addTask">
                <label for="taskTitle">Title:</label>
                <input type="text" id="taskTitle" v-model="$parent.taskForm.title" required>
                <label for="taskProject">Project:</label>
                <select id="taskProject" v-model="$parent.taskForm.projectId">
                    <option value="">No Project</option>
                    <option v-for="project in $parent.projects" :value="project.id">{{ project.name }}</option>
                </select>
                <button type="submit">Add Task</button>
            </form>
            <p class="feedback">{{ $parent.feedback }}</p>
        </div>
    `,
});

app.component('project-list', {
    template: `
        <div class="project-list">
            <h2>Projects</h2>
            <ul>
                <li v-for="project in $parent.projects" :key="project.id">
                    <button @click="$parent.selectProject(project)" :class="{ active: project === $parent.selectedProject }">{{ project.name }}</button>
                    <button @click="$parent.deleteProject(project.id)" class="delete-button">Delete</button>
                </li>
            </ul>
        </div>
    `,
});

app.component('project-form', {
    template: `
        <div class="project-form">
            <h2>Add New Project</h2>
            <form @submit.prevent="$parent.addProject">
                <label for="projectName">Name:</label>
                <input type="text" id="projectName" v-model="$parent.projectForm.name" required>
                <button type="submit">Add Project</button>
            </form>
            <p class="feedback">{{ $parent.feedback }}</p>
        </div>
    `,
});

const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
const savedProjects = JSON.parse(localStorage.getItem('projects')) || [];

if (savedTasks.length > 0) {
    app.data().tasks = savedTasks;
}

if (savedProjects.length > 0) {
    app.data().projects = savedProjects;
}

const vm = app.mount('#app');
