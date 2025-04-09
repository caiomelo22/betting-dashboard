<template>
    <div style="display: flex; justify-content: center;">
        <div style="width: fit-content;">
            <form @submit.prevent="registerUser">
                <!-- Add your registration form fields here -->
                <div>
                    <label for="username">Username:</label>
                    <input v-model="username" class="auth-field" type="text" required />
                </div>
                <div>
                    <label for="email">Email:</label>
                    <input v-model="email" class="auth-field" type="email" required />
                </div>
                <div>
                    <label for="password">Password:</label>
                    <input v-model="password" class="auth-field" type="password" required />
                </div>
                <div style="display: flex; justify-content: center; margin: 12px 0px">
                    <v-btn color="green" class="dialog-btn" type="submit" :loading="loading" dark>
                        Register
                    </v-btn>
                </div>
            </form>
        </div>
    </div>
</template>
<script src="./index"></script>