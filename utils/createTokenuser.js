const createTokenUser = (user) => {
    return {userId: user._id, username: user.name, role: user.role}
}

module.exports = createTokenUser