<template>
    <div>
        <h2>Login</h2>
        <form @submit.prevent="registerUser">
            <!-- Add your registration form fields here -->
            <div>
                <label for="username">Username:</label>
                <input v-model="username" type="text" required />
            </div>
            <div>
                <label for="password">Password:</label>
                <input v-model="password" type="password" required />
            </div>
            <button type="submit">Login</button>
        </form>
    </div>
</template>
<script src="./index"></script>