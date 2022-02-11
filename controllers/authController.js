//register login logout
const register = async (req, res) => {
    res.status(200).send("Register user")
}

const login = async (req, res) => {
    res.status(200).send("Login user")
}

const logout = async (req, res) => {
    res.status(200).send("Logout user")
}

module.exports = {
    register,
    login,
    logout
}