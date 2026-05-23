import { useState } from 'react'
import axios from 'axios'

export default function LoginPage() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleLogin = async () => {
        setError('')

        if (!username || !password) {
            setError('Please fill in all fields')
            return
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/auth/login/', {
                username: username,
                password: password
            })
            const token = response.data.access
            localStorage.setItem('token', response.data.access)



             const userResponse = await axios.get('http://127.0.0.1:8000/api/auth/user/', {
            headers: { Authorization: `Bearer ${token}` }
        })
        localStorage.setItem('role', userResponse.data.role)

        if (userResponse.data.role === 'admin') {
            window.location.href = '/admin/courses'
        } else {
            window.location.href = '/courses'
        }
        } catch (error) {
            setError('Invalid username or password')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

                {error && (
                    <div className="bg-red-100 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-green-500"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-green-500"
                    />
                </div>

                <button
                    onClick={handleLogin}
                    className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700">
                    Sign In
                </button>

                <p className="text-center text-sm mt-4 text-gray-500">
                    Don't have an account?{' '}
                    <a href="/signup" className="text-green-600 font-medium">Sign up</a>
                </p>
            </div>
        </div>
    )
}