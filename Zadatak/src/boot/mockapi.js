export const api = {
  users: [],
  parking: [
    { id: 1, type: "student", taken: false },
    { id: 2, type: "vip", taken: true },
    { id: 3, type: "invalid", taken: false },
    { id: 4, type: "student", taken: true }
  ],

  register(username) {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.users.push({ username, code });
    return code;
  },

  login(username, code) {
    return this.users.find(
      u => u.username === username && u.code === code
    );
  }
};