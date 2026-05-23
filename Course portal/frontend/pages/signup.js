import { useState } from 'react'
import axios from 'axios'

export default function SignUpPage() {
    const [first_name, setFirstName] = useState('')
    const [last_name, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSignUp = async () => {
        setError('')

        if (!username || !password || !email || !first_name || !last_name) {
            setError('Please fill in all fields')
            return
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/auth/signup/', {
                first_name: first_name,
                last_name: last_name,
                email: email,
                username: username,
                password: password
            })
            window.location.href = '/login'
        } catch (err) {
            if (err.response && err.response.data) {
                const errors = err.response.data
                const firstError = Object.values(errors)[0]
                if (Array.isArray(firstError)) {
                    setError(firstError[0])
                } else {
                    setError(firstError)
                }
            } else {
                setError('Something went wrong. Try again.')
    }
}
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>

                {error && (
                    <div className="bg-red-100 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">
                        {error}
                    </div>
                )}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <input
                        type="text"
                        value={first_name}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter your first name"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-green-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <input
                        type="text"
                        value={last_name}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter your last name"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-green-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-green-500"
                    />
                </div>

                

                

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
                    onClick={handleSignUp}
                    className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700">
                    Sign Up
                </button>
                <p className="text-center text-sm mt-4 text-gray-500">
                    Already have an account{' '}
                    <a href="/login" className="text-green-600 font-medium">Login</a>
                </p>

                
            </div>
        </div>
    )
}